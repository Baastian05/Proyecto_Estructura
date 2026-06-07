export default function AlgorithmPanel({ algoritmo, setAlgoritmo, semillas, setSemillas, log }) {
  const botones = [
    { id: "dijkstra",   label: "Dijkstra",     icono: "⚡", desc: "Ruta mínima de energía",      color: "from-blue-600 to-blue-800",   border: "border-blue-400" },
    { id: "kruskal",    label: "Kruskal MST",  icono: "★",  desc: "Restauración óptima",          color: "from-yellow-600 to-yellow-800", border: "border-yellow-400" },
    { id: "dfs",        label: "Componentes",  icono: "◉",  desc: "Zonas aisladas",               color: "from-cyan-600 to-cyan-800",   border: "border-cyan-400" },
    { id: "ciclos",     label: "Ciclos",       icono: "↺",  desc: "Rutas circulares",             color: "from-fuchsia-600 to-fuchsia-800", border: "border-fuchsia-400" },
    { id: "topologico", label: "Topológico",   icono: "⟶", desc: "Orden de restauración",        color: "from-violet-600 to-violet-800", border: "border-violet-400" },
  ]

  return (
    <div className="flex flex-col gap-3 h-full">

      {/* Recursos */}
      <div className="rounded-xl p-3 border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
        <p className="text-slate-500 text-xs mb-2 uppercase tracking-widest font-bold">Recursos</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🌱</span>
          <span className="text-green-400 font-bold text-2xl">{semillas}</span>
          <span className="text-slate-400 text-xs">semillas</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
          <div className="bg-green-500 h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(100, (semillas / 30) * 100)}%` }}/>
        </div>
        <p className="text-slate-600 text-xs mt-1.5">Restaurar corredor = 3 🌱</p>
      </div>

      {/* Algoritmos */}
      <div className="rounded-xl p-3 border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
        <p className="text-slate-500 text-xs mb-2 uppercase tracking-widest font-bold">Algoritmos</p>
        <div className="flex flex-col gap-1.5">
          {botones.map(b => (
            <button
              key={b.id}
              onClick={() => setAlgoritmo(algoritmo === b.id ? null : b.id)}
              className={`text-left px-3 py-2 rounded-lg border transition-all duration-200 ${
                algoritmo === b.id
                  ? `bg-gradient-to-r ${b.color} ${b.border} text-white shadow-lg`
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{b.icono}</span>
                <span className="font-bold text-xs">{b.label}</span>
              </div>
              <p className="text-xs opacity-60 mt-0.5 ml-6">{b.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="rounded-xl p-3 border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
        <p className="text-slate-500 text-xs mb-2 uppercase tracking-widest font-bold">Leyenda</p>
        <div className="flex flex-col gap-1">
          {[
            { color: "bg-slate-500",  label: "Corredor sano" },
            { color: "bg-red-500",    label: "Corredor roto" },
            { color: "bg-green-500",  label: "Ruta Dijkstra" },
            { color: "bg-yellow-500", label: "MST Kruskal" },
            { color: "bg-fuchsia-500",label: "Ciclo" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-1.5 rounded-full ${color}`}/>
              <span className="text-slate-400 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className="rounded-xl p-3 border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 flex-1 overflow-hidden flex flex-col">
        <p className="text-slate-500 text-xs mb-2 uppercase tracking-widest font-bold">Log</p>
        <div className="flex flex-col-reverse gap-1 overflow-y-auto flex-1">
          {[...log].reverse().map((entry, i) => (
            <p key={i} className={`text-xs font-mono pb-1 border-b border-slate-800 ${
              entry.includes("✗") ? "text-red-400" :
              entry.includes("✔") ? "text-green-400" :
              entry.includes("💀") ? "text-red-500" :
              "text-slate-400"
            }`}>
              {entry}
            </p>
          ))}
        </div>
      </div>

    </div>
  )
}