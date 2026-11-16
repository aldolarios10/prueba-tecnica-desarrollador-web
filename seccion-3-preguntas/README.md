# SECCIÓN 3: PREGUNTAS TEÓRICAS

Respuestas a las cinco preguntas sobre el stack tecnológico de la prueba.

## Contenido

| # | Tema |
|---|------|
| 1 | [Arquitectura de Backend](#pregunta-1-arquitectura-de-backend) |
| 2 | [Bases de Datos (SQL vs NoSQL)](#pregunta-2-bases-de-datos-sql-vs-nosql) |
| 3 | [Seguridad y Middlewares](#pregunta-3-seguridad-y-middlewares) |
| 4 | [Gestión del Estado Global en Frontend](#pregunta-4-gestión-del-estado-global-en-frontend) |
| 5 | [Estrategias de Renderizado](#pregunta-5-estrategias-de-renderizado) |

---

## Pregunta 1: Arquitectura de Backend

> ¿Cuáles son las principales diferencias arquitectónicas entre Express y NestJS, y en qué tipo de
> proyectos o escenarios recomendarías utilizar uno sobre el otro?

Se podría decir que Express es un framework minimalista, ya que la parte esencial que debe llevar es
el enrutamiento y los middlewares, y en caso de llevar una estructura de carpetas, validaciones o
manejo de errores, eso el propio desarrollador decide cómo llevarlo. NestJS, que ocupa Express por
debajo, es más organizado, ya que te obliga a llevar una estructura en módulos, controladores y
servicios, aparte de decoradores e inyección de dependencias.

Yo usaría Express, por ejemplo, para APIs pequeñas, el prototipado de un proyecto o microservicios
pequeños, donde se ocupe avanzar rápido. NestJS lo ocuparía para proyectos más grandes en los que
colaboran varios desarrolladores, porque la estructura funciona como el estándar a seguir.

---

## Pregunta 2: Bases de Datos (SQL vs NoSQL)

> Explica las diferencias teóricas clave entre un motor de base de datos relacional y uno no
> relacional. ¿Qué factores tomarías en cuenta para elegir la base de datos ideal para una
> aplicación de tareas a gran escala?

Una base de datos relacional guarda todos los datos en tablas con un esquema fijo, y toda relación
se hace con llaves foráneas. Una base de datos no relacional, como MongoDB, guarda la información en
"documentos" de tipo JSON, su esquema es flexible y la información relacionada se puede anidar dentro
del mismo documento. Estas bases de datos son fáciles de escalar horizontalmente.

Para elegir una tecnología analizaría qué tanta relación tienen los datos, qué consultas voy a hacer,
la consistencia que se necesita e incluso la experiencia del equipo. En caso de hacer una app de
tareas a gran escala ocuparía PostgreSQL, porque en este caso existen relaciones claras (usuarios,
proyectos, tareas) y se necesita hacer filtros e incluso reportes. MongoDB sería perfecto si los
campos fueran variables.

---

## Pregunta 3: Seguridad y Middlewares

> Describe teóricamente cómo funciona el ciclo de vida de una petición HTTP que pasa por un
> middleware de autenticación. Además, explica brevemente el flujo de trabajo de la autenticación
> basada en JWT y por qué es preferida en APIs RESTful.

Cuando se realiza una petición, primero pasa por los middlewares en el orden en que se registraron.
El que se dedica a la autenticación revisa el header y valida el token de la petición. En caso de ser
correcto, guarda los datos del usuario y la petición continúa hacia el controlador. Si no tiene token
o es inválido, responde con un error `401` y la petición no pasa de ahí.

Con JWT, el usuario inicia sesión con sus credenciales y, si son correctas, el servidor regresa un
token que contiene el ID del usuario y una fecha de expiración, todo firmado por el servidor. El
cliente guarda ese token y en cada petición lo manda como `Bearer`, y el servidor solo verifica que
la firma sea válida y que no haya expirado. Es preferido en APIs REST porque el servidor no guarda
sesiones, lo que hace que escale fácil, y además es multiplataforma: sirve para la web, para una app
móvil o para otros servicios.

---

## Pregunta 4: Gestión del Estado Global en Frontend

> ¿Qué problemas arquitectónicos resuelve un gestor de estado global como Pinia en comparación con
> pasar props y emitir eventos de forma tradicional entre múltiples componentes anidados?

Si un componente anidado necesita un dato, ese dato tiene que pasar por todos los componentes
intermedios aunque no lo ocupen, y así el código es difícil de seguir e incluso de cambiar. También,
si dos componentes ocupan el mismo dato, se puede duplicar o desincronizar, porque no hay una sola
fuente de verdad.

Eso se resuelve con Pinia, ya que cualquier componente lee y modifica el store directamente, la
lógica queda en las actions y, en caso de errores, sabes dónde depurar porque todos los cambios de
estado pasan por el mismo lugar. Incluso herramientas como Vue DevTools te ayudan a ver esos cambios.

---

## Pregunta 5: Estrategias de Renderizado

> Define teóricamente SPA y SSR, e indica cuáles son las ventajas y desventajas de utilizar SSR con
> Nuxt 3, haciendo especial énfasis en el impacto sobre el SEO y el rendimiento (First Contentful
> Paint).

En una SPA el servidor manda un HTML casi vacío con el JavaScript y el navegador es el que arma toda
la página, después de la primera carga ya no se recarga completa, solo se piden los datos a la API y
se actualiza lo que cambia. En SSR el servidor arma el HTML ya con el contenido y lo manda listo al
navegador, y después Vue lo vuelve interactivo, a eso se le llama hidratación.

La ventaja de SSR con Nuxt 3 es que ayuda mucho al SEO, porque los buscadores leen el contenido sin
tener que ejecutar el JavaScript, y también mejora el First Contentful Paint porque el usuario ve
algo en pantalla más rápido sin esperar a que cargue todo el JavaScript. Las desventajas son que
ocupas un servidor con Node corriendo y ya no solo archivos estáticos, el servidor tiene más carga
cuando hay muchos usuarios y hay que cuidar el código porque cosas como `window` no existen en el
servidor. Yo usaría SSR en páginas públicas como una tienda o un blog, y para mi app de tareas usé
SPA porque no necesita SEO.
