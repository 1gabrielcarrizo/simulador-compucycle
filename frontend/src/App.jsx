import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Resultados from './components/Resultados.jsx';
import { ejecutarSimulacion } from './api/simulacionApi.js';
import { DEFAULT_PARAMS, uiToApiParams } from './utils/parametros.js';

function App() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [tiempoSeg, setTiempoSeg] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (cargando) {
      const t0 = Date.now();
      timerRef.current = setInterval(() => {
        setTiempoSeg(Math.floor((Date.now() - t0) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      if (resultados) {
        setTiempoSeg(8 * 60 * 60);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [cargando, resultados]);

  const handleRun = async () => {
    setCargando(true);
    setResultados(null);
    setTiempoSeg(0);

    const apiParams = uiToApiParams(params);

    try {
      const res = await ejecutarSimulacion(apiParams);
      if (res.ok) {
        setResultados(res.resultado);
        Swal.fire({
          icon: 'success',
          title: 'Simulación completada',
          text: `${res.resultado.totales.lotesTotales} lotes procesados`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#e2e8f0',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.msg || 'Error en el servidor',
          background: '#1e293b',
          color: '#e2e8f0',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'Verifique el backend en http://localhost:4000',
        background: '#1e293b',
        color: '#e2e8f0',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface">
      <Header ejecutando={cargando} tiempoSegundos={tiempoSeg} />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0 overflow-hidden">
        <Sidebar
          params={params}
          onChange={setParams}
          onRun={handleRun}
          onReset={setParams}
          disabled={cargando}
        />

        <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto">
          {cargando && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/60 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none lg:mb-4">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-3 text-slate-400 text-sm">Ejecutando eventos discretos…</p>
              </div>
            </div>
          )}
          <Resultados datos={resultados} capacidadLotes={params.capacidadLotes} />
        </main>
      </div>
    </div>
  );
}

export default App;
