import { RefreshCw } from 'lucide-react';

const CAPACIDAD_TOLVA = 2500;

function MachineCard({ titulo, colorHeader, estado, loteKg }) {
  const libre = estado === 'LIBRE';
  return (
    <div className="scada-card overflow-hidden flex-1 min-w-[140px]">
      <div className={`${colorHeader} text-white text-center text-xs font-bold py-1.5`}>
        {titulo}
      </div>
      <div className="p-3 text-center">
        <span
          className={`inline-block px-3 py-1 rounded text-xs font-bold mb-2 ${
            libre ? 'bg-green-100 text-scada-green' : 'bg-red-100 text-scada-red'
          }`}
        >
          {estado}
        </span>
        <p className="text-lg font-bold text-slate-800">{loteKg} kg</p>
      </div>
    </div>
  );
}

function PlantMonitor({ frame, reprocesoActivo }) {
  const wip = frame?.wipKg ?? 0;
  const pctTolva = Math.min(100, Math.round((wip / CAPACIDAD_TOLVA) * 100));

  const trit = frame?.trituradora ?? { estado: 'LIBRE', loteKg: 0 };
  const sep = frame?.separadora ?? { estado: 'LIBRE', loteKg: 0 };
  const reproceso = reprocesoActivo ?? frame?.reprocesoActivo ?? false;

  return (
    <section className="scada-card p-4 h-full">
      <h2 className="scada-section-title">2. Monitor de Planta en Tiempo Real</h2>

      <div className="relative">
        <div className="flex items-stretch gap-3 justify-between">
          <MachineCard
            titulo="TRITURADORA"
            colorHeader="bg-scada-green"
            estado={trit.estado}
            loteKg={trit.loteKg}
          />

          <div className="scada-card overflow-hidden flex-[1.4] border-2 border-scada-blue">
            <div className="bg-scada-blue text-white text-center text-xs font-bold py-1.5">
              TOLVA PULMÓN (WIP)
            </div>
            <div className="p-4">
              <p className="text-center text-xl font-bold text-slate-800 mb-2">
                {Math.round(wip)} kg <span className="text-sm font-normal text-slate-500">en espera</span>
              </p>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-scada-blue transition-all duration-300 rounded-full"
                  style={{ width: `${pctTolva}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center mt-1">
                Capacidad máx. {CAPACIDAD_TOLVA} kg ({pctTolva}%)
              </p>
            </div>
          </div>

          <MachineCard
            titulo="SEPARADORA"
            colorHeader="bg-scada-red"
            estado={sep.estado}
            loteKg={sep.loteKg}
          />
        </div>

        {/* Lazo de reproceso */}
        <div className="mt-6 relative flex justify-center">
          <svg className="absolute -top-2 w-full max-w-md h-16 pointer-events-none" viewBox="0 0 400 60">
            <path
              d="M 60 50 Q 200 -10 340 50"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          </svg>
          <div className="text-center mt-10 z-10">
            <p className="text-xs text-scada-blue font-medium">
              LAZO DE REPROCESO (10% material sucio)
            </p>
            <div
              className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                reproceso
                  ? 'bg-green-100 text-scada-green'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <RefreshCw size={12} className={reproceso ? 'animate-spin' : ''} />
              {reproceso ? 'REPROCESO ACTIVO' : 'REPROCESO INACTIVO'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlantMonitor;
