# Ejercicio 1: Mini API de Tareas

API REST para crear, listar, actualizar y eliminar tareas, protegida con un token fijo y con soporte
para subir un archivo adjunto a cada tarea.

## Demo en vivo

| | |
|---|---|
| **URL base** | `http://3.149.7.210:3000` |
| **Estado del servicio** | [`/health`](http://3.149.7.210:3000/health) (pública, responde `{"status":"ok"}`) |
| **Token** | Lo comparto por correo junto con la entrega para no publicarlo en el repositorio |

## Requisitos cubiertos

| Requisito del enunciado | Cómo se resolvió |
|---|---|
| Crear, listar, actualizar y eliminar tareas | `POST`, `GET`, `PUT`/`PATCH` y `DELETE` en `/api/tareas` |
| Campos `id`, `titulo`, `descripcion`, `completado`, `fechaCreacion` | Esquema en [`src/models/Task.js`](src/models/Task.js). `id` y `fechaCreacion` los genera el servidor |
| MongoDB con Mongoose | Base de datos en MongoDB Atlas (nube) |
| Middleware de autenticación con token fijo | [`src/middlewares/auth.js`](src/middlewares/auth.js), header `Authorization: Bearer <token>` |
| **Extra:** archivo adjunto con S3 o FileSystem | Ambos. Se elige con `STORAGE_DRIVER=local` o `s3` ([`src/services/storage.js`](src/services/storage.js)) |
| **Opcional:** desplegar en AWS | Desplegada en AWS EC2 |

Además agregué **paginación, búsqueda por título y filtro por estado** en el listado.

## Tecnologías y por qué

- **Node.js + Express 5:** es el stack que sugiere el enunciado. Express es
  minimalista, así que para una API de este tamaño no hace falta la estructura extra de NestJS.
- **MongoDB Atlas + Mongoose:** una tarea es un documento simple con un adjunto opcional, así que
  encaja de forma natural en MongoDB. Usé Atlas para tener la base en la nube, sin instalar ni
  mantener un servidor de base de datos. Mongoose aporta las validaciones y genera las fechas
  automáticamente.
- **Multer:** recibe el archivo adjunto y el servicio de almacenamiento decide si va a disco o a S3.
- **Docker:** empaqueta la API para desplegarla igual en cualquier servidor.

## Endpoints

Todas las rutas de `/api/tareas` requieren el header `Authorization: Bearer <token>`. Sin él
responden `401`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado del servicio (pública) |
| `GET` | `/api/tareas` | Lista paginada. Query opcional: `page`, `limit`, `completado=true\|false`, `q` (busca en el título) |
| `GET` | `/api/tareas/:id` | Obtiene una tarea |
| `POST` | `/api/tareas` | Crea una tarea |
| `PUT` / `PATCH` | `/api/tareas/:id` | Actualiza una tarea |
| `DELETE` | `/api/tareas/:id` | Elimina la tarea y su adjunto |
| `POST` | `/api/tareas/:id/adjunto` | Sube o reemplaza el adjunto (campo `archivo`, máx. 5 MB) |
| `DELETE` | `/api/tareas/:id/adjunto` | Quita el adjunto |

## Despliegue

La API está desplegada en **AWS EC2** con Docker y conectada a **MongoDB Atlas**.

## Estructura

```
src/
├── server.js              # arranque: conecta a MongoDB y escucha
├── app.js                 # Express: CORS, rutas y manejo de errores
├── config/                # variables de entorno y conexión a la base
├── models/Task.js         # esquema de la tarea
├── middlewares/           # auth (token), upload (multer), errores
├── controllers/           # lógica de cada endpoint
├── routes/                # definición de rutas
└── services/storage.js    # adjuntos: disco local o S3
```
