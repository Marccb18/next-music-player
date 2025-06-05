# Documentación del Reproductor de Música Next.js

## Descripción General
Este proyecto es un reproductor de música moderno construido con Next.js 14, utilizando las últimas tecnologías y mejores prácticas de desarrollo web. La aplicación ofrece una experiencia de usuario fluida y atractiva para la reproducción de música, con un enfoque especial en la accesibilidad, rendimiento y experiencia de usuario.

## Tecnologías Principales

### Frontend
- **Next.js 14**
  - Framework de React para desarrollo web
  - Renderizado del lado del servidor (SSR) para mejor SEO y rendimiento inicial
  - Generación estática (SSG) para páginas que no requieren datos dinámicos
  - Enrutamiento basado en el sistema de archivos con App Router
  - Optimización automática de imágenes y fuentes
  - Soporte para API Routes y Server Actions
  - Streaming y Suspense para mejor UX
  - Middleware para manejo de rutas y autenticación
  - Soporte para internacionalización
  - Hot Module Replacement (HMR) para desarrollo rápido

- **React 18**
  - Biblioteca para construcción de interfaces de usuario
  - Componentes reutilizables y composables
  - Virtual DOM para rendimiento optimizado
  - Hooks para gestión de estado y efectos secundarios
  - Concurrent Features para mejor experiencia de usuario
  - Suspense para manejo de estados de carga
  - Transiciones para animaciones suaves
  - Server Components para mejor rendimiento
  - Strict Mode para detección temprana de problemas
  - Soporte para streaming de datos

- **TypeScript**
  - Superset tipado de JavaScript
  - Sistema de tipos estático para detección temprana de errores
  - Mejor autocompletado y documentación en el IDE
  - Interfaces y tipos para mejor mantenibilidad
  - Soporte para programación orientada a objetos
  - Generics para código reutilizable
  - Decoradores para metaprogramación
  - Tipos utilitarios para manipulación de tipos
  - Inferencia de tipos para mejor productividad
  - Integración con herramientas de desarrollo

- **Tailwind CSS**
  - Framework de utilidades CSS
  - Diseño responsivo sin escribir CSS personalizado
  - Sistema de diseño consistente y escalable
  - Optimización automática de producción
  - Personalización mediante configuración
  - Modo oscuro integrado
  - Animaciones y transiciones
  - Grid y Flexbox utilities
  - Custom plugins y extensiones
  - PurgeCSS integrado para optimización

- **Shadcn/ui**
  - Biblioteca de componentes construida sobre Radix UI
  - Componentes accesibles y personalizables
  - Sistema de temas y estilos consistente
  - Integración perfecta con Tailwind CSS
  - Componentes sin estilos predefinidos
  - Soporte para teclado y lectores de pantalla
  - Componentes primitivos para máxima flexibilidad
  - Sistema de tokens de diseño
  - Animaciones y transiciones suaves
  - Soporte para modo oscuro

- **Zustand**
  - Gestión de estado ligera y eficiente
  - API simple y minimalista
  - Soporte nativo para TypeScript
  - Middleware para extensibilidad
  - Mejor rendimiento que Redux
  - Persistencia de estado
  - DevTools para debugging
  - Suscripciones selectivas
  - Acciones asíncronas
  - Integración con React Query

- **Howler.js**
  - Biblioteca para manejo de audio
  - Soporte para múltiples formatos de audio (MP3, WAV, OGG, etc.)
  - Control preciso de la reproducción
  - Manejo de eventos de audio
  - Compatibilidad cross-browser
  - Spatial audio
  - Fade in/out
  - Control de volumen
  - Manejo de colas de reproducción
  - Soporte para streaming

### Backend
- **MongoDB**
  - Base de datos NoSQL
  - Escalabilidad horizontal
  - Flexibilidad en el esquema
  - Consultas potentes y agregaciones
  - Soporte para transacciones
  - Índices para mejor rendimiento
  - Replicación para alta disponibilidad
  - Sharding para distribución de datos
  - Soporte para geolocalización
  - Integración con herramientas de monitoreo

