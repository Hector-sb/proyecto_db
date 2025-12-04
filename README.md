# Proyecto de Gestión de Gastos

Este proyecto es una aplicación web para gestionar gastos, ingresos y pagos recurrentes. Consta de un backend en Node.js, una base de datos PostgreSQL y un frontend en HTML/JS vanilla.

## Requisitos Previos

*   Docker
*   Docker Compose (v2 recomendado)

## Guía Rápida para Ejecutar (Quick Start)

Si acabas de descargar este proyecto, solo necesitas ejecutar estos 2 pasos:

1.  **Iniciar el servidor**:
    ```bash
    sudo docker compose up -d --build
    ```
    *(Usa `sudo` si estás en Linux. En Windows/Mac no es necesario)*

2.  **Abrir la aplicación**:
    
    Puedes abrir `frontend/login.html` directamente, o usar un servidor local (recomendado):
    ```bash
    cd frontend
    python3 -m http.server 8000
    ```
    Luego ve a `http://localhost:8000/login.html`.

---

## Inicialización Detallada

Para iniciar la aplicación (backend y base de datos), sigue estos pasos:

1.  Abre una terminal en la carpeta raíz del proyecto.
2.  Ejecuta el siguiente comando para construir y levantar los contenedores:

    ```bash
    sudo docker compose up -d --build
    ```

    *Nota: Si tienes una versión antigua de Docker, es posible que necesites usar `docker-compose` (con guion), pero se recomienda la versión moderna sin guion.*

3.  Espera a que los contenedores se inicien.
    *   **Backend**: Estará escuchando en `http://localhost:4000`.
    *   **Base de Datos**: Estará accesible externamente en el puerto `5433` (para evitar conflictos con PostgreSQL local). Usuario: `admin`, Contraseña: `admin123`.

## Acceso al Frontend

El frontend consiste en archivos estáticos ubicados en la carpeta `frontend/`.

Para usar la aplicación:

*   **Opción 1 (Directa):** Abre el archivo `frontend/login.html` directamente en tu navegador (doble clic o arrastrar al navegador).
*   **Opción 2 (Servidor Local - Recomendado):** Si tienes Python instalado, puedes levantar un servidor simple en la carpeta `frontend`:
    ```bash
    cd frontend
    python3 -m http.server 8000
    ```
    Luego ve a `http://localhost:8000/login.html`.
*   **Opción 3 (VS Code):** Usa la extensión "Live Server" en el archivo `login.html`.

## Solución de Problemas Comunes

*   **Permisos**: Si tienes errores de "Permission denied", asegúrate de usar `sudo` antes de los comandos de docker.
*   **Puertos ocupados**: La configuración actual usa el puerto `5433` para la base de datos para evitar conflictos con el puerto por defecto `5432`. Si tienes problemas, verifica que el puerto `4000` (backend) y `5433` (db) estén libres.
*   **Conflictos de nombres**: Si obtienes un error de que el nombre del contenedor ya está en uso, puedes limpiar contenedores antiguos con:
    ```bash
    sudo docker rm -f <id_contenedor>
    ```
    O limpiar todo (cuidado, borra datos):
    ```bash
    sudo docker compose down --volumes --remove-orphans
    ```

## Ejecución con NPM (Alternativa)

Si prefieres usar `npm` en lugar de comandos de Docker directos:

1.  **Instalar dependencias** (solo la primera vez):
    ```bash
    npm install
    npm run setup
    ```

2.  **Iniciar Base de Datos**:
    ```bash
    npm run db:up
    ```
    *(Te pedirá contraseña de sudo si es necesario)*

3.  **Iniciar Aplicación**:
    ```bash
    npm start
    ```
    Esto abrirá tanto el backend como el frontend.
