# RafguiWebAppReact - Portafolio Personal y Blog

Aplicación web para un portafolio personal y blog, construida con React y Vite. Incluye un panel de administración completo para gestionar contenido, proyectos, experiencia y posts del blog.

## ✨ Características Principales

*   **Panel de Administración Seguro:** Autenticación con Firebase para gestionar todo el contenido.
*   **Gestión de Portafolio:** CRUD completo para proyectos, incluyendo subida de imágenes a Cloudinary.
*   **Gestión de Experiencia:** Añade, edita y elimina experiencia laboral y educativa.
*   **Blog con Markdown:** Crea y edita posts de blog usando Markdown, con gestión de comentarios.
*   **Soporte Multi-idioma (i18n):** Contenido dinámico en Español e Inglés.
*   **Diseño Responsivo:** Interfaz moderna construida con Tailwind CSS.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** React, Vite
*   **Backend & Base de Datos:** Firebase (Realtime Database, Authentication)
*   **Alojamiento de Imágenes:** Cloudinary
*   **Estilos:** Tailwind CSS
*   **Routing:** React Router

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para tener una copia del proyecto funcionando en tu máquina local.

### 1. Prerrequisitos

Asegúrate de tener instalado Node.js (se recomienda versión 18.x o superior).

*   Node.js

### 2. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/RafguiWebAppReact.git
cd RafguiWebAppReact
```

### 3. Instalar Dependencias

Usa `npm` o `yarn` para instalar todas las dependencias del proyecto.

```bash
npm install
# o
yarn install
```

### 4. Configurar Variables de Entorno

Este proyecto necesita credenciales de Firebase y Cloudinary para funcionar.

1.  Crea un archivo `.env` en la raíz del proyecto. Puedes duplicar el archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```

2.  Abre el archivo `.env` y rellena las siguientes variables con tus propias credenciales:

    ```env
    # Credenciales de tu proyecto de Firebase
    VITE_FIREBASE_API_KEY="TU_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="TU_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="TU_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="TU_STORAGE_BUCKET"
    VITE_FIREBASE_MESSAGING_SENDER_ID="TU_SENDER_ID"
    VITE_FIREBASE_APP_ID="TU_APP_ID"

    # Credenciales de Cloudinary
    VITE_CLOUDINARY_CLOUD_NAME="TU_CLOUD_NAME"
    VITE_CLOUDINARY_UPLOAD_PRESET="TU_UPLOAD_PRESET_PERFIL"
    VITE_CLOUDINARY_PORTFOLIO_PRESET="TU_UPLOAD_PRESET_PORTFOLIO"
    ```

#### ¿Dónde obtener estas credenciales?

*   **Firebase:**
    1.  Ve a la Consola de Firebase.
    2.  Crea un nuevo proyecto o selecciona uno existente.
    3.  En la configuración de tu proyecto (`Project Settings`), ve a la sección "General".
    4.  Bajo "Your apps", crea una nueva aplicación web.
    5.  Firebase te proporcionará un objeto de configuración `firebaseConfig`. Copia los valores en tu archivo `.env`.
    6.  Asegúrate de habilitar **Authentication** (con proveedor Email/Password) y **Realtime Database**.

*   **Cloudinary:**
    1.  Ve a tu Dashboard de Cloudinary.
    2.  El `Cloud Name` se encuentra en la parte superior del dashboard.
    3.  Ve a `Settings` (icono de engranaje) > `Upload`.
    4.  Baja hasta "Upload presets" y crea dos presets **sin firmar (unsigned)**: uno para las fotos de perfil y otro para las imágenes del portafolio. Asigna sus nombres a `VITE_CLOUDINARY_UPLOAD_PRESET` y `VITE_CLOUDINARY_PORTFOLIO_PRESET` respectivamente.

### 5. Ejecutar la Aplicación

Una vez configurado, puedes iniciar el servidor de desarrollo.

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

### Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo.
*   `npm run build`: Compila la aplicación para producción.
*   `npm run preview`: Previsualiza la build de producción localmente.
