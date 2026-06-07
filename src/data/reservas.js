export const nodos = [
    { id: 0, nombre: "Antisana", x: 420, y: 120, hp: 100, amenaza: 2, tipo: "paramo", recurso: "agua", dato: "Hábitat principal del oso de anteojos. Cubre 120.000 ha de páramo y bosque nublado." },
    { id: 1, nombre: "Cayambe-Coca", x: 620, y: 100, hp: 100, amenaza: 1, tipo: "bosque_nublado", recurso: "semilla", dato: "Reserva más grande del Ecuador con 403.103 ha. Conecta Sierra y Amazonía." },
    { id: 2, nombre: "Cofán-Bermejo", x: 800, y: 160, hp: 100, amenaza: 3, tipo: "amazonia", recurso: "fruto", dato: "Zona de alta biodiversidad. Presión fuerte de tala ilegal en sus bordes." },
    { id: 3, nombre: "Cotopaxi", x: 300, y: 260, hp: 100, amenaza: 2, tipo: "paramo", recurso: "agua", dato: "Páramo de altura. El oso baja hasta aquí en busca de bromelias y frutos." },
    { id: 4, nombre: "Sumaco-Napo", x: 650, y: 280, hp: 100, amenaza: 2, tipo: "bosque_nublado", recurso: "semilla", dato: "Volcán Sumaco rodeado de bosque primario. Corredor clave hacia Amazonía." },
    { id: 5, nombre: "Llanganates", x: 420, y: 380, hp: 100, amenaza: 3, tipo: "bosque_nublado", recurso: "semilla", dato: "El oso de anteojos necesita mínimo 10.000 ha continuas. Llanganates: 219.707 ha." },
    { id: 6, nombre: "Sangay", x: 600, y: 440, hp: 100, amenaza: 1, tipo: "bosque_nublado", recurso: "fruto", dato: "Patrimonio Natural de la Humanidad (UNESCO). Uno de los volcanes más activos del mundo." },
    { id: 7, nombre: "Podocarpus", x: 420, y: 560, hp: 100, amenaza: 1, tipo: "amazonia", recurso: "fruto", dato: "Meta final. Bosque de podocarpus — único conífero nativo del Ecuador. 146.280 ha." },
]

export const aristasIniciales = [
    { id: 0, desde: 0, hasta: 1, costo: 3, capacidad: 10, flujo: 8, rota: false, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 1, desde: 0, hasta: 3, costo: 4, capacidad: 8, flujo: 5, rota: false, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 2, desde: 1, hasta: 2, costo: 5, capacidad: 6, flujo: 2, rota: true, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 3, desde: 1, hasta: 4, costo: 4, capacidad: 9, flujo: 7, rota: false, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 4, desde: 3, hasta: 5, costo: 6, capacidad: 7, flujo: 3, rota: true, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 5, desde: 4, hasta: 5, costo: 3, capacidad: 8, flujo: 6, rota: false, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 6, desde: 4, hasta: 6, costo: 5, capacidad: 7, flujo: 4, rota: true, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 7, desde: 5, hasta: 6, costo: 4, capacidad: 9, flujo: 7, rota: false, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 8, desde: 5, hasta: 7, costo: 7, capacidad: 6, flujo: 1, rota: true, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 9, desde: 6, hasta: 7, costo: 4, capacidad: 8, flujo: 5, rota: false, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
    { id: 10, desde: 0, hasta: 5, costo: 5, capacidad: 7, flujo: 4, rota: false, cazador: false, derrumbe: false, lluviaAcida: false, sequia: false },
]
