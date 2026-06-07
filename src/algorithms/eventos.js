export const TIPOS_EVENTO = {
  DERRUMBE: "derrumbe",
  TALA: "tala",
  LLUVIA_ACIDA: "lluvia_acida",
  SEQUIA: "sequia",
}

const TIPOS = [
  TIPOS_EVENTO.DERRUMBE,
  TIPOS_EVENTO.TALA,
  TIPOS_EVENTO.LLUVIA_ACIDA,
  TIPOS_EVENTO.SEQUIA,
]

function elegirAleatorio(items) {
  if (items.length === 0) return null
  return items[Math.floor(Math.random() * items.length)]
}

export function generarEvento(nodos, aristas) {
  const nodosActivos = nodos.filter((n) => n.hp > 0)
  if (nodosActivos.length === 0) return null

  const aristasActivas = aristas.filter(
    (a) => !a.rota && !a.cazador && !a.derrumbe && !a.sequia
  )
  const aristasConCapacidad = aristasActivas.filter((a) => a.capacidad > 1)
  const nodosConAristasActivas = nodosActivos.filter((n) =>
    aristasActivas.some((a) => a.desde === n.id || a.hasta === n.id)
  )

  const tiposDisponibles = TIPOS.filter((tipo) => {
    if (tipo === TIPOS_EVENTO.DERRUMBE) return aristasActivas.length > 0
    if (tipo === TIPOS_EVENTO.LLUVIA_ACIDA) return aristasConCapacidad.length > 0
    if (tipo === TIPOS_EVENTO.SEQUIA) return nodosConAristasActivas.length > 0
    return nodosActivos.length > 0
  })

  const tipo = elegirAleatorio(tiposDisponibles)
  if (!tipo) return null

  if (tipo === TIPOS_EVENTO.DERRUMBE) {
    const arista = elegirAleatorio(aristasActivas)
    return { tipo, aristaId: arista.id }
  }

  if (tipo === TIPOS_EVENTO.LLUVIA_ACIDA) {
    const arista = elegirAleatorio(aristasConCapacidad)
    return { tipo, aristaId: arista.id }
  }

  if (tipo === TIPOS_EVENTO.SEQUIA) {
    const nodo = elegirAleatorio(nodosConAristasActivas)
    return { tipo, nodoId: nodo.id, nodoNombre: nodo.nombre }
  }

  const nodo = elegirAleatorio(nodosActivos)
  return { tipo, nodoId: nodo.id, nodoNombre: nodo.nombre }
}
