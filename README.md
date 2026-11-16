# Prueba Técnica: Desarrollador Web

**Autor:** Aldo Larios

Solución a las tres secciones de la prueba técnica. Cada carpeta tiene su propio README con el
detalle de lo que se hizo.

## Contenido

| Sección | Carpeta | Qué incluye | Tecnologías |
|---|---|---|---|
| 1. Ejercicios lógico-matemáticos | [`seccion-1-logica/`](seccion-1-logica/README.md) | 4 ejercicios de lógica y 1 consulta SQL | Python, SQLite |
| 2. Ejercicio 1: Mini API de Tareas | [`seccion-2-practicos/api/`](seccion-2-practicos/api/README.md) | API REST con autenticación y archivos adjuntos | Node.js, Express, MongoDB Atlas, AWS EC2 |
| 2. Ejercicio 2: App de Lista de Tareas | [`seccion-2-practicos/frontend/`](seccion-2-practicos/frontend/README.md) | SPA que consume la API | Nuxt 3, Pinia, Bootstrap, vuelidate, sweetalert2 |
| 3. Preguntas teóricas | [`seccion-3-preguntas/`](seccion-3-preguntas/README.md) | Respuestas a las 5 preguntas | |

## Demo

La API está desplegada en AWS EC2: `http://3.149.7.210:3000`
([`/health`](http://3.149.7.210:3000/health) para comprobar que está en línea).

El token para consumirla lo comparto por correo junto con la entrega. El frontend ya apunta a esta
API, así que para probarlo solo hay que seguir los pasos de su
[README](seccion-2-practicos/frontend/README.md#cómo-correrla).

## Uso de IA

De acuerdo con lo que pide la prueba, declaro que usé **Claude Code** (asistente de IA en VS Code)
como apoyo. El código de los ejercicios de lógica de la sección 1 lo resolví sin IA.

**En qué me ayudó:**

- **Sección 2:** generar parte del código y la estructura inicial de la API y el frontend, y
  resolver dudas y errores durante el despliegue en AWS EC2.
- **Documentación:** apoyo en redactar y dar formato a los README de todas las secciones.

**Lo que hice yo:**

- Elegí el stack y cómo organizar el proyecto.
- Revisé y entendí el código generado, y lo ajusté cuando hizo falta.
- Configuré MongoDB Atlas y desplegué la API en AWS EC2.
- Probé la API y el frontend para comprobar que todo funcionara.

La IA es una herramienta que acelera el trabajo, pero solo funciona si sabes lo que estás haciendo:
hay que entender el código, saber qué pedirle y revisar lo que genera.
