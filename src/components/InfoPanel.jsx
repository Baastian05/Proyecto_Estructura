export default function InfoPanel({ nodo }) {
  if (!nodo) return (
    <div className="rounded-xl p-4 border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 h-full flex flex-col items-center justify-center gap-3">
      <span className="text-4xl opacity-30">🐻</span>
      <p className="text-slate-500 text-xs text-center leading-relaxed">
        Haz clic en una<br/>reserva para ver<br/>su información
      </p>
    </div>
  )

  const tipoLabel = {
    paramo: "Páramo",
    bosque_nublado: "Bosque Nublado",
    amazonia: "Amazonía",
  }

  const tipoIcono = {
    paramo: "🏔️",
    bosque_nublado: "🌿",
    amazonia: "🌳",
  }

  const recursoIcono = {
    agua: "💧",
    semilla: "🌱",
    fruto: "🍎",
  }

  const tipoColor = {
    paramo:        "from-emerald-900 to-slate-900 border-emerald-700",
    bosque_nublado:"from-teal-900 to-slate-900 border-teal-700",
    amazonia:      "from-green-900 to-slate-900 border-green-700",
  }

  const hpColor = nodo.hp > 60 ? "text-green-400" : nodo.hp > 30 ? "text-yellow-400" : "text-red-400"
  const hpBar   = nodo.hp > 60 ? "bg-green-500"   : nodo.hp > 30 ? "bg-yellow-500"   : "bg-red-500"

  return (
    <div className="rounded-xl border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 h-full flex flex-col overflow-hidden">

      {/* Header tipo ecosistema */}
      <div className={`bg-gradient-to-r ${tipoColor[nodo.tipo]} border-b px-4 py-3`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{tipoIcono[nodo.tipo]}</span>
          <h2 className="text-white font-bold text-sm leading-tight">{nodo.nombre}</h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-black/30 text-slate-300">
          {tipoLabel[nodo.tipo]}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-3 flex-1 overflow-y-auto">

        {/* HP */}
        <div className="bg-slate-900 rounded-lg p-2.5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-400 text-xs">Salud del ecosistema</span>
            <span className={`font-bold text-sm ${hpColor}`}>{Math.round(nodo.hp)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className={`${hpBar} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${nodo.hp}%` }}/>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900 rounded-lg p-2 text-center">
            <p className="text-slate-500 text-xs mb-1">Amenaza</p>
            <p className="text-lg">{"⚠️".repeat(nodo.amenaza)}</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-2 text-center">
            <p className="text-slate-500 text-xs mb-1">Recurso</p>
            <p className="text-lg">{recursoIcono[nodo.recurso]}</p>
            <p className="text-green-300 text-xs">{nodo.recurso}</p>
          </div>
        </div>

        {/* Dato educativo */}
        <div className="bg-slate-900 rounded-lg p-3 border-l-2 border-green-500 flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">📚</span>
            <p className="text-green-400 text-xs font-bold uppercase tracking-wider">Dato ecológico</p>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{nodo.dato}</p>
        </div>

        {/* Wayra tip */}
        <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-700">
          <div className="flex items-start gap-2">
            <span className="text-base">🐻</span>
            <p className="text-slate-400 text-xs leading-relaxed italic">
              {nodo.amenaza >= 3
                ? "¡Esta reserva está en peligro crítico! Restaura sus corredores pronto."
                : nodo.hp < 40
                ? "El ecosistema se debilita. Planta para reducir la amenaza."
                : "Esta reserva está estable por ahora."}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}