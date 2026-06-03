import { Settings2, Play, RotateCcw } from 'lucide-react';
import RangeSlider from './RangeSlider.jsx';
import { DEFAULT_PARAMS } from '../utils/parametros.js';

function Sidebar({ params, onChange, onRun, onReset, disabled }) {
  const set = (key, val) => onChange({ ...params, [key]: val });
  const pctReciclar = 100 - params.pctRefurbish;

  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 card-panel p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-border">
        <Settings2 className="text-accent" size={18} />
        <h2 className="text-sm font-semibold text-white">Parámetros de Configuración</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <RangeSlider
          label="Tasa de Arribo de Lotes"
          value={params.tasaLotesHr}
          onChange={(v) => set('tasaLotesHr', v)}
          min={1}
          max={8}
          step={0.5}
          unit="lotes/hr"
          disabled={disabled}
        />
        <RangeSlider
          label="Tiempo de Trituración"
          value={params.tiempoTrituracion}
          onChange={(v) => set('tiempoTrituracion', v)}
          min={6}
          max={10}
          step={0.5}
          unit="min"
          disabled={disabled}
        />
        <RangeSlider
          label="Eficiencia de Separadora"
          value={params.eficienciaSep}
          onChange={(v) => set('eficienciaSep', v)}
          min={70}
          max={99}
          step={1}
          unit="%"
          disabled={disabled}
        />

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm text-slate-400">Clasificación: Refurbish vs. Reciclar</label>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-accent font-medium">Refurbish: {params.pctRefurbish}%</span>
            <span className="text-slate-500">Reciclar: {pctReciclar}%</span>
          </div>
          <RangeSlider
            label=""
            value={params.pctRefurbish}
            onChange={(v) => set('pctRefurbish', v)}
            min={20}
            max={50}
            step={5}
            unit=""
            disabled={disabled}
          />
        </div>

        <RangeSlider
          label="Capacidad depósito (lotes máx.)"
          value={params.capacidadLotes}
          onChange={(v) => set('capacidadLotes', v)}
          min={20}
          max={60}
          step={5}
          unit="lotes"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => onReset(DEFAULT_PARAMS)}
          disabled={disabled}
          className="px-4 py-3 rounded-lg bg-slate-700/80 text-slate-300 text-sm hover:bg-slate-600 transition disabled:opacity-50 flex items-center gap-1"
        >
          <RotateCcw size={16} />
          Resetear
        </button>
        <button
          type="button"
          onClick={onRun}
          disabled={disabled}
          className="flex-1 py-3 rounded-lg bg-accent hover:bg-accent-glow text-surface font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-accent/20"
        >
          <Play size={18} fill="currentColor" />
          {disabled ? 'Procesando…' : 'Iniciar Simulación'}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
