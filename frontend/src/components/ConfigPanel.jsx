import { useState } from 'react';
import { Clock, Weight, Cog, Magnet, Recycle, Play, Shuffle, Info } from 'lucide-react';

export const VALORES_INICIALES = {
  intervaloLlegadaMin: 15,
  pesoLoteKg: 500,
  tiempoTrituracionMin: 8,
  tiempoSeparacionMin: 12,
  tasaReprocesoPct: 10,
};

const CAMPOS = [
  { key: 'intervaloLlegadaMin', label: 'Tiempo entre llegadas (min)', icon: Clock, min: 1, max: 120, step: 1 },
  { key: 'pesoLoteKg', label: 'Peso exacto del lote (kg)', icon: Weight, min: 50, max: 2000, step: 10 },
  { key: 'tiempoTrituracionMin', label: 'Tiempo de Trituración (min)', icon: Cog, min: 1, max: 30, step: 0.5 },
  { key: 'tiempoSeparacionMin', label: 'Tiempo de Separación (min)', icon: Magnet, min: 1, max: 30, step: 0.5 },
  { key: 'tasaReprocesoPct', label: 'Tasa de Reproceso (%)', icon: Recycle, min: 0, max: 100, step: 1, suffix: '%' },
];

function validar(valores) {
  for (const c of CAMPOS) {
    const v = Number(valores[c.key]);
    if (valores[c.key] === '' || Number.isNaN(v)) return `Complete el campo: ${c.label}`;
    if (v < c.min || v > c.max) return `${c.label}: valor entre ${c.min} y ${c.max}`;
  }
  return null;
}

function ConfigPanel({ onAleatorio, onConValores, cargando }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errorLocal, setErrorLocal] = useState('');

  const set = (key, val) => {
    setValores((prev) => ({ ...prev, [key]: val }));
    setErrorLocal('');
  };

  const handleConValores = () => {
    const err = validar(valores);
    if (err) {
      setErrorLocal(err);
      return;
    }
    onConValores({
      intervaloLlegadaMin: Number(valores.intervaloLlegadaMin),
      pesoLoteKg: Number(valores.pesoLoteKg),
      tiempoTrituracionMin: Number(valores.tiempoTrituracionMin),
      tiempoSeparacionMin: Number(valores.tiempoSeparacionMin),
      tasaReprocesoPct: Number(valores.tasaReprocesoPct),
    });
  };

  return (
    <section className="scada-card p-4 h-full flex flex-col">
      <h2 className="scada-section-title">1. Configuración Inicial (Determinística)</h2>
      <p className="text-xs font-semibold text-scada-blue mb-3">INGRESE LOS VALORES EXACTOS</p>

      <div className="space-y-3 flex-1">
        {CAMPOS.map(({ key, label, icon: Icon, min, max, step, suffix }) => (
          <div key={key}>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 mb-1 font-medium">
              <Icon size={14} className="text-scada-blue shrink-0" />
              {label}
            </label>
            <div className="relative">
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={valores[key]}
                disabled={cargando}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border border-scada-border rounded px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-scada-blue/30 disabled:bg-slate-50"
              />
              {suffix && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  {suffix}
                </span>
              )}
            </div>
          </div>
        ))}

        {errorLocal && (
          <p className="text-xs text-scada-red bg-red-50 border border-red-200 rounded px-2 py-1">
            {errorLocal}
          </p>
        )}

        <div className="flex gap-2 items-start text-xs text-scada-blue bg-blue-50 border border-blue-200 rounded p-2.5">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>
            Modelo Determinístico: todos los valores son fijos y exactos. La simulación será
            100% predecible y verificable con cálculos manuales.
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={handleConValores}
          disabled={cargando}
          className="w-full py-3 rounded-md bg-scada-green hover:bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition shadow-sm"
        >
          <Play size={18} fill="white" />
          {cargando ? 'SIMULANDO…' : 'Simular con Valores'}
        </button>
        <p className="text-[10px] text-center text-slate-400">(8 HORAS = 480 MINUTOS)</p>

        <button
          type="button"
          onClick={onAleatorio}
          disabled={cargando}
          className="w-full py-2.5 rounded-md border border-scada-border bg-scada-panel hover:bg-slate-100 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition"
        >
          <Shuffle size={16} />
          Simulación Aleatoria
        </button>
        <p className="text-[10px] text-center text-slate-400">
          Exponencial · Normal · Uniforme · Binomial
        </p>
      </div>
    </section>
  );
}

export default ConfigPanel;
