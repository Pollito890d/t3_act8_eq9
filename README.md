# Hola Café - Sistema Comandero Web

Sistema web interactivo para la gestión y toma de órdenes de la cafetería **"Hola Café"**. Desarrollado con **React** y **Vite**, el sistema integra autenticación de usuarios mediante consumo de API, vistas protegidas con navegación modular (Navbar y Sidebar), y una tabla interactiva tipo comandero con capacidades CRUD, filtrado dinámico y paginación sincronizada por URL.

---

## Integrantes del Equipo (Equipo 9)

- **Luna Cenobio Sarai**
- **Martínez Villalobos Dante**
- **Ortíz Peréz Gael Fernando**

---

## Enlaces del Proyecto

- **Repositorio en GitHub:** [https://github.com/Pollito890d/t3_act8_eq9](https://github.com/Pollito890d/t3_act8_eq9)
- **Despliegue en VPS:** `http://143.198.182.173/t3_act8_eq9/`

---

## Tecnologías y APIs Utilizadas

- **Entorno & Librerías:** React 18+, Vite, JavaScript (ES6+), HTML5, CSS3.
- **API de Autenticación:** [DummyJSON Auth](https://dummyjson.com/docs/auth) (`POST https://dummyjson.com/auth/login`) para validación de credenciales y obtención de perfil (nombre, foto y token).
- **API de Datos (CRUD y Catálogo):** [DummyJSON](https://dummyjson.com/) para la obtención, búsqueda, creación, edición y eliminación de registros simulados.

---

## Funcionalidades Implementadas

### Fase 1: Autenticación (Login)

- Formulario basado en el mockup de Figma con validación previa de campos vacíos.
- Consumo asíncrono del endpoint `https://dummyjson.com/auth/login`.
- Mensajes visuales de error ante credenciales no válidas.
- Almacenamiento seguro del usuario autenticado en el estado global/local de React (`useState`).

### Fase 2: Panel Administrativo y Vistas Protegidas

- **Rutas protegidas:** Bloqueo de acceso a la vista principal si no existe una sesión activa.
- **Navbar superior:** Presentación dinámica de la foto de perfil del usuario, nombre completo y botón de cierre de sesión con limpieza de estado.
- **Sidebar lateral:** Menú de navegación modular para las distintas secciones de la cafetería.

### Fase 3: Tabla Comandero (CRUD, Filtros y Paginación)

- **Filtros interactivos:** Búsqueda en tiempo real por texto y filtrado por categoría de productos.
- **Paginación avanzada:** Controles de avance/retroceso y selector de registros por página (10, 20, 40, 50).
- **Sincronización en URL:** Persistencia de parámetros de navegación (`?page=X&limit=Y`) para soporte de historial del navegador.
- **Estados de red:** Retroalimentación al usuario mediante indicadores de carga (_loading spinner_) y manejo visual de excepciones/errores.
- **Operaciones CRUD:**
  - **Crear:** Registro de nuevos elementos enviando petición `POST` y reflejando el cambio en el estado.
  - **Editar:** Modificación mediante `PUT/PATCH` con modal de confirmación antes de aplicar cambios.
  - **Eliminar:** Petición `DELETE` al API acompañada de diálogo de confirmación y remoción del estado local.

### Fase 4: Despliegue en VPS

- Compilación optimizada para producción (`npm run build`).
- Configuración de la propiedad `base: '/t3_act8_eq9/'` en `vite.config.js`.
- Servicio de archivos estáticos configurado bajo servidor web Nginx.

---

## Estructura del Proyecto

```text
t3_act8_eq9/
├── public/                     # Archivos estáticos públicos
├── src/
│   ├── assets/                 # Recursos gráficos adicionales
│   ├── components/             # Componentes modulares de interfaz
│   │   ├── Login.css           # Estilos del módulo de autenticación
│   │   ├── Login.jsx           # Componente del formulario de login
│   │   ├── Sistema.css         # Estilos del dashboard (Navbar / Sidebar)
│   │   ├── Sistema.jsx         # Layout principal del sistema protegido
│   │   └── TablaComandero.jsx  # Tabla interactiva con CRUD, filtros y paginación
│   ├── img/
│   │   └── hola_cafe_logo.jpeg # Logotipo oficial de "Hola Café"
│   ├── services/
│   │   └── api.js              # Centralización de peticiones HTTP (Fetch/Axios)
│   ├── App.css                 # Estilos globales de la aplicación
│   ├── App.jsx                 # Componente raíz y control del estado de sesión
│   ├── index.css               # Reset y estilos base
│   └── main.jsx                # Punto de entrada de la aplicación React
├── .gitignore                  # Exclusión de node_modules, dist, etc.
├── eslint.config.js            # Configuración de linter
├── index.html                  # Plantilla HTML base
├── package.json                # Metadatos del proyecto y dependencias
├── vite.config.js              # Configuración del bundler Vite y subruta base
└── README.md                   # Documentación general del repositorio

## Capturas de Figma

**1. Pantalla de Acceso (Login)**
![Login](img/Login.png)


**2. Panel de Comandero/ordenes**
![Index](img/comandas.png)
```
