# 🏪 BizBag - App de Control de Inventario y Cuadre

App móvil para pequeños negocios que permite gestionar inventario y realizar cuadres de caja de forma simple y eficiente.

## ✅ Características Principales

- **🛍️ Gestión de Productos**: Crear, editar y eliminar productos con precio y categoría
- **📦 Control de Inventario**: Registrar inicio, merma y adiciones de stock
- **💰 Cuadre de Caja**: Calcular automáticamente ventas esperadas y totales
- **📊 Historial**: Consultar cuadres anteriores con desglose completo
- **📧 Buzón**: Recibir mensajes y notificaciones del administrador
- **⚙️ Panel de Administración**: Gestionar usuarios, planes y suscripciones (solo admin)
- **🔐 Autenticación**: Sistema de claves de acceso con validación en Supabase
- **🌙 Modo Oscuro**: Interfaz adaptable a preferencias del usuario

## 🏗️ Estructura del Proyecto

```
BizBag/
├── app/                          # Rutas y pantallas (Expo Router)
│   ├── _layout.tsx              # Layout raíz
│   ├── index.tsx                # Pantalla de login
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Layout con tab bar
│   │   ├── dashboard.tsx        # Dashboard principal
│   │   ├── products.tsx         # Gestión de productos
│   │   ├── inventory.tsx        # Control de inventario
│   │   ├── balance.tsx          # Cuadre de caja
│   │   └── history.tsx          # Historial de cuadres
│   ├── inbox.tsx                # Buzón de mensajes
│   ├── settings.tsx             # Configuración de usuario
│   └── admin.tsx                # Panel de administración
├── components/
│   └── ui/                      # Componentes reutilizables
│       ├── Button.tsx
│       ├── TextInput.tsx
│       ├── Card.tsx
│       ├── TopBar.tsx
│       ├── BottomNav.tsx
│       ├── SheetModal.tsx
│       └── SplashScreen.tsx
├── lib/
│   ├── database/
│   │   └── init.ts              # Inicialización SQLite
│   ├── supabase/
│   │   └── client.ts            # Cliente Supabase
│   ├── store/
│   │   └── useBizBagStore.ts    # Store global (Zustand)
│   └── utils/
│       ├── helpers.ts           # Funciones utilitarias
│       └── seed.ts              # Datos de prueba
├── types/
│   └── index.ts                 # Tipos TypeScript
├── styles/
│   └── globals.css              # Estilos globales
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── babel.config.js
└── .env.example                 # Variables de entorno
```

## 🚀 Tecnologías Utilizadas

- **React Native** (v0.73.6) - Framework para apps móviles
- **Expo** (v51.0.0) - Plataforma para desarrollar con React Native
- **Expo Router** (v3.5.0) - Sistema de routing
- **TypeScript** - Tipado estático
- **NativeWind** - Tailwind CSS para React Native
- **Zustand** - State management
- **SQLite** (expo-sqlite) - Base de datos local
- **Supabase** - Backend y autenticación
- **React Native Reanimated** - Animaciones
- **React Native Gesture Handler** - Gestos

## 📦 Dependencias Principales

```json
{
  "react": "18.2.0",
  "react-native": "0.73.6",
  "expo": "~51.0.0",
  "expo-router": "~3.5.0",
  "expo-sqlite": "~14.0.0",
  "@supabase/supabase-js": "^2.38.4",
  "zustand": "^4.4.0",
  "nativewind": "^2.0.11",
  "tailwindcss": "3.3.0"
}
```

## 🔧 Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/kevinelpesetaveo-droid/BizBag.git
cd BizBag
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y completa:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 4. Ejecutar la app

**En desarrollo:**
```bash
npm start
```

**En iOS:**
```bash
npm run ios
```

**En Android:**
```bash
npm run android
```

## 📂 Base de Datos

### SQLite (Local)

Tablas creadas automáticamente:

- **products**: Productos del negocio
- **inventory**: Movimientos de inventario
- **balances**: Cuadres guardados
- **balance_lines**: Desglose de líneas por cuadre

### Supabase (Remoto)

Tablas necesarias:

