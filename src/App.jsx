import { useState, useEffect, useRef } from "react"
import { nodos as nodosIniciales, aristasIniciales } from "./data/reservas"
import GraphCanvas from "./components/GraphCanvas"
import AlgorithmPanel from "./components/AlgorithmPanel"
import InfoPanel from "./components/InfoPanel"
import { generarEvento, TIPOS_EVENTO } from "./algorithms/eventos"

const INTERVALO_EVENTOS = 20000
const DURACION_DERRUMBE = 20000
const DURACION_SEQUIA = 25000

function mensajeEvento(evento) {
  switch (evento.tipo) {
    case TIPOS_EVENTO.DERRUMBE:
      return `🪨 Derrumbe bloqueó el corredor ${evento.aristaId}`
    case TIPOS_EVENTO.TALA:
      return `🪓 Tala en ${evento.nodoNombre}: -20 HP, amenaza +1 y corredores +3 costo`
    case TIPOS_EVENTO.LLUVIA_ACIDA:
      return `🧪 Lluvia ácida redujo la capacidad del corredor ${evento.aristaId}`
    case TIPOS_EVENTO.SEQUIA:
      return `☀️ Sequía en ${evento.nodoNombre}: corredores bloqueados temporalmente`
    default:
      return "Evento ambiental"
  }
}

