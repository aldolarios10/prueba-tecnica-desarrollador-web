<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import type { Task, TaskFormPayload } from '~/types/task'

const MAX_FILE_MB = 5

const props = defineProps<{ task: Task | null; saving: boolean }>()
const emit = defineEmits<{ save: [payload: TaskFormPayload]; close: [] }>()

const isEdit = computed(() => props.task !== null)

const form = reactive({
  titulo: props.task?.titulo ?? '',
  descripcion: props.task?.descripcion ?? '',
  completado: props.task?.completado ?? false,
  archivo: null as File | null,
  quitarAdjunto: false,
})

/* ---------- Validaciones (vuelidate) ---------- */
const rules = {
  titulo: {
    required: helpers.withMessage('El título es obligatorio', required),
    minLength: helpers.withMessage('El título debe tener al menos 3 caracteres', minLength(3)),
    maxLength: helpers.withMessage('El título no puede superar los 120 caracteres', maxLength(120)),
  },
  descripcion: {
    maxLength: helpers.withMessage('La descripción no puede superar los 1000 caracteres', maxLength(1000)),
  },
  archivo: {
    maxSize: helpers.withMessage(
      `El archivo no puede pesar más de ${MAX_FILE_MB} MB`,
      (file: File | null) => !file || file.size <= MAX_FILE_MB * 1024 * 1024,
    ),
  },
}
const v$ = useVuelidate(rules, form)

function onFileChange(event: Event) {
  form.archivo = (event.target as HTMLInputElement).files?.[0] ?? null
  v$.value.archivo.$touch()
}

async function submit() {
  const valid = await v$.value.$validate()
  if (!valid) return
  emit('save', { ...form, titulo: form.titulo.trim(), descripcion: form.descripcion.trim() })
}

function close() {
  if (!props.saving) emit('close')
}

/* ---------- Comportamiento del modal ---------- */
const tituloInput = ref<HTMLInputElement | null>(null)
const onKeydown = (e: KeyboardEvent) => e.key === 'Escape' && close()

onMounted(() => {
  document.body.classList.add('modal-open')
  document.addEventListener('keydown', onKeydown)
  tituloInput.value?.focus()
})
onBeforeUnmount(() => {
  document.body.classList.remove('modal-open')
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div>
    <div
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
      @mousedown.self="close"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
        <form class="modal-content" novalidate @submit.prevent="submit">
          <div class="modal-header">
            <h1 id="task-form-title" class="modal-title h5">
              {{ isEdit ? 'Editar tarea' : 'Nueva tarea' }}
            </h1>
            <button type="button" class="btn-close" aria-label="Cerrar" :disabled="saving" @click="close" />
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label for="titulo" class="form-label">Título <span class="text-danger">*</span></label>
              <input
                id="titulo"
                ref="tituloInput"
                v-model="form.titulo"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.titulo.$error }"
                placeholder="Ej. Preparar la presentación"
                maxlength="120"
                @blur="v$.titulo.$touch()"
              >
              <div v-if="v$.titulo.$error" class="invalid-feedback">
                {{ v$.titulo.$errors[0]?.$message }}
              </div>
            </div>

            <div class="mb-3">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea
                id="descripcion"
                v-model="form.descripcion"
                class="form-control"
                :class="{ 'is-invalid': v$.descripcion.$error }"
                rows="4"
                placeholder="Detalles opcionales"
                @blur="v$.descripcion.$touch()"
              />
              <div v-if="v$.descripcion.$error" class="invalid-feedback">
                {{ v$.descripcion.$errors[0]?.$message }}
              </div>
              <div class="form-text text-end">{{ form.descripcion.length }}/1000</div>
            </div>

            <div class="mb-3">
              <label for="archivo" class="form-label">Archivo adjunto</label>

              <div
                v-if="task?.adjunto && !form.archivo"
                class="d-flex align-items-center justify-content-between gap-2 border rounded px-3 py-2 mb-2 small"
              >
                <span class="text-break-all" :class="{ 'text-decoration-line-through text-secondary': form.quitarAdjunto }">
                  <i class="bi bi-paperclip" aria-hidden="true" />{{ task.adjunto.nombre }}
                </span>
                <button
                  type="button"
                  class="btn btn-sm btn-link text-nowrap p-0"
                  :class="form.quitarAdjunto ? 'text-secondary' : 'text-danger'"
                  @click="form.quitarAdjunto = !form.quitarAdjunto"
                >
                  {{ form.quitarAdjunto ? 'Conservar' : 'Quitar' }}
                </button>
              </div>

              <input
                id="archivo"
                type="file"
                class="form-control"
                :class="{ 'is-invalid': v$.archivo.$error }"
                @change="onFileChange"
              >
              <div v-if="v$.archivo.$error" class="invalid-feedback">
                {{ v$.archivo.$errors[0]?.$message }}
              </div>
              <div v-else class="form-text">
                Opcional, máximo {{ MAX_FILE_MB }} MB.
                <template v-if="task?.adjunto">Si eliges uno nuevo, reemplaza al actual.</template>
              </div>
            </div>

            <div class="form-check form-switch">
              <input id="completado" v-model="form.completado" class="form-check-input" type="checkbox" role="switch">
              <label class="form-check-label" for="completado">Tarea completada</label>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" :disabled="saving" @click="close">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              {{ isEdit ? 'Guardar cambios' : 'Crear tarea' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="modal-backdrop fade show" />
  </div>
</template>
