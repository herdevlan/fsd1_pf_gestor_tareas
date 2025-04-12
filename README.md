# 📋 GESTOR DE TAREAS

## 1. Funcionalidades Principales

### 1.1. Autenticación de Usuarios

- Registro de usuario con nombre, email y contraseña.
- Inicio de sesión con email y contraseña.
- Protección de rutas privadas mediante JWT.
- Contraseñas hasheadas con **bcrypt.js**.

### 1.2. Gestión de Tareas (CRUD)

- Crear una tarea con:
  - **Título** (obligatorio).
  - **Descripción** (opcional).
  - **Estado**: pendiente, en progreso, completada.
    - Una tarea nueva inicia como “pendiente”.
  - **Fecha límite** (opcional).

- Editar tarea:
  - Modificar título, descripción, estado, fecha límite.
  - **Restricciones**:
    - Solo se puede pasar de “pendiente” a “en progreso” o “completada”.
    - De “en progreso” se puede pasar a “completada”.
  
- Eliminar tarea.
- Ver lista de tareas filtrada por:
  - **Estado** (pendiente, en progreso, completada).
  - **Fecha límite**.
  - **Búsqueda** por palabras clave.

### 1.3. Perfil de Usuario

- El usuario puede editar su:
  - **Nombre**.
  - **Email**.
  - **Contraseña**.

## 2. Frontend

El proyecto frontend está estructurado de la siguiente manera:

### 2.1. Componentes

- **TaskCard.jsx**: Componente individual de tarea (card).
- **TaskGrid.jsx**: Muestra todas las tareas en formato de bloques.
- **TaskModal.jsx**: Componente para crear y editar tareas (modal).
- **TaskFilters.jsx**: Barra de filtros por estado, fecha y búsqueda.

### 2.2. Páginas

- **Dashboard.jsx**: Página principal del dashboard, donde se gestionan las tareas.
- **Login.jsx**: Página para el inicio de sesión.
- **Register.jsx**: Página para el registro de nuevos usuarios.

### 2.3. Servicios

- **axios.js**: Instancia de Axios para realizar peticiones al backend.

## 3. Backend y Base de Datos

El backend está desarrollado en **Node.js** con **PostgreSQL** y **Sequelize**. Incluye los siguientes endpoints principales:

### 3.1. Endpoints para Autenticación

- **POST /api/auth/register**: Registra un nuevo usuario.
- **POST /api/auth/login**: Inicia sesión y devuelve un token JWT.

### 3.2. Endpoints para Tareas

- **GET /api/tareas**: Obtiene todas las tareas del usuario autenticado.
- **POST /api/tareas**: Crea una nueva tarea.
- **PUT /api/tareas/:id**: Edita una tarea existente.
- **DELETE /api/tareas/:id**: Elimina una tarea.
- **GET /api/tareas/filters**: Obtiene tareas filtradas por estado, fecha o búsqueda.

### 3.3. Endpoints para Perfil de Usuario

- **GET /api/user/profile**: Obtiene el perfil del usuario autenticado.
- **PUT /api/user/profile**: Actualiza el perfil del usuario.

### 3.4. Seguridad

- Uso de **JWT** para la autenticación.
- **bcrypt.js** para encriptar las contraseñas.

## 4. Detalles de Implementación

### 4.1. Frontend

- **React** y **Bootstrap** para el desarrollo del frontend.
- Uso de **Axios** para interactuar con el backend.
- **React Router** para la navegación entre páginas.
- Estado global manejado por **useState** y **useEffect**.
- Funcionalidad de filtro, búsqueda y edición de tareas implementada con modales y formularios dinámicos.

### 4.2. Backend

- **Node.js** con **Express** para la API RESTful.
- **PostgreSQL** como base de datos.
- **Sequelize** para la gestión de la base de datos y los modelos.

## 5. Pruebas

### 5.1. Test con Postman

1. **Autenticación**:
   - Test de registro con una solicitud **POST** a `/api/auth/register` enviando un objeto con `nombre`, `email`, y `contraseña`.
   - Test de login con una solicitud **POST** a `/api/auth/login` enviando `email` y `contraseña`.

2. **Tareas**:
   - Test de creación de tarea con una solicitud **POST** a `/api/tareas` enviando el cuerpo de la tarea con título, descripción y fecha límite.
   - Test de edición de tarea con una solicitud **PUT** a `/api/tareas/:id` enviando los cambios en la tarea.
   - Test de eliminación de tarea con una solicitud **DELETE** a `/api/tareas/:id`.

3. **Perfil**:
   - Test de obtención del perfil con una solicitud **GET** a `/api/user/profile`.
   - Test de edición del perfil con una solicitud **PUT** a `/api/user/profile`.

## 6. Despliegue

- **Backend en Render**: El backend se despliega en Render conectando el repositorio de GitHub. .

- **Frontend en Vercel**: El frontend se despliega en Vercel conectando también el repositorio de GitHub.

Ambos servicios manejan todo el proceso de despliegue de manera automática, lo que simplifica la gestión del entorno de producción.