export default function App() {
  const [nodos, setNodos] = useState(nodosIniciales)
  const [aristas, setAristas] = useState(aristasIniciales)
  const [algoritmo, setAlgoritmo] = useState(null)
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null)
  const [infoNodo, setInfoNodo] = useState(null)
  const [semillas, setSemillas] = useState(15)
  const nodosRef = useRef(nodosIniciales)
  const [log, setLog] = useState(["🐻 Wayra despierta. El hábitat está fragmentado."])

  useEffect(() => {
    nodosRef.current = nodos
  }, [nodos])

  useEffect(() => {
    const interval = setInterval(() => {
      setNodos(prev => prev.map(n => ({
        ...n,
        hp: Math.max(0, n.hp - n.amenaza * 0.5)
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    nodos.forEach(n => {
      if (n.hp <= 0) {
        setLog(l => {
          if (l.some(e => e.includes(n.nombre) && e.includes("murió"))) return l
          return [...l, `💀 ${n.nombre} murió — nodo eliminado del grafo`]
        })
        setAristas(prev => prev.map(a =>
          a.desde === n.id || a.hasta === n.id ? { ...a, rota: true } : a
        ))
      }
    })
  }, [nodos])

  useEffect(() => {
    const interval = setInterval(() => {
      const activos = nodos.filter(n => n.hp > 0)
      const semillasGanadas = activos.filter(n => n.recurso === "semilla").length
      if (semillasGanadas > 0) {
        setSemillas(s => s + semillasGanadas)
        setLog(l => [...l, `🌱 +${semillasGanadas} semillas recolectadas`])
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [nodos])

  // Cazadores furtivos — aparecen cada 12s
  useEffect(() => {
    const interval = setInterval(() => {
      setAristas(prev => {
        const candidatas = prev.filter(a => !a.rota && !a.cazador)
        if (candidatas.length === 0) return prev
        const victima = candidatas[Math.floor(Math.random() * candidatas.length)]
        setLog(l => [...l, `🎯 Cazador apareció en corredor ${victima.id}`])
        return prev.map(a => a.id === victima.id ? { ...a, cazador: true, rota: true } : a)
      })
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // Eventos ambientales — cada 20s
  useEffect(() => {
    const interval = setInterval(() => {
      setAristas(prevAristas => {
        const evento = generarEvento(nodosRef.current, prevAristas)
        if (!evento) return prevAristas

        console.log("EVENTO:", evento)
        setLog(l => [...l, mensajeEvento(evento)])

        switch (evento.tipo) {
          case TIPOS_EVENTO.DERRUMBE: {
            setTimeout(() => {
              setAristas(prev => prev.map(a =>
                a.id === evento.aristaId ? { ...a, rota: false, derrumbe: false } : a
              ))
              setLog(l => [...l, `✔ Derrumbe despejado — corredor ${evento.aristaId} restaurado`])
            }, DURACION_DERRUMBE)

            return prevAristas.map(a =>
              a.id === evento.aristaId ? { ...a, rota: true, derrumbe: true } : a
            )
          }

          case TIPOS_EVENTO.TALA: {
            setNodos(prevNodos => prevNodos.map(n =>
              n.id === evento.nodoId
                ? { ...n, hp: Math.max(0, n.hp - 20), amenaza: Math.min(3, n.amenaza + 1) }
                : n
            ))

            return prevAristas.map(a =>
              a.desde === evento.nodoId || a.hasta === evento.nodoId
                ? { ...a, costo: a.costo + 3 }
                : a
            )
          }

          case TIPOS_EVENTO.LLUVIA_ACIDA:
            return prevAristas.map(a => {
              if (a.id !== evento.aristaId) return a
              const nuevaCapacidad = Math.max(1, a.capacidad - 3)
              return {
                ...a,
                capacidad: nuevaCapacidad,
                flujo: Math.min(a.flujo, nuevaCapacidad),
                lluviaAcida: true,
              }
            })

          case TIPOS_EVENTO.SEQUIA: {
            setTimeout(() => {
              setAristas(prev => prev.map(a =>
                a.sequia ? { ...a, rota: false, sequia: false } : a
              ))
              setLog(l => [...l, `✔ Sequía terminó — corredores de ${evento.nodoNombre} restaurados`])
            }, DURACION_SEQUIA)

            return prevAristas.map(a =>
              (a.desde === evento.nodoId || a.hasta === evento.nodoId) && !a.rota && !a.cazador
                ? { ...a, rota: true, sequia: true }
                : a
            )
          }

          default:
            return prevAristas
        }
      })
    }, INTERVALO_EVENTOS)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#060d14" }}>

      {/* Header */}
      <header style={{ flexShrink: 0 }} className="bg-slate-800 border-b border-slate-700 px-6 py-2 flex items-center gap-4">
        <span className="text-2xl">🐻</span>
        <div>
          <h1 className="font-bold text-base text-green-400 leading-tight">Wayra</h1>
          <p className="text-slate-400 text-xs">Guardián de los Andes — Teoría de Grafos</p>
        </div>
        <div className="ml-auto flex gap-6 text-sm">
          <span className="text-slate-400">Nodos: <span className="text-white font-bold">{nodos.filter(n => n.hp > 0).length}</span></span>
          <span className="text-slate-400">Corredores rotos: <span className="text-red-400 font-bold">{aristas.filter(a => a.rota).length}</span></span>
          <span className="text-slate-400">Semillas: <span className="text-green-400 font-bold">{semillas} 🌱</span></span>
        </div>
      </header>

      {/* Main — ocupa todo el espacio restante sin scroll */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* Panel izquierdo */}
        <div style={{ width: "220px", flexShrink: 0, overflowY: "auto", padding: "10px", borderRight: "1px solid #1e293b" }}>
          <AlgorithmPanel
            algoritmo={algoritmo}
            setAlgoritmo={setAlgoritmo}
            semillas={semillas}
            setSemillas={setSemillas}
            log={log}
          />
        </div>

        {/* Grafo central */}
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, padding: "10px" }}>
          <GraphCanvas
            nodos={nodos}
            aristas={aristas}
            setAristas={setAristas}
            algoritmo={algoritmo}
            nodoSeleccionado={nodoSeleccionado}
            setNodoSeleccionado={setNodoSeleccionado}
            setInfoNodo={setInfoNodo}
            semillas={semillas}
            setSemillas={setSemillas}
            log={log}
            setLog={setLog}
          />
        </div>

        {/* Panel derecho */}
        <div style={{ width: "210px", flexShrink: 0, overflowY: "auto", padding: "10px", borderLeft: "1px solid #1e293b" }}>
          <InfoPanel nodo={infoNodo} />
        </div>

      </div>
    </div>
  )
}
