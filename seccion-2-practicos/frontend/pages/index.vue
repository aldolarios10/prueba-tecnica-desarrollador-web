<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { StatusFilter, Task, TaskFormPayload } from '~/types/task'

const store = useTasksStore()
const { tasks, pagination, loading, loaded, isEmpty, hasFilters, status } = storeToRefs(store)
const alerts = useAlerts()

/* ---------- Carga y filtros ---------- */
async function load(page?: number) {
  try {
    await store.fetchTasks(page)
  } catch (error) {
    alerts.error(getErrorMessage(error), 'No se pudieron cargar las tareas')
  }
}
onMounted(() => load())

// La búsqueda espera a que el usuario deje de escribir
const searchInput = ref(store.search)
let searchTimer: ReturnType<typeof setTimeout>
watch(searchInput, (value) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    try {
      await store.setFilters({ search: value })
    } catch (error) {
      alerts.error(getErrorMessage(error))
    }
  }, 350)
})

async function onStatusChange(event: Event) {
  try {
    await store.setFilters({ status: (event.target as HTMLSelectElement).value as StatusFilter })
  } catch (error) {
    alerts.error(getErrorMessage(error))
  }
}

/* ---------- Formulario (crear / editar) ---------- */
const showForm = ref(false)
const editing = ref<Task | null>(null)
const saving = ref(false)

function openCreate() {
  editing.value = null
  showForm.value = true
}
function openEdit(task: Task) {
  editing.value = task
  showForm.value = true
}

async function onSave(payload: TaskFormPayload) {
  saving.value = true
  try {
    if (editing.value) {
      await store.updateTask(editing.value.id, payload)
      alerts.success('Tarea actualizada')
    } else {
      await store.createTask(payload)
      alerts.success('Tarea creada')
    }
    showForm.value = false
  } catch (error) {
    alerts.error(getErrorMessage(error), 'No se pudo guardar la tarea')
  } finally {
    saving.value = false
  }
}

/* ---------- Acciones por tarea ---------- */
async function onToggle(task: Task) {
  try {
    await store.toggleTask(task)
    alerts.success(task.completado ? 'Tarea marcada como pendiente' : '¡Tarea completada!')
  } catch (error) {
    alerts.error(getErrorMessage(error))
    load()
  }
}

async function onRemove(task: Task) {
  const ok = await alerts.confirm('¿Eliminar tarea?', `«${task.titulo}» se eliminará de forma permanente.`)
  if (!ok) return
  try {
    await store.deleteTask(task.id)
    alerts.success('Tarea eliminada')
  } catch (error) {
    alerts.error(getErrorMessage(error), 'No se pudo eliminar la tarea')
  }
}
</script>

<template>
  <div class="mx-auto" style="max-width: 820px">
    <!-- Encabezado -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <div>
        <h1 class="h3 mb-0">Mis tareas</h1>
        <p v-if="loaded" class="text-secondary small mb-0">
          {{ pagination.total }} {{ pagination.total === 1 ? 'tarea' : 'tareas' }}
          <template v-if="hasFilters">con los filtros actuales</template>
        </p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-plus-lg me-1" aria-hidden="true" />Nueva tarea
      </button>
    </div>

    <!-- Filtros -->
    <div class="row g-2 mb-3">
      <div class="col-12 col-sm-8">
        <div class="input-group">
          <span class="input-group-text bg-white"><i class="bi bi-search" aria-hidden="true" /></span>
          <input
            v-model="searchInput"
            type="search"
            class="form-control"
            placeholder="Buscar por título"
            aria-label="Buscar por título"
          >
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <select class="form-select" aria-label="Filtrar por estado" :value="status" @change="onStatusChange">
          <option value="todas">Todas</option>
          <option value="pendientes">Pendientes</option>
          <option value="completadas">Completadas</option>
        </select>
      </div>
    </div>

    <!-- Carga inicial -->
    <div v-if="!loaded && loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando tareas…</span>
      </div>
    </div>

    <!-- Error en la carga inicial -->
    <div v-else-if="!loaded" class="text-center py-5">
      <p class="text-secondary">No se pudieron cargar las tareas.</p>
      <button class="btn btn-outline-primary" type="button" @click="load()">Reintentar</button>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="isEmpty" class="card border-0 shadow-sm text-center py-5">
      <div class="card-body">
        <i class="bi bi-inbox display-4 text-secondary" aria-hidden="true" />
        <p class="mt-3 mb-1 fw-semibold">
          {{ hasFilters ? 'Ninguna tarea coincide con los filtros' : 'Aún no tienes tareas' }}
        </p>
        <p v-if="!hasFilters" class="text-secondary mb-3">Crea la primera para empezar.</p>
        <button v-if="!hasFilters" class="btn btn-primary" type="button" @click="openCreate">
          Crear tarea
        </button>
      </div>
    </div>

    <!-- Lista -->
    <div v-else class="d-flex flex-column gap-2" :class="{ 'opacity-50': loading }">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="onToggle"
        @edit="openEdit"
        @remove="onRemove"
      />
    </div>

    <!-- Paginación -->
    <div class="mt-4">
      <AppPagination
        :page="pagination.page"
        :total-pages="pagination.totalPages"
        :disabled="loading"
        @change="load"
      />
    </div>

    <TaskForm v-if="showForm" :task="editing" :saving="saving" @save="onSave" @close="showForm = false" />
  </div>
</template>