- **Mongoose**
  - ODM para MongoDB
  - Esquemas y validación
  - Middleware para hooks
  - Tipado con TypeScript
  - Consultas optimizadas
  - Virtuals y métodos
  - Plugins y middleware
  - Índices y validación
  - Populate para relaciones
  - Transacciones

- **AWS S3**
  - Almacenamiento de archivos en la nube
  - Alta disponibilidad y durabilidad
  - Escalabilidad automática
  - Seguridad robusta
  - CDN integrado con CloudFront
  - Control de acceso granular
  - Encriptación en reposo y tránsito
  - Versionamiento de objetos
  - Lifecycle policies
  - Eventos y notificaciones

- **bcryptjs**
  - Encriptación de contraseñas
  - Algoritmo de hashing seguro
  - Salt automático
  - Protección contra ataques de fuerza bruta
  - Implementación probada y confiable
  - Configuración de costos
  - Compatibilidad cross-platform
  - Sin dependencias externas
  - Fácil integración
  - Mantenimiento activo

## Justificación de Elecciones Tecnológicas

### Next.js 14
Se eligió Next.js por su enfoque moderno en el desarrollo web, ofreciendo:
- **Rendimiento**: 
  - Optimización automática de imágenes y código
  - Compilación y bundling optimizados
  - Carga progresiva de componentes
  - Prefetching inteligente
  - Caching automático

- **SEO**: 
  - Mejor indexación gracias al SSR
  - Metadatos dinámicos
  - Sitemap generado automáticamente
  - Open Graph tags
  - Estructura de datos para motores de búsqueda

- **Desarrollo**: 
  - Hot reloading
  - Fast Refresh
  - Error boundaries
  - TypeScript integrado
  - Excelente experiencia de desarrollo

- **Escalabilidad**: 
  - Arquitectura que permite crecer con la aplicación
  - Middleware para lógica compartida
  - API Routes para backend
  - Server Components
  - Edge Runtime

- **Ecosistema**: 
  - Gran comunidad
  - Soporte de Vercel
  - Documentación extensa
  - Herramientas de desarrollo
  - Integración con servicios populares

### React 18
La elección de React se basa en:
- **Madurez**: 
  - Framework probado y estable
  - Patrones de diseño establecidos
  - Mejores prácticas documentadas
  - Comunidad experimentada
  - Larga trayectoria

- **Comunidad**: 
  - Gran ecosistema de librerías
  - Herramientas de desarrollo
  - Recursos de aprendizaje
  - Soporte activo
  - Contribuciones constantes

- **Rendimiento**: 
  - Virtual DOM optimizado
  - Concurrent Features
  - Suspense para carga
  - Transiciones suaves
  - Server Components

- **Flexibilidad**: 
  - Componentes reutilizables
  - Composición de componentes
  - Hooks personalizados
  - Context API
  - Render props

- **Futuro**: 
  - Actualizaciones constantes
  - Mejoras de rendimiento
  - Nuevas características
  - Soporte a largo plazo
  - Roadmap claro

### TypeScript
TypeScript fue seleccionado por:
- **Seguridad**: 
  - Detección temprana de errores
  - Tipado estático
  - Validación en tiempo de compilación
  - Mejor manejo de null/undefined
  - Interfaces estrictas

- **Mantenibilidad**: 
  - Código más fácil de mantener
  - Refactorización segura
  - Documentación implícita
  - Mejor organización
  - Patrones de diseño claros

- **Documentación**: 
  - Tipos como documentación viva
  - Autocompletado inteligente
  - Tooltips informativos
  - Navegación de código
  - Referencias cruzadas

- **Productividad**: 
  - Mejor autocompletado
  - Refactorización automática
  - Detección de errores
  - Navegación de código
  - Integración con IDE

- **Escalabilidad**: 
  - Mejor manejo de proyectos grandes
  - Módulos y namespaces
  - Generics para reutilización
  - Decoradores
  - Mejor organización

### Tailwind CSS
La elección de Tailwind se fundamenta en:
- **Productividad**: 
  - Desarrollo más rápido
  - Menos decisiones de diseño
  - Consistencia visual
  - Menos CSS personalizado
  - Mejor mantenibilidad

