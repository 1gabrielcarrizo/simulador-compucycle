const ZONAS = [
  { color: 'bg-scada-green', rango: '0 – 1000 kg', grado: 'Grado 0-1', desc: 'Operación Estable' },
  { color: 'bg-scada-yellow', rango: '1001 – 1500 kg', grado: 'Grado 2', desc: 'Alerta Intermedia' },
  { color: 'bg-scada-orange', rango: '1501 – 2000 kg', grado: 'Grado 3', desc: 'Saturación Alta' },
  { color: 'bg-scada-red', rango: '> 2000 kg', grado: 'Grado 4', desc: 'Estado Crítico' },
];

const COLOR_ACTIVO = {
  verde: 'ring-scada-green',
  amarillo: 'ring-scada-yellow',
  naranja: 'ring-scada-orange',
  rojo: 'ring-scada-red',
};

const TEXTO_GRADO = {
  verde: 'text-scada-green',
  amarillo: 'text-scada-yellow',
  naranja: 'text-scada-orange',
  rojo: 'text-scada-red',
};

function SemaphorePanel({ frame }) {
  const wip = frame?.wipKg ?? 0;
  const sem = frame?.semaforo ?? { id: 'verde', grado: '0-1', etiqueta: 'Operación Estable' };
  const activo = sem.id || 'verde';

  return (
    <section className="scada-card p-4 h-full flex flex-col">
      <h2 className="scada-section-title">3. Semáforo de Saturación (WIP)</h2>

      <ul className="space-y-3 flex-1">
        {ZONAS.map((z, i) => {
          const ids = ['verde', 'amarillo', 'naranja', 'rojo'];
          const isActive = ids[i] === activo;
          return (
            <li
              key={z.grado}
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                isActive ? `ring-2 ${COLOR_ACTIVO[activo]} bg-slate-50` : ''
              }`}
            >
              <span className={`w-5 h-5 rounded-full shrink-0 ${z.color}`} />
              <div className="text-xs">
                <p className="font-semibold text-slate-700">{z.rango}</p>
                <p className="text-slate-500">
                  {z.grado} — {z.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 pt-3 border-t border-scada-border">
        <p className="text-sm">
          <span className="text-slate-500">WIP ACTUAL:</span>{' '}
          <strong className="text-scada-blue text-lg">{Math.round(wip)} kg</strong>
        </p>
        <p className="text-sm mt-1">
          <span className="text-slate-500">GRADO ACTUAL:</span>{' '}
          <strong className={`${TEXTO_GRADO[activo] || 'text-slate-800'}`}>
            {typeof sem.grado === 'number' ? sem.grado : sem.grado} ({sem.etiqueta})
          </strong>
        </p>
      </div>
    </section>
  );
}

export default SemaphorePanel;
