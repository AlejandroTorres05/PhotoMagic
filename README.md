# 📷 PhotoMagic

Una aplicación móvil de cámara con filtros en tiempo real desarrollada con React Native y Expo.

## Características

- 📸 **Captura de fotos** con cámara frontal y trasera
- 🎨 **Filtros en tiempo real**: Cálido, Frío y Vintage
- 🖼️ **Galería integrada** para visualizar las fotos capturadas
- 🔄 **Cambio de cámara** (frontal/trasera)
- 📱 **Interfaz moderna** con gradientes y animaciones
- 🗑️ **Gestión de fotos** (eliminar individual o todas)

## Tecnologías

- **React Native** con Expo
- **Expo Camera** para funcionalidad de cámara
- **Expo Linear Gradient** para efectos visuales
- **ESLint + Prettier** para calidad de código

## Guia de desarrollo

A en el archivo [react_native_camera_guide](./docs/react_native_camera_guide.md) dentro de la carpeta `docs` encontrarás una guía de desarrollo para poder construir y entender esta Demo desde cero.

## Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil o emulador

### Pasos de instalación

1. **Clonar el repositorio**

   ````bash
   git clone https://github.com/AlejandroTorres05/PhotoMagic
   cd photomagic
   ```as

   ````

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar la aplicación**

   ```bash
   npx expo start
   ```

4. **Abrir en dispositivo**
   - Escanea el código QR con la app Expo Go
   - O ejecuta en emulador con `i` (iOS) o `a` (Android)

## 📱 Dependencias principales

```json
{
  "expo": "~51.0.0",
  "expo-camera": "~15.0.0",
  "expo-linear-gradient": "~13.0.0",
  "expo-status-bar": "~1.12.0",
  "react": "18.2.0",
  "react-native": "0.74.0"
}
```

## Configuración de desarrollo

### ESLint

El proyecto usa ESLint con configuración de Expo y Prettier:

```javascript
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  // Prettier integration
  {
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    extends: [require("eslint-config-prettier")],
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
```

### Scripts disponibles

```bash
# Iniciar desarrollo
npm start

# Linting
npm run lint

# Formatear código
npm run format

# Build para producción
npm run build
```

## Filtros disponibles

| Filtro         | Descripción   | Efecto                |
| -------------- | ------------- | --------------------- |
| 📸 **Normal**  | Sin filtro    | Imagen original       |
| 🌅 **Cálido**  | Tonos cálidos | Overlay naranja suave |
| ❄️ **Frío**    | Tonos fríos   | Overlay azul suave    |
| 📷 **Vintage** | Efecto retro  | Overlay sepia         |

## Permisos requeridos

La aplicación requiere los siguientes permisos:

- **Cámara**: Para tomar fotos
- **Almacenamiento**: Para guardar fotos (automático con Expo)

## Estructura del proyecto

```
photomagic/
├── App.js                 # Componente principal
├── package.json           # Dependencias y scripts
├── eslint.config.js       # Configuración ESLint
├── .prettierrc           # Configuración Prettier
├── app.json              # Configuración Expo
└── assets/               # Recursos estáticos
```

## Características técnicas

### Componentes principales

- **CameraView**: Interfaz de cámara con Expo Camera
- **FilterSystem**: Sistema de filtros con overlays de color
- **Gallery**: Galería horizontal con scroll
- **Animations**: Animaciones con Animated API

### Optimizaciones

- ✅ Calidad de imagen optimizada (0.8)
- ✅ Animaciones nativas con `useNativeDriver`
- ✅ ScrollView horizontal para galería
- ✅ Gestión eficiente de estado con hooks

## Solución de problemas

### Problemas comunes

**Error de permisos de cámara:**

```bash
# Reinicia Expo y acepta permisos
npx expo start --clear
```

**Problemas de ESLint:**

```bash
# Instalar dependencias de ESLint
npm install --save-dev eslint-config-expo eslint-plugin-prettier eslint-config-prettier
```

**Cámara no funciona en emulador:**

- Usa un dispositivo físico para mejor experiencia
- Algunos emuladores no soportan cámara completamente
