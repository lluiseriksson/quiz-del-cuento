# 📖 Quiz del Cuento — Edición Premium con IA

¡Bienvenido al repositorio de **Quiz del Cuento**! Esta es una aplicación educativa interactiva moderna y de alto rendimiento diseñada para aulas de clase. Los alumnos pueden competir representando a sus escuelas respondiendo preguntas basadas en cuentos, con marcadores en tiempo real y explicaciones automáticas potenciadas por **Google Gemini AI** para cada respuesta incorrecta.

Esta versión ha sido rediseñada y refactorizada a fondo para ofrecer una experiencia visual excepcional, interactividad fluida y una arquitectura técnica robusta y tipada con TypeScript.

---

## ✨ Características Premium y Mejoras

1. **Tipado Estricto con TypeScript (TSX/TS):** Todo el código ha sido migrado de JavaScript plano a TypeScript limpio y tipado, lo que previene errores en tiempo de desarrollo y facilita enormemente la ampliación del proyecto.
2. **Estética Visual de Última Generación (Glassmorphism):**
   - Interfaz enriquecida con fondos radiales oscuros y un patrón de rejilla retroiluminada.
   - Tarjetas de cristal esmerilado (`backdrop-blur`) con bordes luminosos reactivos y sombras 2D premium.
   - Tipografía estilizada de alta legibilidad optimizada para pantallas escolares.
3. **Modo Demo Interactivo (¡Novedad!):** ¿No tienes archivos a mano para probar? La pantalla de bienvenida ahora incluye un botón **"Probar con Demo Interactiva"** que carga al instante un cuento clásico de *Caperucita Roja* y tres preguntas predefinidas para jugar de inmediato con un solo clic.
4. **Marcador de Competencia Dinámica:**
   - Animación de trofeos y estrellas flotantes según la posición en el podio.
   - Efecto "Text Glow" y resaltado dinámico para la escuela del jugador.
   - Simulación mejorada de puntuación basada en la velocidad de respuesta (hasta 1000 puntos por pregunta).
5. **Retroalimentación Educativa con IA:** Integración nativa con la API de Google Gemini (`gemini-2.5-flash`) para ofrecer breves explicaciones personalizadas y explicadas en un lenguaje sencillo para niños cuando fallan una pregunta.

---

## 🛠️ Tecnologías Utilizadas

- **Core:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS v3](https://tailwindcss.com/) (con gradientes avanzados, efectos HSL y animaciones personalizadas)
- **Empaquetado y Entorno de Desarrollo:** [Vite v6](https://vite.dev/)
- **Inteligencia Artificial:** SDK oficial de [@google/genai](https://www.npmjs.com/package/@google/genai)

---

## 🚀 Instalación y Desarrollo Local

Sigue estos sencillos pasos para descargar, ejecutar y seguir desarrollando este proyecto en cualquier ordenador:

### 1. Clonar el repositorio e instalar dependencias
```bash
# Entrar al directorio
cd quiz-del-cuento

# Instalar los paquetes necesarios
npm install
```

### 2. Configurar la API Key de Gemini
La aplicación requiere una clave de API de Google AI Studio para generar explicaciones con Inteligencia Artificial.
1. Crea un archivo llamado `.env` en la raíz del proyecto.
2. Añade tu clave de la siguiente manera:
```env
VITE_GEMINI_API_KEY=tu_clave_de_api_aqui
```
*(Nota: El archivo `.gitignore` ya está configurado para que nunca subas tu clave privada a GitHub).*

### 3. Iniciar el Servidor de Desarrollo
Para abrir la aplicación localmente en tu navegador:
```bash
npm run dev
```
Haz clic en el enlace local provisto (normalmente `http://localhost:5173`) ¡y listo!

### 4. Compilar para Producción
Para empaquetar y optimizar la aplicación para su despliegue web:
```bash
npm run build
```
Esto generará los archivos estáticos listos para producción en la carpeta `dist/`.

---

## 📂 Estructura de los Archivos de Texto (.txt)

Para jugar con tus propios cuentos, puedes cargar dos archivos sencillos en formato `.txt`:

### 1. Texto del Cuento (e.g., `cuento.txt`)
Contiene simplemente el texto del cuento o la lectura que los alumnos deben leer.

### 2. Archivo de Preguntas (e.g., `preguntas.txt`)
Las preguntas se escriben en bloques separados por una línea en blanco. La primera línea es la pregunta, y las siguientes son las opciones (el asterisco `*` al inicio indica cuál es la respuesta correcta):

```text
1. ¿Quién escribió el cuento de Caperucita Roja?
*a) Charles Perrault y los Hermanos Grimm
b) Miguel de Cervantes
c) J.K. Rowling
d) Hans Christian Andersen

2. ¿Qué llevaba Caperucita en su cesta?
a) Libros de matemáticas
b) Herramientas de leñador
*c) Pasteles y frutas para su abuela
d) Piedras del río
```

---

## 💻 Desarrollo Remoto y Colaboración

Al tener este proyecto en tu GitHub, puedes clonarlo en cualquier otro PC simplemente ejecutando:
```bash
git clone <url-de-tu-repositorio>
cd quiz-del-cuento
npm install
npm run dev
```

¡Disfruta del juego y que gane la mejor escuela! 🏆📚✨
