# Proyecto de Gastos

Este proyecto es una aplicación de gestión de gastos que utiliza Node.js y PostgreSQL.

## Requisitos

- Docker
- Docker Compose

## Cómo iniciar

Para iniciar la aplicación, ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up --build
```

Esto iniciará los siguientes servicios:
- **App**: La aplicación principal en `http://localhost:3000`
- **Base de datos**: PostgreSQL en el puerto `5432`
- **pgAdmin**: Interfaz de administración de base de datos en `http://localhost:5050`