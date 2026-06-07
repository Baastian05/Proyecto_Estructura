export function componentesConexas(nodos, aristas) {
  const visitado = new Set()
  const componente = {}
  let numComponentes = 0

  function dfs(nodoId) {
    visitado.add(nodoId)
    componente[nodoId] = numComponentes

    aristas.forEach(a => {
      if (a.rota) return
      let vecino = null
      if (a.desde === nodoId) vecino = a.hasta
      if (a.hasta === nodoId) vecino = a.desde
      if (vecino !== null && !visitado.has(vecino)) dfs(vecino)
    })
  }

  nodos.forEach(n => {
    if (!visitado.has(n.id)) {
      dfs(n.id)
      numComponentes++
    }
  })

  return { componente, numComponentes }
}

export function detectarCiclos(nodos, aristas) {
  const parent = {}
  nodos.forEach(n => parent[n.id] = n.id)

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  function union(x, y) {
    const px = find(x), py = find(y)
    if (px === py) return false
    parent[px] = py
    return true
  }

  const aristasCiclo = []
  aristas.forEach(a => {
    if (a.rota) return
    if (!union(a.desde, a.hasta)) {
      aristasCiclo.push(a.id)
    }
  })

  return aristasCiclo
}

export function ordenTopologico(nodos, aristas) {
  const inDegree = {}
  nodos.forEach(n => inDegree[n.id] = 0)

  aristas.forEach(a => {
    if (!a.rota) inDegree[a.hasta] = (inDegree[a.hasta] || 0) + 1
  })

  const cola = nodos.filter(n => inDegree[n.id] === 0).map(n => n.id)
  const orden = []

  while (cola.length > 0) {
    const u = cola.shift()
    orden.push(u)
    aristas.forEach(a => {
      if (a.rota || a.desde !== u) return
      inDegree[a.hasta]--
      if (inDegree[a.hasta] === 0) cola.push(a.hasta)
    })
  }

  return orden // array de ids en orden topológico
}

// union-find interno para detectarCiclos
function unionFindSimple(n) {
  const parent = Array.from({ length: n }, (_, i) => i)

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  function union(x, y) {
    const px = find(x), py = find(y)
    if (px === py) return false
    parent[px] = py
    return true
  }

  return { find, union }
}