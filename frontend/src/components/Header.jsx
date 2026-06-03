function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function Header({ ejecutando, tiempoSegundos = 0 }) {
  return (
    <header className="h-16 border-b border-surface-border bg-surface-card/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-surface text-sm">
          CC
        </div>
        <div>
          <p className="font-semibold text-white leading-tight">CompuCycle</p>
          <p className="text-xs text-slate-500">Simulador ITAD</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={`w-2 h-2 rounded-full ${ejecutando ? 'bg-accent animate-pulse' : 'bg-slate-600'}`}
        />
        <span className="text-slate-400">
          {ejecutando ? 'Simulación en Ejecución' : 'Listo para simular'}
        </span>
        <span className="text-accent font-mono ml-2 tabular-nums">
          {formatTimer(tiempoSegundos)}
        </span>
      </div>

      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">Operador Planta</p>
          <p className="text-xs text-slate-500">Houston · ITAD</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent font-semibold text-sm">
          OP
        </div>
      </div>
    </header>
  );
}

export default Header;