- **profiles**: Usuarios con claves de acceso
- **messages**: Mensajes para usuarios
- **admin_settings**: Configuración de admin

## 🔐 Autenticación

1. Admin crea usuario en panel
2. Se genera clave de acceso única (BIZBAG-XXXX)
3. Usuario ingresa clave en login
4. Se valida contra Supabase
5. Se verifica estado de suscripción

## 📱 Características de UX/UI

- ✨ Interfaz limpia y moderna
- 🎨 Colores corporativos (#2A9D8F primario)
- 📐 Diseño responsivo
- 🌙 Soporte para modo oscuro
- ⚡ Animaciones suaves
- ♿ Accesible a nivel WCAG AA

## 🎯 Funcionalidades por Pantalla

### Dashboard
- Resumen de valor en existencias
- Último cuadre realizado
- Último mensaje recibido
- Accesos rápidos a otras secciones

### Productos
- Listar productos con búsqueda
- Filtrar por categoría
- Crear, editar y eliminar productos
- Validación de datos

### Inventario
- Entrada de movimientos (Inicio, Agregó, Merma)
- Cálculo automático de disponible
- Guardado masivo de inventario

### Cuadre
- Ingreso de stock físico final
- Cálculo automático de ventas esperadas
- Visualización de totales por producto
- Guardado con nombre personalizado

### Historial
- Listar cuadres por fecha
- Ver desglose completo de cada cuadre
- Exportación de datos (futura)

### Buzón
- Recibir mensajes del admin
- Marcar como leído
- Ver historial de mensajes

### Configuración
- Ver estado de suscripción
- Cambiar nombre de negocio
- Activar/desactivar modo oscuro
- Cerrar sesión

### Panel Admin
- Autenticación con contraseña
- Listar usuarios activos
- Crear nuevos usuarios
- Gestionar planes y suscripciones
- Enviar mensajes a usuarios

## 🧮 Cálculos Principales

### Disponible
```
Disponible = Inicio + Agregó - Merma
```

### Vendidas
```
Vendidas = Disponible - Stock Final
```

### Total Esperado
```
Total = Vendidas × Precio Unitario
```

## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run ios        # Ejecutar en iOS
npm run android    # Ejecutar en Android
npm run web        # Ejecutar en web
npm test           # Ejecutar tests
npm run lint       # Verificar código
```

### Estructura de commits

Seguimos convención de commits:
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `refactor:` Cambio de código sin funcionalidad
- `docs:` Documentación
- `style:` Estilos (sin cambios lógicos)
- `test:` Tests

## 📊 Estado del Proyecto

### ✅ Completado
- [x] Setup inicial del proyecto
- [x] Estructura de carpetas
- [x] Configuración de TypeScript
- [x] Integración de NativeWind/Tailwind
- [x] Componentes UI base
- [x] Store con Zustand
- [x] Base de datos SQLite
- [x] Cliente Supabase
- [x] Pantalla de login
- [x] Dashboard
- [x] Gestión de productos
- [x] Control de inventario
- [x] Cuadre de caja
- [x] Historial
- [x] Buzón
- [x] Configuración
- [x] Panel de admin

### 🔄 En Progreso
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Documentación de API
- [ ] Guía de desarrollo

### 📝 Por Hacer
- [ ] Exportar datos a PDF/Excel
- [ ] Sincronización en tiempo real
- [ ] Reportes avanzados
- [ ] Gráficas de ventas
- [ ] Backup automático
- [ ] Notificaciones push
- [ ] Modo offline mejorado
- [ ] Soporte multi-idioma

## 🐛 Reportar Bugs

Por favor crea un issue describiendo:
- Qué intentabas hacer
- Qué pasó
- Pasos para reproducir
- Pantalla/dispositivo usado

## 📄 Licencia

MIT License - Ver LICENSE.md

## 👤 Autor

**Kevin Peset Aveo**
- GitHub: [@kevinelpesetaveo-droid](https://github.com/kevinelpesetaveo-droid)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores, abre un issue primero para discutir los cambios propuestos.

---

**Hecho con ❤️ para pequeños negocios**