- **Consistencia**: 
  - Sistema de diseño unificado
  - Espaciado consistente
  - Paleta de colores
  - Tipografía
  - Breakpoints

- **Rendimiento**: 
  - CSS optimizado en producción
  - PurgeCSS integrado
  - Sin CSS no utilizado
  - Mejor caching
  - Menor tamaño de bundle

- **Flexibilidad**: 
  - Fácil personalización
  - Temas personalizados
  - Plugins
  - Modo oscuro
  - Variables CSS

- **Mantenibilidad**: 
  - Sin necesidad de nombrar clases
  - Menos archivos CSS
  - Mejor organización
  - Fácil de entender
  - Menos conflictos

### Shadcn/ui
Se seleccionó Shadcn/ui por:
- **Accesibilidad**: 
  - Componentes WCAG compliant
  - Soporte para teclado
  - ARIA attributes
  - Focus management
  - Screen reader support

- **Flexibilidad**: 
  - Sin estilos predefinidos
  - Totalmente personalizable
  - Integración con Tailwind
  - Temas personalizados
  - Componentes primitivos

- **Rendimiento**: 
  - Componentes ligeros
  - Sin CSS runtime
  - Optimización automática
  - Mejor TTI
  - Menor bundle size

- **Mantenibilidad**: 
  - API consistente
  - Documentación clara
  - Código fuente accesible
  - Fácil de extender
  - Mejor organización

- **Personalización**: 
  - Total control sobre el diseño
  - Sistema de tokens
  - Temas dinámicos
  - Modo oscuro
  - Animaciones personalizadas

### Zustand
Zustand fue elegido por:
- **Simplicidad**: 
  - API minimalista
  - Fácil de aprender
  - Menos boilerplate
  - Mejor legibilidad
  - Menos configuración

- **Rendimiento**: 
  - Mejor que Redux
  - Re-renders optimizados
  - Mejor memoria
  - Mejor TTI
  - Mejor TBT

- **Tamaño**: 
  - Bundle size reducido
  - Sin dependencias
  - Mejor caching
  - Mejor loading
  - Mejor performance

- **TypeScript**: 
  - Soporte nativo
  - Inferencia de tipos
  - Mejor autocompletado
  - Mejor mantenibilidad
  - Mejor documentación

- **Flexibilidad**: 
  - Fácil integración con React
  - Middleware
  - DevTools
  - Persistencia
  - Acciones asíncronas

### MongoDB y Mongoose
La elección de MongoDB y Mongoose se basa en:
- **Flexibilidad**: 
  - Esquema dinámico
  - Documentos JSON
  - Sin migraciones
  - Fácil evolución
  - Mejor adaptabilidad

- **Escalabilidad**: 
  - Horizontal scaling
  - Sharding
  - Replicación
  - Mejor distribución
  - Mejor rendimiento

- **Rendimiento**: 
  - Consultas eficientes
  - Índices
  - Agregaciones
  - Mejor throughput
  - Mejor latencia

- **Ecosistema**: 
  - Gran comunidad
  - Herramientas
  - Drivers
  - Cloud services
  - Soporte

- **Integración**: 
  - Fácil integración con Node.js
  - Mongoose ODM
  - TypeScript
  - Mejor desarrollo
  - Mejor mantenimiento

### AWS S3
S3 fue seleccionado por:
- **Confiabilidad**: 
  - 99.999999999% de durabilidad
  - Alta disponibilidad
  - Replicación automática
  - Backup automático
  - Recuperación de desastres

- **Escalabilidad**: 
  - Sin límites de almacenamiento
  - Auto-scaling
  - Mejor distribución
  - Mejor rendimiento
  - Mejor costo

- **Seguridad**: 
  - Encriptación en reposo
  - Encriptación en tránsito
  - IAM policies
  - ACLs
  - VPC endpoints

- **Rendimiento**: 
  - Baja latencia
  - Alta throughput
  - CDN integrado
  - Mejor caching
  - Mejor distribución

- **Costo**: 
  - Modelo de pago por uso
  - Sin costos fijos
  - Mejor optimización
  - Mejor control
  - Mejor ROI

