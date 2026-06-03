import { TrendingUp } from 'lucide-react';
import WipDonutChart from './WipDonutChart.jsx';
import WipAreaChart from './WipAreaChart.jsx';
import { kgALotes } from '../utils/parametros.js';

function Resultados({ datos, capacidadLotes = 50 }) {
  if (!datos) {
    return (
      <div className="flex-1 flex flex-col gap-4 min-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-panel p-6 flex items-center justify-center min-h-[220px] text-slate-500 text-sm">
            Nivel de Saturación WIP
          </div>
          <div className="card-panel p-6 flex items-center justify-center min-h-[220px] text-slate-500 text-sm">
            Costos Operativos Acumulados
          </div>
        </div>
        <div className="card-panel p-6 flex-1 flex items-center justify-center text-slate-500 text-sm">
          Evolución del Inventario en Proceso (WIP)
        </div>
      </div>
    );
  }

  const t = datos.totales;
  const lotesMax = kgALotes(t.wipMaximoGlobal);
  const lotesActuales = Math.min(capacidadLotes, Math.round(lotesMax));
  const saturacionPct = Math.min(100, (lotesActuales / capacidadLotes) * 100);
  const limiteLotes = Math.round(capacidadLotes * 0.8);
  const trendPct = t.tasaRechazoPct > 0 ? -t.tasaRechazoPct * 0.1 + 2.3 : 2.3;

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-panel p-5">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Nivel de Saturación WIP</h3>
          <WipDonutChart
            porcentaje={saturacionPct}
            lotesActuales={lotesActuales}
            capacidadLotes={capacidadLotes}
          />
        </div>

        <div className="card-panel p-5 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Costos Operativos Acumulados
          </h3>
          <p className="text-4xl font-bold text-white tracking-tight">
            ${t.costosOperativosUsd.toLocaleString()}{' '}
            <span className="text-lg text-slate-500 font-normal">USD</span>
          </p>
          <div className="flex items-center gap-2 mt-3 text-accent text-sm">
            <TrendingUp size={16} />
            <span>
              {trendPct >= 0 ? '+' : ''}
              {trendPct.toFixed(1)}% respecto al periodo anterior
            </span>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate-500 border-t border-surface-border pt-3">
            <span>Scrap: {t.scrapRecuperadoKg.toLocaleString()} kg</span>
            <span>Rechazo: {t.tasaRechazoPct}%</span>
          </div>
        </div>
      </div>

      <div className="card-panel p-5 flex-1 min-h-[340px] flex flex-col">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          Evolución del Inventario en Proceso (WIP)
        </h3>
        <WipAreaChart serieWip={datos.serieWip} limiteLotes={limiteLotes} />
      </div>

      <p className="text-xs text-slate-600 px-1 truncate" title={t.decisionFinal}>
        {datos.iman?.nombre} · {t.decisionFinal}
      </p>
    </div>
  );
}

export default Resultados;
