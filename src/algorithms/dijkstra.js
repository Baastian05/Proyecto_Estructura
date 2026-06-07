export function dijkstra(nodos, aristas, inicio) {
  const dist = {}
  const prev = {}
  const visitado = new Set()

  nodos.forEach(n => {
    dist[n.id] = Infinity
    prev[n.id] = null
  })
  dist[inicio] = 0

  while (visitado.size < nodos.length) {
    // nodo no visitado con menor distancia
    let u = null
    nodos.forEach(n => {
      if (!visitado.has(n.id)) {
        if (u === null || dist[n.id] < dist[u]) u = n.id
      }
    })

    if (u === null || dist[u] === Infinity) break
    visitado.add(u)

    // aristas conectadas a u (no rotas)
    aristas.forEach(a => {
      if (a.rota) return
      let vecino = null
      if (a.desde === u) vecino = a.hasta
      if (a.hasta === u) vecino = a.desde
      if (vecino === null || visitado.has(vecino)) return

      const nueva = dist[u] + a.costo
      if (nueva < dist[vecino]) {
        dist[vecino] = nueva
        prev[vecino] = { nodo: u, aristaId: a.id }
      }
    })
  }

  return { dist, prev }
}

export function reconstruirCamino(prev, destino) {
  const camino = []
  let actual = destino
  while (prev[actual] !== null) {
    camino.unshift({ nodo: actual, aristaId: prev[actual].aristaId })
    actual = prev[actual].nodo
  }
  camino.unshift({ nodo: actual, aristaId: null })
  return camino
}