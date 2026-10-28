# GeoLogika

Juego web educativo inspirado en GeoGuessr. El jugador ve la foto de un lugar del mundo, lo ubica en un mapa interactivo y, al terminar cada ronda, aprende un dato sobre ese lugar. Cuanto más cerca esté de la ubicación real, más puntos gana.

Proyecto del curso **Lenguaje de Programación I** 
Docente: Richart Escobedo Quispe.

## Integrantes

| Integrante | Rol |
|---|---|
| Edwin Coaguila Suarez | Backend: servidor, rondas, cálculo de distancia y puntaje |
| Robert Vilca Mendoza | Frontend: interfaz, mapa y estilos |
| Cristhian Chunga Pacheco | Contenido: lugares, fotos y datos educativos |

Cada integrante trabaja en su propia rama y une sus cambios a `main` mediante Pull Request.

## Cómo se juega

1. Se muestra una foto de un lugar del mundo.
2. Haz clic en el mapa donde crees que está.
3. Pulsa **Adivinar**: verás el lugar real, la distancia, tus puntos y un dato educativo.
4. Cada partida tiene **5 rondas** (máximo 25 000 puntos).

El puntaje de cada ronda se calcula con la distancia entre tu clic y el lugar real (fórmula de Haversine): `puntos = 5000 * e^(-distancia_km / 1500)`.

## Tecnologías

| Tecnología | Para qué se usa |
|---|---|
| HTML, CSS y JavaScript | Interfaz del juego |
| Node.js | Entorno de ejecución del servidor |
| Express | Servidor web y API |
| Leaflet + OpenStreetMap | Mapa interactivo (sin API key) |
| dotenv | Lectura de variables de entorno desde `.env` |

## Estructura del proyecto

```
geo/
├── public/              # Frontend
│   ├── css/style.css    # Estilos
│   ├── js/main.js       # Flujo del juego (rondas, puntaje, pantallas)
│   ├── js/map.js        # Mapa de Leaflet (clics, marcadores, línea)
│   └── index.html
├── server/              # Backend
│   ├── data/places.json # Lugares: foto, coordenadas, país y dato educativo
│   └── index.js         # API y servidor Express
├── package.json
├── .gitignore
└── README.md
```

## Requisitos

- [Node.js](https://nodejs.org) (versión LTS)
- Git
- Conexión a internet (el mapa, las librerías de Leaflet y las fotos se cargan desde la web)

## Cómo ejecutarlo

```
git clone https://github.com/vanx365/geo.git
cd geo
npm install
npm start
```

Abre **http://localhost:3000** en el navegador. Para detener el servidor, presiona `Ctrl + C`.

> En Windows, si PowerShell tiene los scripts bloqueados, usa la terminal **Command Prompt** o escribe `npm.cmd install` y `npm.cmd start`.

## API del servidor

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/round` | Inicia una ronda y devuelve solo la foto. Las coordenadas se quedan en el servidor para evitar trampas. |
| POST | `/api/guess` | Recibe `roundId`, `lat` y `lng`; devuelve distancia, puntos, ubicación real, país y dato educativo. |


## Video de demostración
https://youtu.be/9NeQAjp5spE?si=rYryl2SDafzvgOZC

## Próximas mejoras

- Niveles de dificultad (países, regiones, ciudades).
- Temporizador por ronda.
- Pistas con IA que ayuden a razonar sin revelar la respuesta.
- Más lugares y fotos.
