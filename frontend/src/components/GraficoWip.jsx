import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function GraficoWip({ serieWip = [], capacidadWip = 2000 }) {
  if (!serieWip.length) {
    return <p className="text-center text-muted py-5">Ejecute una simulación para ver el gráfico WIP</p>;
  }

  const sampled =
    serieWip.length > 250
      ? serieWip.filter((_, i) => i % Math.ceil(serieWip.length / 250) === 0)
      : serieWip;

  const data = {
    labels: sampled.map((p) => `${p.tiempoMin} min`),
    datasets: [
      {
        label: 'WIP (kg)',
        data: sampled.map((p) => p.wipKg),
        borderColor: '#3f7841',
        backgroundColor: 'rgba(63, 120, 65, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Evolución del inventario en proceso (WIP)' },
      tooltip: {
        callbacks: {
          afterLabel: (ctx) => {
            const idx = ctx.dataIndex;
            const grado = sampled[idx]?.grado;
            return grado != null ? `Grado saturación: ${grado}` : '';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Kilogramos' },
      },
      x: {
        ticks: { maxTicksLimit: 12 },
      },
    },
    animation: { duration: 1200, easing: 'easeOutQuart' },
  };

  return (
    <div>
      <p className="small text-muted mb-2">
        Límite Grado 3: {capacidadWip} kg · Grado 4: &gt; 2000 kg
      </p>
      <Line data={data} options={options} />
    </div>
  );
}

export default GraficoWip;
