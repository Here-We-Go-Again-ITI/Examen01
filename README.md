# Examen01 - Aplicación de Destinos Turísticos

<div align="center">
  <img src="./src/assets/icon/icon.jpg" alt="Examen01 Logo" width="120" height="120" style="border-radius: 20px; margin-bottom: 20px;"/>
  <p><em>Descubre, explora y guarda tus destinos favoritos alrededor del mundo</em></p>
</div>

## 📱 Descripción del Proyecto

Examen01 es una aplicación móvil desarrollada con React Native que permite a los usuarios explorar destinos turísticos populares alrededor del mundo. La aplicación ofrece una interfaz intuitiva y atractiva con animaciones fluidas, permitiendo a los usuarios navegar entre diferentes categorías de destinos, ver detalles específicos de cada lugar y guardar sus destinos favoritos para acceder a ellos rápidamente.

## ✨ Características Principales

- **Navegación Intuitiva**: Sistema de navegación por drawer y stack para una experiencia de usuario fluida.
- **Categorías de Destinos**: Explora destinos organizados por categorías como ciudades, playas, montañas, etc.
- **Tarjetas Animadas**: Visualización atractiva de destinos con tarjetas que utilizan gradientes de colores personalizados.
- **Sistema de Favoritos**: Guarda tus destinos preferidos para acceder a ellos fácilmente.
- **Detalles Enriquecidos**: Información detallada sobre cada destino, incluyendo descripciones, atracciones principales y consejos.
- **Diseño Responsive**: Adaptación perfecta a diferentes tamaños de pantalla y orientaciones.
- **Animaciones Fluidas**: Transiciones y efectos visuales que mejoran la experiencia de usuario.

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework principal para el desarrollo de la aplicación.
- **Expo**: Plataforma para facilitar el desarrollo y pruebas.
- **React Navigation 7**: Sistema de navegación entre pantallas.
- **AsyncStorage**: Almacenamiento local para guardar favoritos y preferencias.
- **React Native Reanimated**: Biblioteca para crear animaciones fluidas y de alto rendimiento.
- **Expo Linear Gradient**: Componente para crear gradientes de color atractivos.
- **React Native Paper**: Biblioteca de componentes UI siguiendo Material Design.
- **Axios**: Cliente HTTP para realizar peticiones a APIs.

## 📋 Requisitos Previos

- Node.js (v16.0.0 o superior)
- npm (v8.0.0 o superior)
- Expo CLI
- Un emulador de Android/iOS o un dispositivo físico para pruebas

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone [URL del repositorio]
   cd Examen01
   ```

2. **Instalar dependencias**
   ```bash
   npm install @react-navigation/native
   npm install @react-navigation/native-stack
   npm install react-native-screens
   npm install react-native-safe-area-context
   npx expo install react-native-gesture-handler
   npx expo install react-native-reanimated
   npm install @react-navigation/stack
   npm install react-native-paper
   npx expo install @react-navigation/drawer 
   npx expo install @expo/vector-icons
   npx expo install expo-linear-gradient
   ```

3. **Iniciar la aplicación**
   ```bash
   npm start
   ```

4. **Escanear el código QR** con la aplicación Expo Go en tu dispositivo o ejecutar en un emulador.

## 📱 Estructura del Proyecto

```
Examen01/
├── assets/                # Recursos estáticos (imágenes, fuentes)
├── src/
│   ├── assets/            # Recursos específicos de la aplicación
│   ├── styles/            # Estilos globales y temas
│   └── views/             # Componentes de vista (pantallas)
│       ├── about.js       # Pantalla de información
│       ├── categories.js  # Pantalla de categorías
│       ├── home.js        # Pantalla principal
│       ├── misFavs.js     # Pantalla de favoritos
│       └── specificPlace.js # Detalles de un destino
├── App.js                 # Punto de entrada de la aplicación
├── app.json               # Configuración de Expo
├── index.js               # Registro de la aplicación
├── package.json           # Dependencias y scripts
└── README.md              # Documentación del proyecto
```

## 📲 Funcionamiento General

1. **Pantalla de Inicio**: Muestra una lista de destinos populares con tarjetas animadas y gradientes de colores personalizados.

2. **Navegación por Drawer**: Accede a diferentes secciones de la aplicación como Categorías, Favoritos e Información.

3. **Exploración por Categorías**: Navega entre diferentes tipos de destinos como ciudades, playas, montañas, etc.

4. **Detalles del Destino**: Al seleccionar un destino, se muestra información detallada, imágenes y opciones para agregar a favoritos.

5. **Gestión de Favoritos**: Guarda tus destinos preferidos y accede a ellos rápidamente desde la sección de Favoritos.

## 🧠 Asistencia de IA en el Desarrollo

Este proyecto fue desarrollado con la asistencia de herramientas de inteligencia artificial. A continuación, se presentan las referencias en formato APA:

### Referencias en Formato APA

- OpenAI. (2024). ChatGPT [Software de inteligencia artificial]. Recuperado el 2 de marzo de 2025, de https://chat.openai.com

- Codeium. (2024). Cascade [Software de inteligencia artificial]. Recuperado el 2 de marzo de 2025, de https://codeium.com

### Justificación de la Selección

Se seleccionó **Codeium (Cascade)** como la principal herramienta de asistencia por su especialización en código, integración con el entorno de desarrollo, comprensión de la estructura del proyecto, sugerencias específicas para React Native y eficiencia en la resolución de problemas.

Para más detalles sobre las consultas realizadas a estas IAs, consulte el archivo [Referencias_IA.md](./Referencias_IA.md).

## 📝 Notas de Desarrollo

- La aplicación utiliza un sistema de navegación mixto (drawer + stack) para proporcionar una experiencia de usuario óptima.
- Se implementó un sistema de animaciones para mejorar la interactividad y el atractivo visual.
- Los datos de los destinos están actualmente hardcodeados, pero la estructura está preparada para integrarse con una API externa.

## 🔮 Mejoras Futuras

- Implementación de un backend para gestionar datos de destinos dinámicamente.
- Sistema de autenticación de usuarios.
- Funcionalidad de búsqueda avanzada.
- Integración con mapas para visualizar ubicaciones.
- Sistema de reseñas y calificaciones de usuarios.
- Modo offline para acceder a destinos guardados sin conexión.

## 👨‍💻 Autor

- **Kevin Córdoba Rivera, Susan Guzmán, Sebastían Peraza, Génesis Vallejo** - *Estudiantes de Móviles II* - [UTN]

---

<div align="center">
  <p>Desarrollado como parte del Examen 1 para el curso de Móviles II - 2025</p>
</div>
