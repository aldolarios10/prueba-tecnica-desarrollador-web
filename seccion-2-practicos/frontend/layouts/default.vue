<template>
  <div class="d-flex flex-column min-vh-100">
    <header>
      <nav class="navbar navbar-dark bg-primary shadow-sm">
        <div class="container">
          <NuxtLink to="/" class="navbar-brand fw-semibold">
            <i class="bi bi-check2-square me-2" aria-hidden="true" />Lista de Tareas
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="container flex-grow-1 py-4">
      <slot />
    </main>

    <footer class="border-top bg-white py-3">
      <div class="container text-center text-secondary small">
        App de Lista de Tareas · Nuxt 3 + Pinia
      </div>
    </footer>
  </div>
</template>
