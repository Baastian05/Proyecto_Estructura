function unionFind(n) {
  const parent = Array.from({ length: n }, (_, i) => i)
  const rank = new Array(n).fill(0)

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  function union(x, y) {
    const px = find(x), py = find(y)
    if (px === py) return false
    if (rank[px] < rank[py]) parent[px] = py
    else if (rank[px] > rank[py]) parent[py] = px
    else { parent[py] = px; rank[px]++ }
    return true
  }

  return { find, union }
}

export function kruskal(nodos, aristas) {
  const { union } = unionFind(nodos.length)

  // ordenar aristas por costo (rotas primero — son las que necesitan restauración)
  const ordenadas = [...aristas].sort((a, b) => a.costo - b.costo)

  const mst = []
  for (const arista of ordenadas) {
    if (union(arista.desde, arista.hasta)) {
      mst.push(arista.id)
      if (mst.length === nodos.length - 1) break
    }
  }

  return mst // array de ids de aristas que forman el MST
}