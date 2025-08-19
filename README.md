
# LDS Facade Planner

LDS Facade Planner es una aplicación web interactiva desarrollada con **React**, **Vite** y **TypeScript**, diseñada para planificar y visualizar fachadas arquitectónicas.  
La herramienta permite cargar imágenes, manipular elementos en 3D, compartir configuraciones y exportar resultados en distintos formatos.

## Tecnologías principales

- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) — Framework y bundler moderno.
- [TypeScript](https://www.typescriptlang.org/) — Tipado estático para mayor robustez.
- [Tailwind CSS](https://tailwindcss.com/) — Framework de estilos utilitarios.
- [Three.js](https://threejs.org/) con [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) y [Drei](https://github.com/pmndrs/drei) — Renderizado y manipulación de escenas 3D.
- [Radix UI](https://www.radix-ui.com/) — Componentes accesibles y modulares.
- [Lucide React](https://lucide.dev/) — Conjunto de íconos.
- [Recharts](https://recharts.org/) — Visualización de datos.
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Formularios y validación de esquemas.
- [React Router](https://reactrouter.com/) — Manejo de rutas en la aplicación.
- [Vaul](https://vaul.emilkowal.ski/) — Animaciones y transiciones.
- [Sonner](https://sonner.emilkowal.ski/) — Notificaciones.
- [Embla Carousel](https://www.embla-carousel.com/) — Carruseles interactivos.
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF) — Exportación de imágenes y documentos PDF.

## Estructura del proyecto
```
LDS-Facade-Planner-main/
│── public/               
│── src/
│   ├── assets/            # Recursos gráficos
│   ├── components/        # Componentes principales
│   ├── data/              # Archivos JSON con datos
│   ├── hooks/             
│   ├── lib/               
│   ├── pages/             # Páginas principales 
│   ├── App.tsx            # Punto central de la aplicación
│   └── main.tsx           # Renderizado de React
│── index.html             # Entrada principal
│── package.json           
│── tailwind.config.ts     
│── vite.config.ts         
│── tsconfig.json          
│── LICENSE                # Licencia MIT
```


## Instalación y ejecución

1. Clonar este repositorio:
```bash
   git clone https://github.com/vr700/LDS-Facade-Planner.git
   cd LDS-Facade-Planner
```

2. Instalar dependencias:
```bash
   npm install
```

3. Ejecutar en modo desarrollo:
```bash
   npm run dev
```

4. Abrir en el navegador:

## Scripts disponibles
* `npm run dev` — Inicia el servidor de desarrollo.
* `npm run build` — Genera la build optimizada para producción.
* `npm run preview` — Previsualiza la build de producción.
* `npm run lint` — Ejecuta el linter (ESLint).
