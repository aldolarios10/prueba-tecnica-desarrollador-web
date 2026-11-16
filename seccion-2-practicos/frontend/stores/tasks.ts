import { defineStore } from 'pinia'
import type { Pagination, StatusFilter, Task, TaskFormPayload, TaskListResponse } from '~/types/task'

export const useTasksStore = defineStore('tasks', () => {
  /* ---------- Estado ---------- */
  const tasks = ref<Task[]>([])
  const pagination = ref<Pagination>({ page: 1, limit: 5, total: 0, totalPages: 1 })
  const search = ref('')
  const status = ref<StatusFilter>('todas')
  const loading = ref(false)
  const loaded = ref(false)

  const isEmpty = computed(() => loaded.value && tasks.value.length === 0)
  const hasFilters = computed(() => search.value.trim() !== '' || status.value !== 'todas')

  /* ---------- Acciones ---------- */
  async function fetchTasks(page = pagination.value.page) {
    loading.value = true
    try {
      const query: Record<string, string | number> = { page, limit: pagination.value.limit }
      if (search.value.trim()) query.q = search.value.trim()
      if (status.value !== 'todas') query.completado = String(status.value === 'completadas')

      const res = await useApi()<TaskListResponse>('/api/tareas', { query })

      // Si la página pedida quedó vacía (p. ej. tras eliminar), se retrocede una
      if (res.data.length === 0 && page > 1) return fetchTasks(page - 1)

      tasks.value = res.data
      pagination.value = res.pagination
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  function setFilters(filters: { search?: string; status?: StatusFilter }) {
    if (filters.search !== undefined) search.value = filters.search
    if (filters.status !== undefined) status.value = filters.status
    return fetchTasks(1)
  }

  async function uploadAttachment(id: string, archivo: File) {
    const body = new FormData()
    body.append('archivo', archivo)
    return useApi()<Task>(`/api/tareas/${id}/adjunto`, { method: 'POST', body })
  }

  async function createTask(payload: TaskFormPayload) {
    const { titulo, descripcion, completado, archivo } = payload
    const task = await useApi()<Task>('/api/tareas', {
      method: 'POST',
      body: { titulo, descripcion, completado },
    })
    try {
      if (archivo) await uploadAttachment(task.id, archivo)
    } finally {
      // La tarea ya existe aunque falle el adjunto: se refresca la lista igualmente
      await fetchTasks(1)
    }
  }

  async function updateTask(id: string, payload: TaskFormPayload) {
    const { titulo, descripcion, completado, archivo, quitarAdjunto } = payload
    const api = useApi()
    try {
      await api<Task>(`/api/tareas/${id}`, {
        method: 'PUT',
        body: { titulo, descripcion, completado },
      })
      if (archivo) await uploadAttachment(id, archivo)
      else if (quitarAdjunto) await api(`/api/tareas/${id}/adjunto`, { method: 'DELETE' })
    } finally {
      await fetchTasks()
    }
  }

  async function toggleTask(task: Task) {
    await useApi()<Task>(`/api/tareas/${task.id}`, {
      method: 'PATCH',
      body: { completado: !task.completado },
    })
    await fetchTasks()
  }

  async function deleteTask(id: string) {
    await useApi()(`/api/tareas/${id}`, { method: 'DELETE' })
    await fetchTasks()
  }

  return {
    tasks,
    pagination,
    search,
    status,
    loading,
    loaded,
    isEmpty,
    hasFilters,
    fetchTasks,
    setFilters,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  }
})
