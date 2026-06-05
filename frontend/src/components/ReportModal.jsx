import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { formatoTiempoLargo } from '../hooks/usePlayback.js';

function ReportModal({ reporte, onCerrar }) {
  if (!reporte) return null;

  const critico = reporte.requiereUpgrade;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-scada-border w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-scada-border bg-scada-panel">
          <h2 className="font-bold text-scada-blue text-sm uppercase">
            4. Reporte de Cierre y Decisión Gerencial
          </h2>
          <button type="button" onClick={onCerrar} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-scada-border">
          <div className="p-5 space-y-2 text-sm">
            <p>
              <span className="text-slate-500">Lotes procesados:</span>{' '}
              <strong>{reporte.lotesTotales}</strong>
            </p>
            <p>
              <span className="text-slate-500">HDD / SSD:</span>{' '}
              <strong>
                {reporte.pctHDD}% / {reporte.pctSSD}%
              </strong>
            </p>
            <p>
              <span className="text-slate-500">WIP Promedio:</span>{' '}
              <strong className={critico ? 'text-scada-red' : 'text-scada-green'}>
                {reporte.wipPromedio} kg
              </strong>
            </p>
            <p>
              <span className="text-slate-500">WIP Final:</span>{' '}
              <strong className={critico ? 'text-scada-red' : ''}>{reporte.wipFinal} kg</strong>
            </p>
            <p>
              <span className="text-slate-500">Tasa reproceso:</span>{' '}
              <strong>{reporte.tasaReprocesoPct}%</strong>
            </p>
            <p>
              <span className="text-slate-500">Tiempo activo en reproceso:</span>{' '}
              <strong>
                {formatoTiempoLargo(reporte.minutosReproceso)} ({reporte.pctTiempoReproceso}%)
              </strong>
            </p>
          </div>

          <div className="p-5">
            {critico ? (
              <>
                <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                  <AlertTriangle className="text-scada-red shrink-0" size={22} />
                  <div className="text-sm">
                    <p className="font-bold text-scada-red uppercase">
                      WIP Promedio &gt;= 2000 kg — Estado Crítico
                    </p>
                    <p className="text-slate-600 mt-1 text-xs leading-relaxed">
                      Dado que el inventario promedio superó el umbral de 2000 kg, se recomienda
                      una actualización tecnológica para evitar cuellos de botella y paradas de
                      línea.
                    </p>
                  </div>
                </div>
                <div className="bg-scada-red text-white text-center font-bold py-4 px-3 rounded-md text-sm">
                  {reporte.recomendacion}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2 items-start bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                  <CheckCircle className="text-scada-green shrink-0" size={22} />
                  <div className="text-sm">
                    <p className="font-bold text-scada-green">Operación Estable</p>
                    <p className="text-slate-600 mt-1 text-xs">{reporte.decisionTexto}</p>
                  </div>
                </div>
                <div className="bg-scada-green text-white text-center font-bold py-4 px-3 rounded-md text-sm">
                  {reporte.recomendacion}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
