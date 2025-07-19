# Granja de Pescados - Inmeca

Sistema de gestión para granja de pescados (tilapia) con enfoque en ventas al mayoreo y detalle, diseñado para uso móvil.

## 🚀 Características

- **Dashboard** con resumen de ventas del día
- **Registro de ventas** al mayoreo (con múltiples pesajes) y detalle
- **Gestión de clientes** con búsqueda y edición
- **Control de stock** con historial y tendencias
- **Reportes diarios** con tabla de ventas
- **Configuración** de precios y parámetros del sistema
- **Interfaz móvil** optimizada con navegación bottom tabs
- **Tema verde** personalizado para la granja

## 🛠️ Tecnologías

- **Next.js 15** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes
- **Prisma** como ORM
- **PostgreSQL** como base de datos
- **Lucide React** para iconos

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL
- pnpm (recomendado) o npm

## 🔧 Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repositorio>
cd granja-inmeca
```

2. **Instala las dependencias**
```bash
pnpm install
```

3. **Configura las variables de entorno**
Crea un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/granja_inmeca"
```

4. **Configura la base de datos**
```bash
# Crea las tablas en la base de datos
pnpm run db:push

# Ejecuta el seed para datos iniciales
pnpm run db:seed
```

5. **Inicia el servidor de desarrollo**
```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Uso de la Aplicación

### Dashboard
- Vista general de ventas del día
- Resumen de mayoreo y detalle
- Stock disponible
- Acciones rápidas para registrar ventas

### Registrar Ventas
- **Venta Mayoreo**: Registra ventas por libras con múltiples pesajes de canastas
- **Venta Detalle**: Registra ventas por cantidad de pescados y peso total
- Confirmación antes de guardar
- Cálculo automático de totales

### Gestión de Clientes
- Lista de clientes con búsqueda
- Agregar nuevos clientes
- Editar información existente
- Clasificación automática (frecuente/ocasional)

### Stock
- Vista del stock actual
- Actualización de cantidades
- Historial de cambios
- Tendencias y promedios

### Reportes
- Ventas del día con detalles
- Totales por tipo de venta
- Pagos pendientes
- Tabla con todas las transacciones

### Configuración
- Precios por defecto para mayoreo y detalle
- Multiplicadores para pescado limpio
- Edición de parámetros del sistema

## 🗄️ Estructura de la Base de Datos

La aplicación utiliza un schema de Prisma con las siguientes entidades principales:

- **Venta**: Registro central de todas las ventas
- **DetalleMayoreo**: Pesajes individuales para ventas al mayoreo
- **DetalleVenta**: Información específica para ventas al detalle
- **Cliente**: Información de clientes
- **StockDetalle**: Control de inventario
- **RegistroDiario**: Agregados diarios para reportes
- **Configuracion**: Parámetros del sistema

## 📱 Diseño Móvil

- **Navegación bottom tabs** para fácil acceso
- **Componentes touch-friendly** con botones grandes
- **Responsive design** que funciona en tablets y móviles
- **Tema verde** personalizado para la granja

## 🔄 Scripts Disponibles

```bash
# Desarrollo
pnpm run dev

# Construcción
pnpm run build

# Producción
pnpm run start

# Base de datos
pnpm run db:push    # Sincronizar schema
pnpm run db:seed    # Poblar datos iniciales
pnpm run db:studio  # Abrir Prisma Studio
```

## 🎨 Personalización

### Colores
El tema verde se puede personalizar editando las variables CSS en `app/globals.css`:

```css
--primary: oklch(0.4 0.15 142);    /* Verde principal */
--secondary: oklch(0.95 0.05 142); /* Verde secundario */
--accent: oklch(0.9 0.08 142);     /* Verde de acento */
```

### Configuraciones
Los precios y parámetros se pueden modificar desde la página de Configuración o directamente en la base de datos.

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura la variable `DATABASE_URL` en el dashboard
3. Despliega automáticamente

### Otros Proveedores
- **Railway**: Soporte nativo para PostgreSQL
- **Render**: Fácil configuración con PostgreSQL
- **DigitalOcean**: App Platform con base de datos gestionada

## 📝 Notas de Desarrollo

- La aplicación está optimizada para **SSR/ISR** para mejor performance
- Los formularios usan **React Hook Form** para validación
- Las confirmaciones previenen errores de usuario
- El diseño es **mobile-first** con navegación intuitiva

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado para Granja de Pescados Inmeca** 🐟
