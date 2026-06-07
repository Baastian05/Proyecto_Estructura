import { useEffect, useState } from "react"
import { dijkstra, reconstruirCamino } from "../algorithms/dijkstra"
import { kruskal } from "../algorithms/kruskal"
import { componentesConexas, detectarCiclos, ordenTopologico } from "../algorithms/dfs"

const COLORES_COMPONENTE = ["#22d3ee", "#f59e0b", "#a78bfa", "#34d399", "#fb7185", "#60a5fa", "#e879f9", "#4ade80"]

const TIPO_ICONO = {
    paramo: "🏔️",
    bosque_nublado: "🌿",
    amazonia: "🌳",
}

const TIPO_GLOW = {
    paramo: "#86efac",
    bosque_nublado: "#6ee7b7",
    amazonia: "#34d399",
}

export default function GraphCanvas({ nodos, aristas, setAristas, algoritmo, nodoSeleccionado, setNodoSeleccionado, setInfoNodo, semillas, setSemillas, log, setLog }) {
    const [camino, setCamino] = useState([])
    const [aristasCamino, setAristasCamino] = useState([])
    const [mst, setMst] = useState([])
    const [componentes, setComponentes] = useState({})
    const [ciclos, setCiclos] = useState([])
    const [topoOrden, setTopoOrden] = useState([])
    const [origen, setOrigen] = useState(null)
    const [restaurando, setRestaurando] = useState(null)

    useEffect(() => {
        const { componente } = componentesConexas(nodos, aristas)
        setComponentes(componente)
    }, [aristas])

    useEffect(() => {
        console.log("ARISTAS:", aristas.map(a => ({ id: a.id, rota: a.rota, sequia: a.sequia, lluviaAcida: a.lluviaAcida, derrumbe: a.derrumbe })))
    }, [aristas])

    useEffect(() => {
        if (algoritmo === "kruskal") {
            const mstIds = kruskal(nodos, aristas)
            setMst(mstIds)
            setLog(l => [...l, `★ MST calculado: ${mstIds.length} corredores óptimos`])
        } else setMst([])

        if (algoritmo === "ciclos") {
            const c = detectarCiclos(nodos, aristas)
            setCiclos(c)
            setLog(l => [...l, `↺ Ciclos detectados: ${c.length} corredores forman rutas circulares`])
        } else setCiclos([])

        if (algoritmo === "topologico") {
            const orden = ordenTopologico(nodos, aristas)
            setTopoOrden(orden)
            setLog(l => [...l, `⟶ Orden: ${orden.map(id => nodos[id].nombre).join(" → ")}`])
        } else setTopoOrden([])

        if (algoritmo !== "dijkstra") {
            setCamino([]); setAristasCamino([]); setOrigen(null)
        }
    }, [algoritmo])

    function handleNodoClick(nodo) {
        setInfoNodo(nodo)
        setNodoSeleccionado(nodo.id)
        if (algoritmo === "dijkstra") {
            if (origen === null) {
                setOrigen(nodo.id)
                setLog(l => [...l, `⬡ Dijkstra origen: ${nodo.nombre}`])
            } else if (origen !== nodo.id) {
                const { dist, prev } = dijkstra(nodos, aristas, origen)
                const ruta = reconstruirCamino(prev, nodo.id)
                setCamino(ruta.map(r => r.nodo))
                setAristasCamino(ruta.map(r => r.aristaId).filter(Boolean))
                setLog(l => [...l, `✔ ${nodos[origen].nombre} → ${nodo.nombre} | Costo: ${dist[nodo.id]}`])
                setOrigen(null)
            }
        }
    }

    function restaurarArista(aristaId) {
        if (semillas < 3) { setLog(l => [...l, "✗ Semillas insuficientes (necesitas 3)"]); return }
        setRestaurando(aristaId)
        setTimeout(() => {
            setAristas(prev => prev.map(a => a.id === aristaId ? { ...a, rota: false, costo: Math.max(1, a.costo - 2) } : a))
            setSemillas(s => s - 3)
            setLog(l => [...l, `✔ Corredor restaurado | -3 🌱`])
            setRestaurando(null)
        }, 600)
    }

    function ahuyentarCazador(aristaId) {
        if (semillas < 2) { setLog(l => [...l, "✗ Semillas insuficientes (necesitas 2)"]); return }
        setAristas(prev => prev.map(a => a.id === aristaId ? { ...a, cazador: false, rota: false } : a))
        setSemillas(s => s - 2)
        setLog(l => [...l, `✔ Cazador ahuyentado | -2 🌱`])
    }

    function getColorArista(a) {
        if (aristasCamino.includes(a.id)) return "#22c55e"
        if (ciclos.includes(a.id)) return "#e879f9"
        if (mst.includes(a.id) && a.rota) return "#f59e0b"
        if (a.rota) return "#ef4444"
        return "#334155"
    }

    function getFlujoColor(pct) {
        if (pct >= 0.7) return "#22c55e"
        if (pct >= 0.4) return "#f59e0b"
        return "#ef4444"
    }

    // punto medio con offset para etiquetas
    function midpoint(desde, hasta, offsetY = 0) {
        return { x: (desde.x + hasta.x) / 2, y: (desde.y + hasta.y) / 2 + offsetY }
    }

    return (
        <svg width="100%" height="100%" viewBox="0 0 1100 680" className="w-full h-full">
            <defs>
                {/* Filtros glow */}
                <filter id="glow-green">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-yellow">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-red">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-node">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Gradiente fondo */}
                <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#0f1f2e" />
                    <stop offset="100%" stopColor="#060d14" />
                </radialGradient>
                {/* Animación restaurar */}
                <style>{`
          @keyframes pulse-restore {
            0% { opacity: 0.3; r: 20; }
            50% { opacity: 0.8; r: 35; }
            100% { opacity: 0.3; r: 20; }
          }
          @keyframes dash-flow {
            to { stroke-dashoffset: -20; }
          }
          .arista-camino {
            animation: dash-flow 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </defs>

            {/* Fondo */}
            <rect width="1100" height="680" fill="url(#bg-grad)" rx="12" />

            {/* Grid sutil */}
            {Array.from({ length: 12 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 60} x2="1100" y2={i * 60} stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />
            ))}
            {Array.from({ length: 19 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="680" stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />
            ))}

            {/* Aristas */}
            {aristas.map(a => {
                const desde = nodos[a.desde]
                const hasta = nodos[a.hasta]
                const mid = midpoint(desde, hasta)
                const flujoPct = a.flujo / a.capacidad
                const esCamino = aristasCamino.includes(a.id)
                const esMst = mst.includes(a.id)
                const esCiclo = ciclos.includes(a.id)
                const esRestaurando = restaurando === a.id

                return (
                    <g key={a.id}>
                        {/* Sombra/glow arista */}
                        {esCamino && <line x1={desde.x} y1={desde.y} x2={hasta.x} y2={hasta.y}
                            stroke="#22c55e" strokeWidth="8" opacity="0.2" filter="url(#glow-green)" />}
                        {esMst && a.rota && <line x1={desde.x} y1={desde.y} x2={hasta.x} y2={hasta.y}
                            stroke="#f59e0b" strokeWidth="6" opacity="0.25" filter="url(#glow-yellow)" />}
                        {a.rota && !esMst && <line x1={desde.x} y1={desde.y} x2={hasta.x} y2={hasta.y}
                            stroke="#ef4444" strokeWidth="4" opacity="0.15" filter="url(#glow-red)" />}

                        {/* Línea principal */}
                        <line
                            x1={desde.x} y1={desde.y} x2={hasta.x} y2={hasta.y}
                            stroke={getColorArista(a)}
                            strokeWidth={esCamino ? 3 : esMst ? 2.5 : 2}
                            strokeDasharray={a.rota ? "8,5" : esCamino ? "12,4" : "none"}
                            className={esCamino ? "arista-camino" : ""}
                            opacity={a.rota ? 0.7 : 0.9}
                        />

                        {/* Etiqueta costo energético */}
                        <rect x={mid.x - 14} y={mid.y - 20} width="28" height="14" rx="4"
                            fill="#0f172a" opacity="0.85" />
                        <text x={mid.x} y={mid.y - 10} textAnchor="middle"
                            fill={esCamino ? "#22c55e" : "#94a3b8"} fontSize="10" fontFamily="monospace" fontWeight="bold">
                            {a.costo}⚡
                        </text>

                        {/* Etiqueta flujo */}
                        <rect x={mid.x - 14} y={mid.y + 8} width="28" height="13" rx="4"
                            fill="#0f172a" opacity="0.85" />
                        <text x={mid.x} y={mid.y + 18} textAnchor="middle"
                            fill={getFlujoColor(flujoPct)} fontSize="10" fontFamily="monospace">
                            {Math.round(flujoPct * 100)}%
                        </text>

                        {/* Botón restaurar MST */}
                        {a.rota && esMst && (
                            <g onClick={() => restaurarArista(a.id)} style={{ cursor: "pointer" }}>
                                <circle cx={mid.x} cy={mid.y - 1} r={13}
                                    fill="#f59e0b" filter="url(#glow-yellow)" opacity={0.95} />
                                <text x={mid.x} y={mid.y + 4} textAnchor="middle" fill="#000" fontSize="13" fontWeight="bold">★</text>
                            </g>
                        )}

                        {/* Cazador furtivo */}
                        {a.cazador && (
                            <g onClick={() => ahuyentarCazador(a.id)} style={{ cursor: "pointer" }}>
                                <circle cx={mid.x} cy={mid.y - 1} r={14} fill="#7f1d1d" opacity={0.95}
                                    filter="url(#glow-red)" />
                                <text x={mid.x} y={mid.y + 5} textAnchor="middle" fontSize="14">🎯</text>
                                <text x={mid.x} y={mid.y + 22} textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">2🌱</text>
                            </g>
                        )}

                        {/* Botón restaurar normal */}
                        {a.rota && !a.cazador && !esMst && algoritmo !== "kruskal" && (
                            <g onClick={() => restaurarArista(a.id)} style={{ cursor: "pointer" }}>
                                <circle cx={mid.x} cy={mid.y - 1} r={11} fill="#3b82f6" opacity={0.9} />
                                <text x={mid.x} y={mid.y + 4} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">+</text>
                            </g>
                        )}

                        {/* Derrumbe */}
                        {a.derrumbe && (
                            <g>
                                <circle cx={mid.x} cy={mid.y - 1} r={14} fill="#78350f" opacity={0.95}
                                    filter="url(#glow-red)" />
                                <text x={mid.x} y={mid.y + 5} textAnchor="middle" fontSize="14">🪨</text>
                                <text x={mid.x} y={mid.y + 22} textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace">auto</text>
                            </g>
                        )}

                        {/* Lluvia ácida */}
                        {a.lluviaAcida && (
                            <g>
                                <circle cx={mid.x + 16} cy={mid.y - 12} r={10} fill="#365314" opacity={0.95} />
                                <text x={mid.x + 16} y={mid.y - 8} textAnchor="middle" fontSize="11">🧪</text>
                            </g>
                        )}

                        {/* Animación restaurando */}
                        {esRestaurando && (
                            <circle cx={mid.x} cy={mid.y} r="20" fill="none"
                                stroke="#22c55e" strokeWidth="2" opacity="0.6"
                                style={{ animation: "pulse-restore 0.6s ease-in-out" }} />
                        )}
                    </g>
                )
            })}

            {/* Nodos */}
            {nodos.map(n => {
                const compColor = COLORES_COMPONENTE[componentes[n.id] % COLORES_COMPONENTE.length] || "#94a3b8"
                const seleccionado = nodoSeleccionado === n.id
                const esOrigen = origen === n.id
                const topoIdx = topoOrden.indexOf(n.id)
                const muerto = n.hp <= 0
                const glowColor = TIPO_GLOW[n.tipo] || "#94a3b8"
                const icono = TIPO_ICONO[n.tipo] || "🌿"

                return (
                    <g key={n.id} onClick={() => !muerto && handleNodoClick(n)}
                        style={{ cursor: muerto ? "not-allowed" : "pointer" }}
                        opacity={muerto ? 0.35 : 1}>

                        {/* Aura componente (solo en modo dfs) */}
                        {algoritmo === "dfs" && (
                            <circle cx={n.x} cy={n.y} r={38} fill={compColor} opacity={0.25}
                                filter="url(#glow-node)" />
                        )}

                        {/* Glow seleccionado/origen */}
                        {(seleccionado || esOrigen) && (
                            <circle cx={n.x} cy={n.y} r={32} fill="none"
                                stroke={esOrigen ? "#f59e0b" : "#22c55e"}
                                strokeWidth="2" opacity="0.6" filter="url(#glow-node)" />
                        )}

                        {/* Anillo tipo ecosistema */}
                        <circle cx={n.x} cy={n.y} r={26}
                            fill="none" stroke={glowColor} strokeWidth="1.5" opacity="0.4" />

                        {/* Círculo principal */}
                        <circle cx={n.x} cy={n.y} r={22}
                            fill={seleccionado || esOrigen ? "#1e3a5f" : "#0f2035"}
                            stroke={esOrigen ? "#f59e0b" : seleccionado ? "#22c55e" : compColor}
                            strokeWidth={seleccionado || esOrigen ? 2.5 : 1.5} />

                        {/* Icono ecosistema */}
                        <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize="16">{icono}</text>

                        {/* Camino Dijkstra ring */}
                        {camino.includes(n.id) && (
                            <circle cx={n.x} cy={n.y} r={28} fill="none"
                                stroke="#22c55e" strokeWidth="2" opacity="0.7"
                                strokeDasharray="5,3" />
                        )}

                        {/* HP bar */}
                        <rect x={n.x - 20} y={n.y + 28} width={40} height={5} fill="#1e293b" rx={3} />
                        <rect x={n.x - 20} y={n.y + 28} width={40 * (n.hp / 100)} height={5}
                            fill={n.hp > 60 ? "#22c55e" : n.hp > 30 ? "#f59e0b" : "#ef4444"} rx={3} />

                        {/* Nombre */}
                        <text x={n.x} y={n.y + 48} textAnchor="middle"
                            fill="#e2e8f0" fontSize="10" fontFamily="sans-serif" fontWeight="600">
                            {n.nombre}
                        </text>

                        {/* Amenaza */}
                        {n.amenaza === 3 && (
                            <text x={n.x + 18} y={n.y - 16} fontSize="11">⚠️</text>
                        )}

                        {/* Sequía */}
                        {aristas.filter(a => a.sequia).some(a => a.desde === n.id || a.hasta === n.id) && (
                            <g>
                                <circle cx={n.x} cy={n.y - 30} r={10} fill="#92400e" opacity={0.95} />
                                <text x={n.x} y={n.y - 25} textAnchor="middle" fontSize="12">☀️</text>
                            </g>
                        )}

                        {/* Orden topológico */}
                        {topoIdx !== -1 && (
                            <g>
                                <circle cx={n.x - 18} cy={n.y - 18} r={9} fill="#7c3aed" opacity={0.9} />
                                <text x={n.x - 18} y={n.y - 14} textAnchor="middle"
                                    fill="#fff" fontSize="10" fontWeight="bold">{topoIdx + 1}</text>
                            </g>
                        )}

                        {/* Muerto */}
                        {muerto && (
                            <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize="18">💀</text>
                        )}
                    </g>
                )
            })}
        </svg>
    )
}