## Estructura del Proyecto

```
├── app/                    # Directorio principal de la aplicación Next.js
│   ├── (authorized)/      # Rutas protegidas que requieren autenticación
│   ├── (unauthorized)/    # Rutas públicas
│   ├── api/               # Rutas de API
│   ├── layout.tsx         # Layout principal de la aplicación
│   ├── globals.css        # Estilos globales
│   └── favicon.ico        # Favicon de la aplicación
│
├── components/            # Componentes reutilizables
│   ├── alert-dialog/     # Componentes de diálogo de alerta
│   ├── dialogs/          # Componentes de diálogo
│   ├── drawers/          # Componentes de cajones laterales
│   ├── forms/            # Componentes de formularios
│   ├── player/           # Componentes del reproductor
│   ├── primitives/       # Componentes primitivos de UI
│   ├── sidebar/          # Componentes de la barra lateral
│   ├── upload-song-process/ # Componentes para el proceso de subida
│   └── views/            # Componentes de vista
│
├── hooks/                # Custom hooks de React
│
├── lib/                  # Utilidades y configuraciones
│   ├── client-only/      # Código que solo se ejecuta en el cliente
│   ├── server-only/      # Código que solo se ejecuta en el servidor
│   ├── mongo/            # Configuración y modelos de MongoDB
│   ├── types/            # Tipos y definiciones
│   ├── validations/      # Esquemas de validación
│   └── utils.ts          # Utilidades generales
│
├── .next/              # Directorio de compilación de Next.js
├── node_modules/       # Dependencias del proyecto
│
├── .gitignore         # Archivos ignorados por Git
├── .prettierrc        # Configuración de Prettier
├── bun.lock           # Archivo de bloqueo de Bun
├── components.json    # Configuración de componentes
├── eslint.config.mjs  # Configuración de ESLint
├── middleware.ts      # Middleware de Next.js
├── next.config.js     # Configuración de Next.js
├── next-env.d.ts      # Tipos de Next.js
├── package.json       # Dependencias y scripts
├── postcss.config.js  # Configuración de PostCSS
├── postcss.config.mjs # Configuración de PostCSS (alternativa)
├── tailwind.config.ts # Configuración de Tailwind CSS
└── tsconfig.json      # Configuración de TypeScript
```

### Explicación de la Estructura Actual

#### 1. Directorio `app/`
La estructura actual sigue el App Router de Next.js 14 con:
- **Grupos de rutas**: 
  - `(authorized)`: Rutas protegidas que requieren autenticación
  - `(unauthorized)`: Rutas públicas accesibles sin autenticación
- **API Routes**: Endpoints de la aplicación
- **Layout global**: Configuración de la aplicación
- **Estilos globales**: Configuración de CSS global

