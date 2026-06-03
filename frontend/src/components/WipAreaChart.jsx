import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

function WipAreaChart({ serieWip = [], limiteLotes = 40 }) {
  const chartData = serieWip.map((p) => ({
    tiempo: p.tiempoMin,
    lotes: Math.round((p.wipKg / 40) * 10) / 10,
  }));

  const sampled =
    chartData.length > 120
      ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 120) === 0)
      : chartData;

  if (!sampled.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
        Ejecute una simulación para ver la evolución del WIP
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampled} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="wipGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="tiempo"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{
              value: 'Tiempo (minutos)',
              position: 'insideBottom',
              offset: -2,
              fill: '#94a3b8',
              fontSize: 11,
            }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            domain={[0, 'auto']}
            label={{
              value: 'Cantidad de Lotes',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8',
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#e2e8f0',
            }}
            formatter={(v) => [`${v} lotes`, 'WIP']}
            labelFormatter={(l) => `t = ${l} min`}
          />
          <ReferenceLine
            y={limiteLotes}
            stroke="#ef4444"
            strokeDasharray="6 4"
            label={{ value: 'Límite', fill: '#ef4444', fontSize: 11, position: 'right' }}
          />
          <Area
            type="monotone"
            dataKey="lotes"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#wipGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WipAreaChart;
