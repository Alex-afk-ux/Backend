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
mongodb://localhost:27017/<nombre_base_de_datos>
```
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
│       └── diagrama_domini_chubasquer....
├── api/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── producte.js
│   │   │   └── user.js
│   │   └── index.js
│   ├── index.env
│   ├── index.gitignore
│   ├── package-lock.json
│   └── package.json
└── README.md
```