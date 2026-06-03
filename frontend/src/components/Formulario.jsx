import { useState } from 'react';
import Swal from 'sweetalert2';
import Card from 'react-bootstrap/Card';
import '../styles/form.css';

const IMANES = [
  { value: 'estandar', label: 'Rodillo Estándar (10% retorno)' },
  { value: 'n35', label: 'Neodimio N35 (6% retorno)' },
  { value: 'n52', label: 'Neodimio N52 (4% retorno)' },
  { value: 'max', label: 'Separador Max (2% retorno)' },
];

function Formulario({ onSimular, deshabilitado }) {
  const [tasaLlegadaMin, setTasaLlegadaMin] = useState('15');
  const [capacidadWipKg, setCapacidadWipKg] = useState('2000');
  const [tipoIman, setTipoIman] = useState('estandar');
  const [diasSimulacion, setDiasSimulacion] = useState(1);

  const validar = () => {
    const tasa = Number(tasaLlegadaMin);
    const cap = Number(capacidadWipKg);

    if (tasaLlegadaMin === '' || capacidadWipKg === '') {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Completa todos los campos' });
      return null;
    }
    if (isNaN(tasa) || isNaN(cap) || isNaN(diasSimulacion)) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Ingresa valores numéricos válidos' });
      return null;
    }
    if (tasa < 5 || tasa > 60) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Tasa de llegada: entre 5 y 60 minutos' });
      return null;
    }
    if (cap < 500 || cap > 5000) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Capacidad WIP: entre 500 y 5000 kg' });
      return null;
    }
    if (diasSimulacion < 1 || diasSimulacion > 30) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Jornadas: entre 1 y 30 días' });
      return null;
    }
    return {
      tasaLlegadaMin: tasa,
      capacidadWipKg: cap,
      tipoIman,
      diasSimulacion: Number(diasSimulacion),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = validar();
    if (params) onSimular(params);
  };

  return (
    <Card>
      <Card.Header className="bg-success text-white">Parámetros de la planta</Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Card>
                <Card.Header className="card-header card-header-sub">
                  Tasa de llegada (min, exponencial)
                </Card.Header>
                <Card.Body className="d-flex justify-content-center">
                  <input
                    type="number"
                    className="form-control param-input"
                    value={tasaLlegadaMin}
                    min="5"
                    max="60"
                    disabled={deshabilitado}
                    onChange={(e) => setTasaLlegadaMin(e.target.value)}
                  />
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6 mb-3">
              <Card>
                <Card.Header className="card-header card-header-sub">
                  Capacidad WIP tolerada (kg)
                </Card.Header>
                <Card.Body className="d-flex justify-content-center">
                  <input
                    type="number"
                    className="form-control param-input"
                    value={capacidadWipKg}
                    min="500"
                    max="5000"
                    step="100"
                    disabled={deshabilitado}
                    onChange={(e) => setCapacidadWipKg(e.target.value)}
                  />
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Card>
                <Card.Header className="card-header card-header-sub">Tipo de imán</Card.Header>
                <Card.Body>
                  <select
                    className="form-select"
                    value={tipoIman}
                    disabled={deshabilitado}
                    onChange={(e) => setTipoIman(e.target.value)}
                  >
                    {IMANES.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6 mb-3">
              <Card>
                <Card.Header className="card-header card-header-sub">
                  Jornadas (8 h c/u)
                </Card.Header>
                <Card.Body className="d-flex justify-content-center">
                  <input
                    type="number"
                    className="form-control param-input"
                    value={diasSimulacion}
                    min="1"
                    max="30"
                    disabled={deshabilitado}
                    onChange={(e) => setDiasSimulacion(Number(e.target.value))}
                  />
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="text-center mt-3">
            <button type="submit" disabled={deshabilitado} className="btn button-class">
              {deshabilitado ? 'Procesando...' : 'Iniciar Simulación'}
            </button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}

export default Formulario;
