# Sistema de Gestión de Empleados - Coders

## 📝 Descripción del Proyecto

Este proyecto es un sistema web de gestión de empleados desarrollado con Next.js que permite la administración de usuarios y el seguimiento de transacciones (movimientos) financieras o de inventario. Está diseñado para proporcionar una interfaz de usuario intuitiva para la gestión de datos clave de la empresa.

## ✨ Características Principales

* **Autenticación y Autorización por Roles:**
    * Inicio de sesión seguro para usuarios.
    * Acceso basado en roles (Administrador y Usuario Estándar).
    * Redirección automática según el rol del usuario.
* **Gestión de Usuarios (Solo Administradores):**
    * Visualización de todos los usuarios del sistema.
    * Edición de roles de usuario (ADMIN/USER) a través de un modal.
* **Gestión de Transacciones/Movimientos:**
    * Visualización de un listado de transacciones.
    * Posibilidad de agregar nuevos movimientos (tipo "Entrada" o "Salida", cantidad).
    * Filtro de transacciones por tipo.
* **Visualización de Datos:**
    * Dashboard con gráficos (usando Chart.js) que muestran un resumen de los movimientos.
* **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.

## 🛠 Tecnologías Utilizadas

* **Framework:** Next.js (React Framework para producción)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Base de Datos/ORM:** Prisma (simulado con datos en memoria para la lógica del sistema)
* **Autenticación:** JSON Web Tokens (JWT) para la simulación de sesión.
* **Gráficos:** Chart.js y React-Chartjs-2
* **Gestión de Estado:** Context API de React (para autenticación)

## 🚀 Cómo Ejecutar el Proyecto Localmente

Sigue estos pasos para poner el proyecto en marcha en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* [Node.js](https://nodejs.org/) (versión LTS recomendada, ej. **20.x**)
* [npm](https://www.npmjs.com/) (viene con Node.js) o [Yarn](https://yarnpkg.com/)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/johanasev/CODERS-SistemaDeEmpleados.git](https://github.com/johanasev/CODERS-SistemaDeEmpleados.git)
    cd CODERS-SistemaDeEmpleados
    ```

2.  **Instala las dependencias del proyecto:**
    ```bash
    npm install
    # o si usas yarn:
    # yarn install
    ```

### Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o si usas yarn:
# yarn dev
```

## 🔑 Cuentas de Prueba

Para facilitar las pruebas de autenticación y roles, puedes usar las siguientes cuentas:

| Correo Electrónico      | Contraseña (ejemplo) | Rol      |
| :---------------------- | :------------------- | :------- |
| `admin@coders.com`      | `admin123`           | `ADMIN`  |
| `user@coders.com`       | `user123`            | `USER`   |

*(Nota: Las contraseñas son simuladas y solo deben tener 6 o más caracteres.)*


## 🌐 URL de la Aplicación Desplegada

Puedes acceder a la versión desplegada de este proyecto en Vercel a través del siguiente enlace:

[**Sistema de Gestión de Empleados**](https://coders-sistema-de-empleados.vercel.app/)


## 👥 Coders

Este proyecto fue desarrollado por:

* **Johana Sevillano**
* **Juan Esteban Aristizabal**


