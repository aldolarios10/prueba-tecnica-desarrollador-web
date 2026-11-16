import Swal from 'sweetalert2'

/**
 * Alertas de la aplicación (sweetalert2) con un estilo consistente.
 */
export function useAlerts() {
  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  })

  return {
    success: (title: string) => toast.fire({ icon: 'success', title }),

    error: (text: string, title = 'Algo salió mal') =>
      Swal.fire({ icon: 'error', title, text, confirmButtonText: 'Entendido' }),

    async confirm(title: string, text: string, confirmButtonText = 'Sí, eliminar') {
      const result = await Swal.fire({
        icon: 'warning',
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        reverseButtons: true,
      })
      return result.isConfirmed
    },

    // Vista ampliada de una imagen adjunta, con enlace para descargarla
    preview(imageUrl: string, nombre: string) {
      const footer = document.createElement('a')
      footer.href = imageUrl
      footer.textContent = `Descargar ${nombre}`
      footer.className = 'text-decoration-none'

      return Swal.fire({
        imageUrl,
        imageAlt: nombre,
        footer,
        showConfirmButton: false,
        showCloseButton: true,
        width: 'auto',
        customClass: { image: 'img-fluid rounded m-0', popup: 'p-3' },
      })
    },
  }
}
