import { useState } from 'react';
import ConfigPanel from './components/ConfigPanel.jsx';
import PlantMonitor from './components/PlantMonitor.jsx';
import SemaphorePanel from './components/SemaphorePanel.jsx';
import EventLogPanel from './components/EventLogPanel.jsx';
import ReportModal from './components/ReportModal.jsx';
import { iniciarJornada } from './api/simulacionApi.js';
import { usePlayback } from './hooks/usePlayback.js';

function App() {
  const [cargando, setCargando] = useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const { frame, tiempoMin, eventosVisibles, progresoPct } = usePlayback(
    resultado,
    reproduciendo,
  );

  const handleIniciar = async () => {
    setCargando(true);
    setReproduciendo(false);
    setResultado(null);
    setError(null);
    setMostrarModal(false);

    try {
      const res = await iniciarJornada();
      if (res.ok) {
        setResultado(res.resultado);
        setReproduciendo(true);
        setTimeout(() => {
          setReproduciendo(false);
          setMostrarModal(true);
        }, Math.max(3000, (res.resultado.logEventos?.length || 10) * 80));
      } else {
        setError(res.msg || 'Error en el servidor');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al backend (http://localhost:4000)');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-scada-border px-6 py-3 shadow-sm">
        <h1 className="text-lg font-bold text-scada-blue">CompuCycle — Simulador ITAD</h1>
        <p className="text-xs text-slate-500">Planta Houston · Gestión RAEE HDD/SSD · SCADA</p>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-scada-red text-sm px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <ConfigPanel onIniciar={handleIniciar} cargando={cargando || reproduciendo} />
          </div>
          <div className="lg:col-span-6">
            <PlantMonitor frame={frame} />
          </div>
          <div className="lg:col-span-3">
            <SemaphorePanel frame={frame} />
          </div>
        </div>

        <EventLogPanel
          tiempoMin={tiempoMin}
          progresoPct={progresoPct}
          eventos={eventosVisibles}
        />
      </main>

      {mostrarModal && resultado?.reporte && (
        <ReportModal reporte={resultado.reporte} onCerrar={() => setMostrarModal(false)} />
      )}
    </div>
  );
}

export default App;