#### 2. Directorio `components/`
Organización actual por tipo de componente:
- **alert-dialog/**: Diálogos de alerta para confirmaciones
- **dialogs/**: Diálogos modales para interacciones
- **drawers/**: Paneles laterales deslizables
- **forms/**: Formularios reutilizables
- **player/**: Componentes del reproductor de música
- **primitives/**: Componentes base de UI
- **sidebar/**: Componentes de navegación lateral
- **upload-song-process/**: Proceso de subida de canciones
- **views/**: Componentes de vista principales

#### 3. Directorio `lib/`
Nueva estructura organizada por contexto de ejecución:
- **client-only/**: Código que solo se ejecuta en el navegador
- **server-only/**: Código que solo se ejecuta en el servidor
- **mongo/**: Configuración y modelos de MongoDB
- **types/**: Definiciones de tipos TypeScript
- **validations/**: Esquemas de validación
- **utils.ts**: Utilidades generales

### Beneficios de la Estructura Actual

1. **Separación Clara de Responsabilidades**
   - Código cliente/servidor separado
   - Componentes organizados por funcionalidad
   - Rutas agrupadas por acceso

2. **Mejor Mantenibilidad**
   - Estructura intuitiva
   - Fácil localización de archivos
   - Organización lógica

3. **Optimización de Rendimiento**
   - Código cliente/servidor optimizado
   - Mejor code splitting
   - Carga eficiente de componentes

4. **Seguridad Mejorada**
   - Separación clara de rutas autorizadas
   - Validaciones centralizadas
   - Código servidor aislado

5. **Escalabilidad**
   - Fácil adición de nuevas características
   - Estructura modular
   - Convenciones claras

### Mejores Prácticas Implementadas

1. **Organización de Componentes**
   - Separación por funcionalidad
   - Componentes reutilizables
   - Mejor mantenibilidad

2. **Gestión de Estado**
   - Hooks personalizados
   - Lógica de negocio separada
   - Estado local y global

3. **Validación y Tipos**
   - Esquemas de validación centralizados
   - Tipos TypeScript bien definidos
   - Mejor seguridad de tipos

4. **Rendimiento**
   - Código cliente/servidor optimizado
   - Carga eficiente de recursos
   - Mejor experiencia de usuario

## Características Principales

1. **Reproducción de Música**
   - Control de reproducción (play, pause, siguiente, anterior)
   - Barra de progreso interactiva
   - Control de volumen
   - Lista de reproducción

2. **Gestión de Usuarios**
   - Autenticación segura
   - Perfiles de usuario
   - Preferencias personalizadas

3. **Almacenamiento**
   - Integración con AWS S3 para archivos de música
   - Gestión eficiente de recursos

4. **Interfaz de Usuario**
   - Diseño responsivo
   - Componentes accesibles
   - Animaciones fluidas
   - Tema oscuro/claro

## Configuración del Entorno

### Requisitos Previos
- Node.js (versión recomendada: 18.x o superior)
- MongoDB
- Cuenta de AWS (para S3)

### Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
```

2. Instalar dependencias:
```bash
npm install
# o
pnpm install
```

3. Configurar variables de entorno:
Crear un archivo `.env.local` con las siguientes variables:
```
MONGODB_URI=tu_uri_de_mongodb
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=tu_region
AWS_BUCKET_NAME=tu_bucket_name
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
pnpm dev
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código con Prettier

## Mejores Prácticas

1. **Código**
   - Seguir las convenciones de TypeScript
   - Utilizar componentes funcionales
   - Implementar manejo de errores apropiado
   - Mantener la accesibilidad en mente

2. **Rendimiento**
   - Optimizar imágenes y recursos
   - Implementar lazy loading cuando sea posible
   - Utilizar caching apropiadamente

3. **Seguridad**
   - Validar todas las entradas de usuario
   - Implementar autenticación segura
   - Proteger rutas sensibles
   - Manejar tokens de forma segura

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto
Para preguntas o sugerencias, por favor abrir un issue en el repositorio.

## Modelos de Base de Datos

### Estructura de Modelos

El proyecto utiliza MongoDB como base de datos, con los siguientes modelos principales:

#### 1. Users (Usuarios)
```typescript
{
  name: String,          // Nombre del usuario
  email: String,         // Email único
  password: String,      // Contraseña encriptada
  avatar: String,        // URL del avatar
  role: String,          // Rol: 'admin' o 'user'
  _createdAt: Date,      // Fecha de creación
  _updatedAt: Date       // Fecha de actualización
}
```

#### 2. Tracks (Canciones)
```typescript
{
  name: String,          // Nombre de la canción
  spotifyId: String,     // ID único de Spotify
  artists: [ObjectId],   // Referencia a Artists
  album: ObjectId,       // Referencia a Releases
  image: String,         // URL de la imagen
  url: String,           // URL de Spotify
  duration: Number,      // Duración en segundos
  trackNumber: Number,   // Número de pista
  discNumber: Number,    // Número de disco
  isExplicit: Boolean,   // Contenido explícito
  audioUrl: String,      // URL del archivo de audio
  fileName: String,      // Nombre del archivo
  genres: [ObjectId],    // Referencia a Genres
  popularity: Number,    // Popularidad (0-100)
  _createdAt: Date,      // Fecha de creación
  _updatedAt: Date       // Fecha de actualización
}
```

#### 3. Artists (Artistas)
```typescript
{
  name: String,          // Nombre del artista
  spotifyId: String,     // ID único de Spotify
  image: String,         // URL de la imagen
  genres: [ObjectId],    // Referencia a Genres
  popularity: Number,    // Popularidad (0-100)
  _createdAt: Date,      // Fecha de creación
  _updatedAt: Date       // Fecha de actualización
}
```

#### 4. Releases (Álbumes)
```typescript
{
  name: String,          // Nombre del álbum
  spotifyId: String,     // ID único de Spotify
  artists: [ObjectId],   // Referencia a Artists
  image: String,         // URL de la imagen
  releaseDate: Date,     // Fecha de lanzamiento
  type: String,          // Tipo: 'album', 'single', 'ep'
  genres: [ObjectId],    // Referencia a Genres
  _createdAt: Date,      // Fecha de creación
  _updatedAt: Date       // Fecha de actualización
}
```

#### 5. Playlists (Listas de Reproducción)
```typescript
{
  name: String,          // Nombre de la playlist
  description: String,   // Descripción
  owner: ObjectId,       // Referencia a Users
  tracks: [ObjectId],    // Referencia a Tracks
  image: String,         // URL de la imagen
  isPublic: Boolean,     // Visibilidad pública
  _createdAt: Date,      // Fecha de creación
  _updatedAt: Date       // Fecha de actualización
}
```

#### 6. Genres (Géneros)
```typescript
{
  name: String,          // Nombre del género
  spotifyId: String,     // ID único de Spotify
  _createdAt: Date,      // Fecha de creación
  _updatedAt: Date       // Fecha de actualización
}
```

#### 7. Groups (Grupos)
```typescript
{
  name: String,          // Nombre del grupo
  artists: [ObjectId],   // Referencia a Artists
  _createdAt: Date,      // Fecha de creación
  _updatedAt: Date       // Fecha de actualización
}
```

### Relaciones entre Modelos

1. **Tracks (Canciones)**
   - Pertenece a uno o más **Artists**
   - Pertenece a un **Release** (álbum)
   - Puede tener múltiples **Genres**
   - Puede estar en múltiples **Playlists**

2. **Artists (Artistas)**
   - Puede tener múltiples **Tracks**
   - Puede pertenecer a múltiples **Releases**
   - Puede tener múltiples **Genres**
   - Puede pertenecer a múltiples **Groups**

3. **Releases (Álbumes)**
   - Pertenece a uno o más **Artists**
   - Contiene múltiples **Tracks**
   - Puede tener múltiples **Genres**

4. **Playlists (Listas de Reproducción)**
   - Pertenece a un **User** (propietario)
   - Contiene múltiples **Tracks**

5. **Users (Usuarios)**
   - Puede tener múltiples **Playlists**
   - Puede seguir a múltiples **Artists**

6. **Groups (Grupos)**
   - Contiene múltiples **Artists**

### Índices y Optimizaciones

1. **Tracks**
   - Índice de texto en `name`
   - Índice en `popularity`
   - Índices en características de audio
   - Índice único en `spotifyId`

2. **Artists**
   - Índice de texto en `name`
   - Índice en `popularity`
   - Índice único en `spotifyId`

3. **Releases**
   - Índice de texto en `name`
   - Índice único en `spotifyId`

4. **Playlists**
   - Índice en `owner`
   - Índice en `isPublic`

### Plugins y Middleware

1. **toJSON**
   - Plugin personalizado para transformar documentos
   - Manejo de virtuals
   - Formateo de fechas
   - Eliminación de campos sensibles

2. **Timestamps**
   - Actualización automática de `_createdAt` y `_updatedAt`
   - Seguimiento de cambios en documentos

### Mejores Prácticas Implementadas

1. **Referencias**
   - Uso de `ObjectId` para relaciones
   - Populate automático cuando es necesario
   - Índices en campos de referencia

2. **Validación**
   - Esquemas estrictos
   - Campos requeridos
   - Enums para valores específicos
   - Validación de rangos numéricos

3. **Rendimiento**
   - Índices optimizados
   - Campos indexados estratégicamente
   - Consultas eficientes

4. **Seguridad**
   - Campos sensibles protegidos
   - Validación de datos
   - Control de acceso a nivel de modelo
``` 