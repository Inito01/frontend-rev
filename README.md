# Frontend para análisis de Revisiones Técnicas

Este es el frontend para la aplicación de análisis de documentos de revisiones técnicas.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/products/docker-desktop/) (Opcional, si se levanta con Docker)

## Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd frontend-rev
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

## Cómo levantar el servicio

### Usando npm (desarrollo)

Puedes iniciar el servidor de desarrollo con el siguiente comando:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

### Usando Docker (Recomendado)

El frontend está configurado para ser levantado junto con el backend usando un único archivo `docker-compose.yml` que se encuentra en el directorio `backend-rev`.

Por favor, consulta el `README.md` en la carpeta `backend-rev` para ver las instrucciones completas sobre cómo levantar toda la aplicación.

Una vez levantado, el frontend estará disponible en `http://localhost:3000`.
