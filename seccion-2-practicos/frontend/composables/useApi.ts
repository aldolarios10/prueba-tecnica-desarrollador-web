/**
 * Cliente HTTP para la API de tareas: añade la URL base y el token a cada petición.
 */
export function useApi() {
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBase,
    headers: { Authorization: `Bearer ${config.public.apiToken}` },
  })
}

/**
 * Convierte cualquier error de la API ({ message, errors }) en un texto para el usuario.
 */
export function getErrorMessage(error: unknown): string {
  const err = error as { data?: { message?: string; errors?: Record<string, string> }; status?: number }

  if (err?.data?.errors) return Object.values(err.data.errors).join('. ')
  if (err?.data?.message) return err.data.message
  if (!err?.status) return 'No se pudo conectar con el servidor. Revisa que la API esté en línea.'
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}
