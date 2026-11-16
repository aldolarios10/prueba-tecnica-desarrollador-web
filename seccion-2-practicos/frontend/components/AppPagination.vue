<script setup lang="ts">
const props = defineProps<{ page: number; totalPages: number; disabled?: boolean }>()
const emit = defineEmits<{ change: [page: number] }>()

// Ventana de hasta 5 páginas alrededor de la actual
const pages = computed(() => {
  const size = Math.min(5, props.totalPages)
  let start = Math.max(1, props.page - 2)
  start = Math.min(start, props.totalPages - size + 1)
  return Array.from({ length: size }, (_, i) => start + i)
})

function go(page: number) {
  if (props.disabled || page < 1 || page > props.totalPages || page === props.page) return
  emit('change', page)
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Paginación de tareas">
    <ul class="pagination justify-content-center flex-wrap mb-0">
      <li class="page-item" :class="{ disabled: page === 1 || disabled }">
        <button class="page-link" type="button" aria-label="Página anterior" @click="go(page - 1)">
          <i class="bi bi-chevron-left" aria-hidden="true" />
        </button>
      </li>
      <li v-for="p in pages" :key="p" class="page-item" :class="{ active: p === page }">
        <button
          class="page-link"
          type="button"
          :aria-current="p === page ? 'page' : undefined"
          @click="go(p)"
        >
          {{ p }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: page === totalPages || disabled }">
        <button class="page-link" type="button" aria-label="Página siguiente" @click="go(page + 1)">
          <i class="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>
