# Prueba Elementos

## Descripción

Aplicación React + TypeScript + Vite para construir formularios dinámicos y personalizables, permitiendo agregar filas y columnas, elegir tipos de campos, personalizar colores, bordes y más.

## Estructura del Proyecto

```mermaid
graph TD
  A[src/] --> B[App.tsx]
  A --> C[App.css]
  A --> D[index.css]
  A --> E[main.tsx]
  A --> F[vite-env.d.ts]
  A --> G[assets/]
  G --> H[react.svg]
  A --> I[components/]
  I --> J[Crear_Columna.tsx]
  I --> K[Crear_Fila.tsx]
  I --> L[Menu.tsx]
  A --> M[hooks/]
  M --> N[useMenu.ts]
  A --> O[utils/]
  O --> P[Elementos.tsx]
  O --> Q[Inputs.tsx]
  O --> R[ResizableCol.tsx]
  O --> S[Validaciones.tsx]
```

## Instalación

```sh
npm install
```

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo.
- `npm run build` — Compila el proyecto para producción.
- `npm run preview` — Previsualiza el build de producción.
- `npm run lint` — Ejecuta ESLint.

## Características

- Constructor visual de formularios con filas y columnas.
- Personalización de color de texto, fondo y bordes.
- Soporte para varios tipos de campos: texto, input, select, checkbox, radio, imagen.
- Redimensionamiento de columnas.
- Guardar y cargar configuraciones en JSON.
- Drag & drop para reordenar filas.

## Componentes principales

- **Menu**: Panel principal, lógica de filas/columnas y personalización.
- **Crear_Fila**: Renderiza una fila con columnas.
- **Crear_Columna**: Renderiza el tipo de campo de cada columna.
- **Elementos**: Componentes para cada tipo de campo.
- **ResizableCol**: Permite redimensionar columnas.
- **Inputs**: Inputs personalizados y validaciones.
- **Validaciones**: Funciones de validación.
- **useMenu**: Hook principal para la lógica de estado.

## Personalización

- Cambia colores y bordes desde el panel de personalización.
- Agrega nuevos tipos de campo editando `Elementos.tsx`.

## Licencia

MIT
