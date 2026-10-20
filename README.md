# Backend
Nom del projecte: E-commerce Full Stack

Tecnologies: React, Node.js/Express, MongoDB, Docker
Autor (nom complet teu)

Com executar el projecte (instruccions inicials)

## 🐳 Base de datos con Docker

La base de datos MongoDB se levanta con Docker Compose.

### Requisitos
- Docker Desktop instalado y en ejecución

### Arrancar MongoDB
```bash
cd Docker
docker compose up -d
```

Esto crea el contenedor `mongo-1` y expone MongoDB en el puerto `27017`.

### Comprobar que está funcionando
```bash
docker ps
```

Deberías ver el contenedor `mongo-1` con el puerto `27017:27017`.

### Parar el contenedor
```bash
docker compose down
```

### Cadena de conexión
```
mongodb://root:example@localhost:27017/<nombre_base_de_datos>?authSource=admin
```

## 🚀 API (Node.js / Express)

La API usa Express 5 y Mongoose para conectarse a MongoDB.

### Requisitos
- Node.js instalado
- MongoDB levantado (ver sección anterior)

### Configuración
Crea el archivo `api/index.env` con las variables de entorno:
```
PORT=3000
MONGO_URI=mongodb://root:example@localhost:27017/ecommerce?authSource=admin
```

> `index.env` está en el `.gitignore`, no se sube al repositorio.

### Instalar dependencias
```bash
cd api
npm install
```

### Arrancar la API en modo desarrollo
```bash
npm run dev
```

Arranca el servidor con `nodemon` en `http://localhost:3000`. Si todo va bien verás en consola:
```
MongoDB connectat correctament
Servidor escoltant al port 3000
```

### Endpoints de productos

Base: `/api/products`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/products` | Crear un producto |
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:id` | Obtener un producto por id |
| PUT | `/api/products/:id` | Modificar un producto |
| DELETE | `/api/products/:id` | Borrar un producto |

Ejemplo de cuerpo para crear un producto:
```json
{
  "name": "Chubasquero para pez payaso",
  "price": 19.99,
  "stock": 10,
  "targetSpecies": "Pez payaso",
  "size": "M",
  "color": "Amarillo"
}
```

Las respuestas siguen siempre el mismo formato:
```json
{ "status": "success", "data": { } }
{ "status": "error", "message": "Producte no trobat" }
```

## 🗃️ Modelos

### Product
| Campo | Tipo | Notas |
|-------|------|-------|
| `name` | String | Obligatorio |
| `price` | Number | Obligatorio, mínimo 0 |
| `stock` | Number | Por defecto 0, mínimo 0 |
| `targetSpecies` | String | Especie de pez a la que va dirigido |
| `size` | String | Talla |
| `color` | String | Color |

### User
| Campo | Tipo | Notas |
|-------|------|-------|
| `name` | String | Obligatorio |
| `email` | String | Obligatorio, único |
| `password` | String | Obligatorio, mínimo 6 caracteres |
| `role` | String | `client` o `admin`, por defecto `client` |

## 🧱 Arquitectura

La API sigue una estructura por capas:

```
Petición → routes → controllers → services → models → MongoDB
```

- **routes**: definen las rutas y las asocian a un controlador.
- **controllers**: gestionan la petición/respuesta HTTP y los códigos de estado.
- **services**: contienen la lógica de acceso a datos.
- **models**: esquemas de Mongoose.

## 🔍 Detalle de la carpeta `api/`

### Archivos de configuración

| Archivo | Para qué sirve |
|---------|----------------|
| `package.json` | Describe el proyecto y sus dependencias. El script `npm run dev` ejecuta `nodemon src/index.js`. |
| `package-lock.json` | Fija las versiones exactas instaladas. No se edita a mano. |
| `index.env` | Variables de entorno: `PORT` (puerto del servidor) y `MONGO_URI` (conexión a MongoDB). |
| `.gitignore` | Evita subir a Git `node_modules/`, `dist/`, `.env` e `index.env`. |

Dependencias:
- `express`: framework que crea el servidor y las rutas.
- `mongoose`: conecta con MongoDB y define los modelos.
- `dotenv`: lee las variables del archivo `index.env`.
- `nodemon` (solo desarrollo): reinicia el servidor al guardar cambios.

La variable `MONGO_URI` usa el usuario `root` y la contraseña `example` definidos en `Docker/docker-compose.yml`. El parámetro `authSource=admin` indica a MongoDB que valide el usuario contra la base de datos `admin`.

### Código en `src/`

**`index.js`** es el punto de entrada:
1. Carga `index.env`.
2. Crea la app de Express y activa `express.json()` para leer cuerpos JSON.
3. Llama a `connectDB()`.
4. Define la ruta `/`, que responde "API Ecommerce en marxa".
5. Monta las rutas de productos en `/api/products`.
6. Escucha en el puerto definido en `PORT` (3000 por defecto).

**`config/db.js`** contiene la función `connectDB`, que conecta con `MONGO_URI`. Si falla, muestra el error y cierra el programa con `process.exit(1)`.

### Capas de la API

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Rutas | `routes/productRoutes.js` | Asocia cada método HTTP y ruta con una función del controlador. |
| Controlador | `controllers/productController.js` | Recibe la petición, llama al servicio y devuelve la respuesta con su código HTTP. |
| Servicio | `services/productService.js` | Accede a la base de datos a través del modelo, sin nada de HTTP. |
| Modelo | `models/Product.js`, `models/user.js` | Esquemas de Mongoose con sus validaciones. |

Códigos de estado que devuelve el controlador:

| Código | Cuándo |
|--------|--------|
| `201` | Producto creado |
| `200` | Operación correcta |
| `400` | Error de validación o id inválido |
| `404` | Producto no encontrado |
| `500` | Error del servidor al listar productos |

Operaciones de Mongoose usadas en el servicio: `save`, `find`, `findById`, `findByIdAndUpdate` y `findByIdAndDelete`. En la actualización se usa `new: true` (devuelve el producto ya modificado) y `runValidators: true` (aplica las reglas del esquema también al editar).

> El modelo `User` está definido, pero todavía no tiene rutas, controlador ni servicio.

## 📚 Documentación

- [ADR-001: Base de datos del proyecto](Docs/Adrs/ADR-001-base-de-dades.md): se elige MongoDB (gestionada con Docker) por la flexibilidad del catálogo de productos.
- [ADR-002: Estructura inicial del proyecto](Docs/Adrs/ADR-002-estructura-projecte.md): se opta por un monorepo con backend y frontend en carpetas separadas.
- Diagrama de dominio: `Docs/Diagrams/diagrama_domini_chubasqueros_peces.png`

## 📁 Estructura del proyecto

```
.
├── Docker/
│   └── docker-compose.yml
├── Docs/
│   ├── Adrs/
│   │   ├── ADR-001-base-de-dades.md
│   │   └── ADR-002-estructura-projecte.md
│   └── Diagrams/
│       └── diagrama_domini_chubasqueros_peces.png
├── api/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── productController.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   └── user.js
│   │   ├── routes/
│   │   │   └── productRoutes.js
│   │   ├── services/
│   │   │   └── productService.js
│   │   └── index.js
│   ├── index.env
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
└── README.md
```
