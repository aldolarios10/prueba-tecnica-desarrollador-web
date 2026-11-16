export interface Attachment {
  nombre: string
  mimetype: string
  size: number
  url: string
}

export interface Task {
  id: string
  titulo: string
  descripcion: string
  completado: boolean
  fechaCreacion: string
  fechaActualizacion: string
  adjunto: Attachment | null
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TaskListResponse {
  data: Task[]
  pagination: Pagination
}

/** Datos que emite el formulario al guardar */
export interface TaskFormPayload {
  titulo: string
  descripcion: string
  completado: boolean
  archivo: File | null
  quitarAdjunto: boolean
}

export type StatusFilter = 'todas' | 'pendientes' | 'completadas'
