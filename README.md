# Prueba Elementos

## Descripción

Aplicación React + TypeScript + Vite para construir formularios dinámicos con filas y columnas personalizables.

## Estructura del Proyecto

```
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Crear_Columna.tsx
│   │   ├── Crear_Fila.tsx
│   │   └── Menu.tsx
│   └── utils/
│       ├── Elementos.tsx
│       ├── Inputs.tsx
│       ├── ResizableCol.tsx
│       └── Validaciones.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── .gitignore
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

## Uso

1. Ejecuta `npm run dev`.
2. Accede a la aplicación en tu navegador.
3. Usa el panel para agregar filas y columnas, configurar tipos de campo y visualizar el resultado.
4. Puedes guardar y cargar la configuración en formato JSON.

## Tecnologías

- React 19
- TypeScript
- Vite
- TailwindCSS
- Font Awesome

## Estructura de Componentes

- [`Menu`](src/components/Menu.tsx): Panel principal y lógica de filas/columnas.
- [`Crear_Fila`](src/components/Crear_Fila.tsx): Renderiza una fila con columnas.
- [`Crear_Columna`](src/components/Crear_Columna.tsx): Renderiza el tipo de campo de cada columna.
- [`Elementos`](src/utils/Elementos.tsx): Componentes para cada tipo de campo (texto, input, select, checkbox, radio, imagen).
- [`ResizableCol`](src/utils/ResizableCol.tsx): Permite redimensionar columnas.
- [`Inputs`](src/utils/Inputs.tsx): Inputs personalizados y validaciones.
- [`Validaciones`](src/utils/Validaciones.tsx): Funciones de validación.

## Personalización

- Modifica [`App.css`](src/App.css) y [`index.css`](src/index.css) para cambiar estilos.
- Puedes agregar nuevos tipos de campo en [`Elementos.tsx`](src/utils/Elementos.tsx).

graph TD
A[public/] --> B[vite.svg]
C[src/] --> D[App.tsx]
C --> E[App.css]
C --> F[index.css]
C --> G[main.tsx]
C --> H[vite-env.d.ts]
C --> I[assets/]
I --> J[react.svg]
C --> K[components/]
K --> L[Crear_Columna.tsx]
K --> M[Crear_Fila.tsx]
K --> N[Menu.tsx]
C --> O[utils/]
O --> P[Elementos.tsx]
O --> Q[Inputs.tsx]
O --> R[ResizableCol.tsx]
O --> S[Validaciones.tsx]
T[index.html]
U[package.json]
V[tsconfig.json]
W[tsconfig.app.json]
X[tsconfig.node.json]
Y[vite.config.ts]
Z[eslint.config.js]
AA[.gitignore]

## Licencia

MIT
