# 🐻 Wayra — Guardián de los Andes

Juego educativo de teoría de grafos desarrollado en React + Vite. El jugador controla a Wayra, el último oso de anteojos de los Andes ecuatorianos, y debe restaurar los corredores ecológicos fragmentados antes de que el hábitat colapse.

---

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/) versión LTS (18 o superior)
- npm (viene incluido con Node.js)
- Git

---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/Baastian05/Proyecto_Estructura.git

# 2. Entrar a la carpeta
cd Proyecto_Estructura

# 3. Instalar dependencias
npm install

# 4. Correr el juego en modo desarrollo
npm run dev
```

Luego abre el navegador en: **http://localhost:5173**

---

## 🗂️ Estructura del proyecto

```
src/
  components/
    GraphCanvas.jsx     ← SVG del grafo principal
    AlgorithmPanel.jsx  ← Panel de algoritmos y log
    InfoPanel.jsx       ← Información educativa por reserva
  algorithms/
    dijkstra.js         ← Algoritmo de ruta mínima
    kruskal.js          ← Árbol de expansión mínima
    dfs.js              ← DFS, detección de ciclos, orden topológico
    eventos.js          ← Generador de eventos ambientales
  data/
    reservas.js         ← Nodos y aristas (8 reservas reales del Ecuador)
  App.jsx               ← Componente raíz, lógica principal
```

---

## 🗺️ El grafo — 8 reservas reales del Ecuador

El mapa es un **grafo ponderado** donde:

- **Nodos** = reservas ecológicas reales donde habita el oso de anteojos
- **Aristas** = corredores ecológicos entre reservas
- **Peso de arista** = costo energético de cruzar ese corredor

| Reserva | Ecosistema | Recurso |
|---------|-----------|---------|
| Antisana | Páramo | Agua |
| Cayambe-Coca | Bosque nublado | Semillas |
| Cofán-Bermejo | Amazonía | Frutos |
| Cotopaxi | Páramo | Agua |
| Sumaco-Napo | Bosque nublado | Semillas |
| Llanganates | Bosque nublado | Semillas |
| Sangay | Bosque nublado | Frutos |
| Podocarpus | Amazonía | Frutos |

---

## 🧠 Algoritmos implementados

### 1. ⚡ Dijkstra — Ruta mínima de energía
- Activa el modo Dijkstra → clic en nodo origen → clic en nodo destino
- El juego calcula y pinta en verde la ruta de menor costo energético
- Los números en cada arista muestran el costo
- Si restauras corredores, Dijkstra encuentra rutas nuevas que antes no existían

### 2. ★ Kruskal MST — Restauración óptima
- Calcula cuáles corredores rotos restaurar primero gastando el mínimo de semillas
- Los corredores prioritarios aparecen con ★ dorado
- Clic en ★ para restaurar ese corredor (cuesta 3 🌱)

### 3. ◉ Componentes conexas (DFS)
- Detecta zonas del ecosistema que están aisladas (sin conexión con el resto)
- Cada componente recibe un color de aura distinto
- Cuando restauras un corredor que une dos componentes, se reconectan visualmente

### 4. ↺ Detección de ciclos
- Identifica corredores que forman rutas circulares en el grafo
- En ecología real los ciclos son vitales: permiten migración sin callejones sin salida
- Los corredores cíclicos aparecen en color fucsia

### 5. ⟶ Orden topológico (Kahn's)
- Calcula en qué orden restaurar las reservas según dependencias ecológicas
- Aparecen números morados sobre cada nodo indicando la prioridad

---

## 🎮 Mecánicas de juego

### Recursos
- Las reservas activas generan **semillas** automáticamente cada 5 segundos
- Restaurar un corredor roto cuesta **3 🌱**
- Ahuyentar un cazador cuesta **2 🌱**

### HP de reservas
- Cada reserva tiene una barra de salud que baja con el tiempo según su nivel de amenaza
- Si el HP llega a 0, la reserva muere y sus corredores se bloquean

### 🎯 Cazadores furtivos
- Cada 12 segundos aparece un cazador en un corredor sano aleatorio
- El corredor queda bloqueado (icono 🎯 rojo)
- Clic en el 🎯 para ahuyentarlo gastando 2 semillas

### Eventos ambientales (cada 20 segundos)
| Evento | Efecto | Icono |
|--------|--------|-------|
| 🪨 Derrumbe | Bloquea un corredor temporalmente (20s, se restaura solo) | 🪨 |
| 🪚 Tala ilegal | Reduce HP -20 y aumenta costo de corredores del nodo | ⚠️ |
| 🧪 Lluvia ácida | Reduce capacidad de un corredor | 🧪 |
| ☀️ Sequía | Bloquea todos los corredores de un nodo (25s, se restaura solo) | ☀️ |

---

## 🔬 Justificación académica

El hábitat del oso de anteojos se modela como un **grafo ponderado** porque los corredores ecológicos reales son exactamente eso: nodos (ecosistemas) conectados por aristas (rutas de migración) con pesos (dificultad de tránsito).

Ninguna otra estructura de datos — árbol, lista, pila, cola — puede modelar simultáneamente:
- Conectividad dinámica (componentes conexas)
- Pesos variables (Dijkstra)
- Flujo entre nodos (capacidad de corredores)
- Restauración óptima con recursos limitados (MST Kruskal)

> El grafo no es una elección de diseño: es la única estructura correcta para este problema.

---

## 🛠️ Stack tecnológico

- **React** + **Vite** — framework y bundler
- **Tailwind CSS** — estilos
- **SVG inline** — renderizado del grafo
- **JavaScript puro** — implementación de algoritmos (sin librerías externas)
