import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function GraficoFlujo({ totales }) {
  if (!totales) return null;

  const destruccion = totales.kgDestruccion ?? 0;
  const refurbish = totales.kgRefurbish ?? 0;
  const reproceso = totales.kgReproceso ?? totales.scrapRecuperadoKg * 0.1;

  const data = {
    labels: ['Destrucción', 'Refurbishing', 'Reproceso'],
    datasets: [
      {
        label: 'Kg',
        data: [destruccion, refurbish, reproceso],
        backgroundColor: ['#3498db', '#2ecc71', '#e67e22'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Destino del material (post-separadora)' },
      datalabels: {
        anchor: 'end',
        align: 'top',
        font: { weight: 'bold' },
        formatter: (v) => `${Math.round(v)} kg`,
      },
    },
    scales: { y: { beginAtZero: true } },
    animation: { duration: 1500, easing: 'easeOutBounce' },
  };

  return <Bar data={data} options={options} />;
}

export default GraficoFlujo;
