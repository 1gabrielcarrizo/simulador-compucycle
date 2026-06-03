import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function WipDonutChart({ porcentaje, lotesActuales, capacidadLotes }) {
  const pct = Math.min(100, Math.max(0, porcentaje));
  const data = [
    { name: 'ocupado', value: pct },
    { name: 'libre', value: 100 - pct },
  ];

  return (
    <div className="relative h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={78}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="#10b981" />
            <Cell fill="#334155" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">{Math.round(pct)}%</span>
      </div>
      <div className="text-center mt-1">
        <p className="text-lg font-semibold text-white">
          {lotesActuales} / {capacidadLotes}{' '}
          <span className="text-slate-500 text-sm font-normal">Lotes</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">Depósito Temporal</p>
      </div>
    </div>
  );
}

export default WipDonutChart;
