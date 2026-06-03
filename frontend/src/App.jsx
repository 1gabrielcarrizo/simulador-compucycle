import { useState } from 'react';
import Swal from 'sweetalert2';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Formulario from './components/Formulario.jsx';
import Resultados from './components/Resultados.jsx';
import { ejecutarSimulacion } from './api/simulacionApi.js';
import './styles/App.css';

function App() {
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [ultimosParams, setUltimosParams] = useState({ capacidadWipKg: 2000 });

  const handleSimulacion = async (params) => {
    setCargando(true);
    setResultados(null);
    setUltimosParams(params);

    try {
      const res = await ejecutarSimulacion(params);
      if (res.ok) {
        setResultados(res.resultado);
        Swal.fire({
          icon: 'success',
          title: 'Simulación completada',
          text: `${res.resultado.totales.lotesTotales} lotes · WIP máx ${res.resultado.totales.wipMaximoGlobal} kg`,
          timer: 2500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.msg || 'Error en el servidor' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar al backend. Verifique que esté en http://localhost:4000',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container-fluid mt-4 px-3 px-md-4">
        <div className="row dashboard-row g-4">
          <div className="col-lg-4">
            <Formulario onSimular={handleSimulacion} deshabilitado={cargando} />
          </div>
          <div className="col-lg-8">
            {cargando && (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" />
                <p className="mt-2 text-muted">Ejecutando eventos discretos…</p>
              </div>
            )}
            {!cargando && (
              <Resultados
                datos={resultados}
                capacidadWip={ultimosParams.capacidadWipKg}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
