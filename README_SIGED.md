# SIGED - Sistema Integral de Gestión para Desastres

**SIGED** es una plataforma web diseñada para coordinar la respuesta ante emergencias y desastres naturales, permite la gestión centralizada de recursos logísticos, refugios temporales, personal de rescate y zonas de riesgo en tiempo real.

> **Estado del Proyecto:** Activa | Rama: `develop`

## Enlaces de Producción (Render)

| Servicio | URL | Estado |
| :--- | :--- | :--- |
| **Frontend (Angular)** | [https://proyecto-integrador-bim-4-2.onrender.com](https://proyecto-integrador-bim-4-2.onrender.com) | Live |
| **Backend API (Node.js)** | [https://proyecto-integrador-bim-4-3.onrender.com](https://proyecto-integrador-bim-4-3.onrender.com) | Live |
| **Base de Datos** | PostgreSQL 18 (Render Free Tier) | Active |

## Credenciales de Prueba

Utiliza estas cuentas para probar los diferentes roles y permisos del sistema:

| Rol | Email | Contraseña | Permisos Clave |
| :--- | :--- | :--- | :--- |
| **Administrador** | `carlos.mendez@siged.com` | `admin123` | Acceso total, gestión de usuarios y zonas |
| **Coordinador** | `maria.gonzalez@siged.com` | `coord123` | Gestión de asignaciones y alertas |
| **Rescatista** | `juan.perez@siged.com` | `rescatista123` | Visualización de incidentes y rutas |
| **Gestor Refugio** | `ana.rodriguez@siged.com` | `gestor123` | Control de ocupación y recursos en refugios |
| **Voluntario** | `luis.martinez@siged.com` | `voluntario123` | Reporte básico y visualización de alertas |

## ️ Stack Tecnológico

### Frontend
*   **Framework:** Angular 17+ (Standalone Components)
*   **Lenguaje:** TypeScript
*   **Estilos:** CSS3 / Bootstrap Icons
*   **Gráficos:** Componentes personalizados SVG/CSS
*   **HTTP Client:** RxJS + Angular HttpClient

### Backend
*   **Runtime:** Node.js 22
*   **Framework:** Express.js + TypeScript
*   **Base de Datos:** PostgreSQL 18
*   **Autenticación:** JWT (JSON Web Tokens) + bcryptjs
*   **ORM/Driver:** node-postgres (pg)

### Infraestructura & DevOps
*   **Hosting:** Render (Web Services + PostgreSQL)
*   **Contenedores:** Docker & Nginx (Alpine)
*   **Control de Versiones:** Git + GitHub
*   **Paquete Manager:** npm / pnpm

## Instalación Local (Desarrollo)

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:

### 1. Requisitos Previos
*   Node.js v20+
*   PostgreSQL local (opcional, puedes usar la DB de Render)
*   Git

### 2. Clonar y Configurar
git clone https://github.com/KevinLancerio-2022063/Proyecto_Integrador_BIM_4.git
cd Proyecto_Integrador_BIM_4

### 3. Levantar el Backend

cd Backend
npm install

npm run dev
# Servidor corriendo en http://localhost:3000


### 4. Levantar el Frontend
cd ../Frontend
npm install
ng serve --open
# App corriendo en http://localhost:4200

##  Estructura del Proyecto

```text
Proyecto_Integrador_BIM_4/
├── Backend/                # API RESTful en Node.js
│   ├── src/
│   │   ├── config/         # Configuración de DB y variables
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Interfaces y tipos TS
│   │   ├── repositories/   # Consultas SQL directas
│   │   ├── routes/         # Definición de endpoints
│   │   └── services/       # Reglas de validación y hashing
│   ├── Dockerfile          # Imagen para despliegue en Render
│   └── seed.ts             # Script de inicialización de datos
├── Frontend/               # Aplicación Angular Standalone
│   ├── src/app/
│   │   ├── features/       # Módulos por dominio (Logística, Incidentes)
│   │   ├── core/           # Servicios compartidos, Guards, Interceptors
│   │   └── environments/   # Configuración prod/dev
│   ├── Dockerfile          # Build multi-stage con Nginx
│   └── nginx.conf          # Configuración de servidor estático
└── README.md
```
