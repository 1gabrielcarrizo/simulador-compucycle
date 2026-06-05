import { Play, Info } from 'lucide-react';

function ConfigPanel({ onIniciar, cargando }) {
  return (
    <section className="scada-card p-4 h-full flex flex-col">
      <h2 className="scada-section-title">1. Configuración Inicial (Solo Lectura)</h2>

      <div className="space-y-3 text-sm flex-1">
        <p>
          <span className="text-slate-500">Imán instalado:</span>
          <br />
          <strong className="text-scada-blue text-base">RODILLO ESTÁNDAR</strong>
        </p>

        <div className="border border-scada-border rounded-md p-3 bg-scada-panel">
          <p className="font-semibold text-slate-700 mb-2">REGLAS DE LA PLANTA</p>
          <ul className="text-slate-600 space-y-1 text-xs leading-relaxed">
            <li>• Tasa de arribo media: <strong>15 min</strong> (Exponencial)</li>
            <li>• Peso por lote: <strong>500 kg ± 50</strong> (Normal)</li>
            <li>• Trituración HDD: Uniforme [6, 8] min</li>
            <li>• Trituración SSD: Uniforme [8, 10] min</li>
            <li>• Separación: Uniforme [10, 15] min</li>
            <li>• Clasificación: <strong>Binomial</strong> (10% reproceso)</li>
            <li>• Tipo disco: Binomial B(1, 0.7) → HDD/SSD</li>
          </ul>
        </div>

        <div className="flex gap-2 items-start text-xs text-scada-blue bg-blue-50 border border-blue-200 rounded p-2">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>
            Los pesos y tiempos se calculan automáticamente por el modelo estocástico del
            backend. No hay parámetros editables.
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onIniciar}
        disabled={cargando}
        className="mt-4 w-full py-4 rounded-md bg-scada-green hover:bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition shadow-md"
      >
        <Play size={20} fill="white" />
        {cargando ? 'SIMULANDO JORNADA…' : 'INICIAR JORNADA (8 HORAS)'}
      </button>
    </section>
  );
}

export default ConfigPanel;
