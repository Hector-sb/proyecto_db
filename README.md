# Proyecto de Gestión de Gastos

Este proyecto es una aplicación web para gestionar gastos, ingresos y pagos recurrentes. Consta de un backend en Node.js, una base de datos PostgreSQL y un frontend en HTML/JS vanilla.

## Requisitos Previos

*   Docker
*   Docker Compose (v2 recomendado)

## Inicialización del Proyecto

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

*   **Opción 1 (Recomendado - npm):** Usa el servidor de desarrollo con npm:
    ```bash
    cd frontend
    npm run dev
    ```
    Esto abrirá automáticamente `http://localhost:8000` en tu navegador.
*   **Opción 2 (Directa):** Abre el archivo `frontend/login.html` directamente en tu navegador (doble clic o arrastrar al navegador).
*   **Opción 3 (Python):** Si tienes Python instalado, puedes levantar un servidor simple:
    ```bash
    cd frontend
    python3 -m http.server 8000
    ```
    Luego ve a `http://localhost:8000/login.html`.
*   **Opción 4 (VS Code):** Usa la extensión "Live Server" en el archivo `login.html`.

## Gestión de Contenedores Docker

### Detener los contenedores (sin eliminarlos)
Cuando termines de trabajar, puedes detener los contenedores manteniendo su estado:
```bash
docker compose stop
```

### Iniciar contenedores existentes
Para volver a trabajar, simplemente inicia los contenedores que ya fueron creados:
```bash
docker compose start
```

### Detener y eliminar contenedores (mantener datos)
Si quieres limpiar los contenedores pero mantener los datos de la base de datos:
```bash
docker compose down
```
Para volver a iniciar después de un `down`:
```bash
docker compose up -d
```
*Nota: No necesitas `--build` a menos que hayas modificado el código del backend.*

### Ver estado de los contenedores
Para verificar qué contenedores están corriendo:
```bash
docker compose ps
```

### Reiniciar contenedores
Si necesitas reiniciar los servicios:
```bash
docker compose restart
```


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
