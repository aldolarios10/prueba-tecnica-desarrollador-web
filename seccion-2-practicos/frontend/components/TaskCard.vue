<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{ task: Task }>()
defineEmits<{ toggle: [task: Task]; edit: [task: Task]; remove: [task: Task] }>()

const fecha = computed(() =>
  new Date(props.task.fechaCreacion).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }),
)

// Si el adjunto es una imagen se muestra una miniatura en lugar del enlace
const esImagen = computed(() => props.task.adjunto?.mimetype.startsWith('image/') ?? false)
const imagenRota = ref(false)
watch(() => props.task.adjunto?.url, () => (imagenRota.value = false))

const alerts = useAlerts()
const verImagen = () => props.task.adjunto && alerts.preview(props.task.adjunto.url, props.task.adjunto.nombre)
</script>

<template>
  <div class="card task-card border-0 shadow-sm" :class="{ 'is-done': task.completado }">
    <div class="card-body d-flex gap-3">
      <input
        class="form-check-input task-check flex-shrink-0 mt-1"
        type="checkbox"
        :checked="task.completado"
        :aria-label="`Marcar «${task.titulo}» como ${task.completado ? 'pendiente' : 'completada'}`"
        @change="$emit('toggle', task)"
      >

      <div class="flex-grow-1" style="min-width: 0">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
          <h2 class="task-title h6 mb-0 text-break-all">{{ task.titulo }}</h2>
          <span class="badge" :class="task.completado ? 'text-bg-success' : 'text-bg-warning'">
            {{ task.completado ? 'Completada' : 'Pendiente' }}
          </span>
        </div>

        <p v-if="task.descripcion" class="text-secondary mb-2 text-break-all" style="white-space: pre-line">
          {{ task.descripcion }}
        </p>

        <button
          v-if="task.adjunto && esImagen && !imagenRota"
          type="button"
          class="task-thumb btn p-0 border rounded overflow-hidden mb-2"
          :aria-label="`Ver imagen ${task.adjunto.nombre}`"
          @click="verImagen"
        >
          <img :src="task.adjunto.url" :alt="task.adjunto.nombre" loading="lazy" @error="imagenRota = true">
        </button>

        <div class="d-flex flex-wrap align-items-center gap-3 small text-secondary">
          <span><i class="bi bi-calendar3 me-1" aria-hidden="true" />{{ fecha }}</span>
          <a
            v-if="task.adjunto && (!esImagen || imagenRota)"
            :href="task.adjunto.url"
            target="_blank"
            rel="noopener"
            class="text-decoration-none text-break-all"
          >
            <i class="bi bi-paperclip" aria-hidden="true" />{{ task.adjunto.nombre }}
          </a>
        </div>
      </div>

      <div class="d-flex flex-column flex-sm-row gap-2 align-self-start flex-shrink-0">
        <button
          class="btn btn-sm btn-outline-primary"
          type="button"
          :aria-label="`Editar «${task.titulo}»`"
          @click="$emit('edit', task)"
        >
          <i class="bi bi-pencil" aria-hidden="true" />
        </button>
        <button
          class="btn btn-sm btn-outline-danger"
          type="button"
          :aria-label="`Eliminar «${task.titulo}»`"
          @click="$emit('remove', task)"
        >
          <i class="bi bi-trash" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>
