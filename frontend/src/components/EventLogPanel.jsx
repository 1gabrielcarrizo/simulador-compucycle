import { formatoTiempoLargo } from '../hooks/usePlayback.js';

function EventLogPanel({ tiempoMin, progresoPct, eventos }) {
  return (
    <section className="scada-card p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-bold text-scada-blue uppercase mb-2">Tiempo de Simulación</h3>
          <p className="text-sm text-slate-600">
            Tiempo transcurrido:{' '}
            <strong className="text-slate-800">
              {formatoTiempoLargo(tiempoMin)} ({Math.round(tiempoMin)} minutos)
            </strong>
          </p>
          <div className="mt-2 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-scada-blue transition-all duration-200 rounded-full"
              style={{ width: `${progresoPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">{progresoPct}% de la jornada (480 min)</p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-scada-blue uppercase mb-2">Eventos Recientes</h3>
          {eventos.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Sin eventos — inicie la jornada</p>
          ) : (
            <ul className="text-xs space-y-1 max-h-24 overflow-y-auto">
              {eventos.map((ev, i) => (
                <li key={`${ev.tiempoMin}-${i}`} className="text-slate-600">
                  <span className="font-mono text-scada-blue">{ev.hora}</span>{' '}
                  {ev.mensaje}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventLogPanel;
