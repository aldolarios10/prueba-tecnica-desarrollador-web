// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false, // SPA: se despliega como archivos estáticos
  devServer: { port: 3002 }, // la API ocupa el 3000
  modules: ['@pinia/nuxt'],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/main.css',
  ],
  runtimeConfig: {
    public: {
      // Se sobreescriben con NUXT_PUBLIC_API_BASE y NUXT_PUBLIC_API_TOKEN (.env)
      apiBase: 'http://localhost:3000',
      apiToken: '',
    },
  },
  app: {
    head: {
      title: 'Lista de Tareas',
      htmlAttrs: { lang: 'es' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
