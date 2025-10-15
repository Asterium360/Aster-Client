# **🌠 Asterium — Blog sobre Astronomía**

*“Explorando el universo, una publicación a la vez.”*

**Asterium** es una plataforma **full-stack** dedicada a la astronomía, el cosmos y la ciencia del universo. El proyecto combina artículos, imágenes, noticias y contenido generado por los usuarios para crear una comunidad interactiva de amantes del espacio.

El objetivo principal es **hacer que la astronomía sea accesible, inspiradora y visualmente atractiva**.


## **🌌 Descripción del Proyecto**
![](./src/assets/img_README/home%20page.png)

Asterium es un blog donde los usuarios pueden:

* Leer artículos sobre planetas, galaxias y descubrimientos.  
* Crear y publicar sus propias entradas.  
* Gestionar su perfil y actividad.

El diseño está inspirado en el cielo nocturno: tonos oscuros, detalles estelares, transiciones suaves y una tipografía moderna.

## **🧭 User Journey**

1. **Página principal** — flujo de artículos y secciones temáticas.  
2. **Registro / Inicio de sesión** — autenticación mediante formulario.  
3. **Perfil del usuario** — gestión del perfil y de las publicaciones.  
   **Crear artículo** — editor con soporte Markdown.  
4. **Ver artículo** — página limpia con contenido y sección de comentarios.

## **🎨 Prototipo en Figma**

El diseño sigue un estilo minimalista con enfoque en la lectura y la experiencia visual.

**¡Atención!** El prototipo en Figma puede diferir del diseño que tenemos como resultado.

Vistas: about us, post page, feedback page, register page, login page, create a new post page, profile page, search result page.

![](./src/assets/img_README/home%20page.png)
![](./src/assets/img_README/register.png)
![](./src/assets/img_README/login.png)
![](./src/assets/img_README/aboutus.png)
![](./src/assets/img_README/profile%20page.png)
![](./src/assets/img_README/create%20a%20new%20post%20page.png)
![](./src/assets/img_README/one%20post%20page.png)
![](./src/assets/img_README/feedback%20page.png)
![](./src/assets/img_README/search%20page.png)

## **⚙️ Tecnologías**

### **🖥️ Frontend**

* ⚛️ **React \+ Vite**  
* 🎨 **TailwindCSS**  
* 🧭 **React Router**  
* 🔤 **Renderizado Markdown**  
* 🔧 **Axios** para solicitudes API

### **⚙️ Backend**

* 🧩 **Node.js \+ Express \+ TypeScript**  
* 🔐 **JWT** para autenticación  
* 🧰 **Joi** para validación  
* 🧪 **Jest** para pruebas

## **📁 Estructura del Proyecto**

`/client`  
  `├── src/`  
  `│   ├── assets/           # imágenes e íconos`  
  `│   ├── components/       # componentes UI (Navbar, Card, Button)`  
  `│   ├── pages/            # vistas (Home, Article, Profile)`  
  `│   ├── router/           # enrutamiento`  
  `│   ├── services/         # conexión con API`  
  `│   ├── store/            # estado global`  
  `│   ├── validators/       # validaciones de formularios`  
  `│   └── main.tsx`

`/server`  
  `├── src/`  
  `│   ├── config/           # configuración del entorno`  
  `│   ├── controllers/      # lógica de los endpoints`  
  `│   ├── models/           # modelos de Mongoose (User, Post, Comment)`  
  `│   ├── routes/           # rutas de Express`  
  `│   ├── middlewares/      # autenticación y validación`  
  `│   ├── tests/            # pruebas Jest`  
  `│   ├── db.ts             # conexión a MongoDB`  
  `│   └── app.ts            # inicialización del servidor`

---

## **⚡ Instalación y Ejecución**

`# 1. Clonar el repositorio`  
`git clone https://github.com/yourusername/asterium.git`  
`cd asterium`

`# 2. Instalar dependencias`  
`cd client && npm install`  
`cd ../server && npm install`

`# 3. Configurar variables de entorno`  
`cp .env.example .env`  
`# Definir MONGO_URI, JWT_SECRET, PORT, CLIENT_URL`

`# 4. Ejecutar el proyecto`  
`npm run dev  # ejecuta frontend y backend en modo desarrollo`

🛰️ Frontend → [http://localhost:5173](http://localhost:5173)  
 🌌 Backend → [http://localhost:5000](http://localhost:5000)

## **🧪 Pruebas**

`cd server`  
`npm run test`

Se prueban:

* Operaciones CRUD (posts, comentarios, usuarios)  
* Autenticación  
* Endpoints de la API

## **👥 Equipo del Proyecto**

| Nombre | Rol | GitHub | LinkedIn |
| ----- | ----- | :---: | ----- |
| **Michelle**  | Project Lead, Frontend Developer | [link](https://github.com/MichelleGel) | [link](https://www.linkedin.com/in/michelle-gelves/) |
| **Larysa** | Scrum Master, UI designer, Frontend Developer   | [link](https://github.com/ambalari) | [link](https://www.linkedin.com/in/larysa-ambartsumian/) |
| **Anngie** | Fullstack Developer | [link](https://github.com/angiepereir) | [link](https://www.linkedin.com/in/anngy-pereira-094aa026a/) |
| **Maryori** | Backend Developer | [link](https://github.com/MaryoriCruz) | [link](https://www.linkedin.com/in/maryori-cruz-6b440116b/)  |
| **Sofia**  | Backend Developer | [link](https://github.com/Sofiareyes12) | [link](https://www.linkedin.com/in/sofiareyes12/) |


## **💬 Contacto**

* 💻 Página web:  
* ✉️ Correo electrónico: equipoasterium@gmail.com

