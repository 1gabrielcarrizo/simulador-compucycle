import { Card, Row, Col } from 'react-bootstrap';
import GraficoWip from './GraficoWip.jsx';
import GraficoFlujo from './GraficoFlujo.jsx';

function Resultados({ datos, capacidadWip }) {
  if (!datos) {
    return <p className="text-center mt-4">No hay resultados aún</p>;
  }

  const t = datos.totales;

  const cards = [
    { titulo: 'Costos operativos', valor: `$${t.costosOperativosUsd.toLocaleString()} USD` },
    { titulo: 'Scrap recuperado', valor: `${t.scrapRecuperadoKg.toLocaleString()} kg` },
    { titulo: 'Tasa de rechazo', valor: `${t.tasaRechazoPct}%` },
    { titulo: 'Lotes procesados', valor: `${t.lotesTotales}` },
    { titulo: 'WIP máximo', valor: `${t.wipMaximoGlobal} kg (Grado ${t.gradoMaximoGlobal})` },
    { titulo: 'Kg procesados', valor: `${t.kgProcesados.toLocaleString()} kg` },
  ];

  const kgFlujo = {
    kgDestruccion: datos.porDia?.reduce((s, d) => s + (d.kgDestruccion || 0), 0) ?? 0,
    kgRefurbish: datos.porDia?.reduce((s, d) => s + (d.kgRefurbish || 0), 0) ?? 0,
    kgReproceso: datos.porDia?.reduce((s, d) => s + (d.kgReproceso || 0), 0) ?? 0,
  };

  return (
    <div>
      <h2 className="my-4 text-success">Resultados de Simulación</h2>
      <p className="text-muted small">
        Imán: <strong>{datos.iman?.nombre}</strong> · Estabilidad estimada:{' '}
        <strong>{datos.estabilidadImanDias} días</strong>
      </p>

      <Row xs={1} md={2} lg={3} className="g-4">
        {cards.map((c, i) => (
          <Col key={i}>
            <Card className="shadow-sm h-100 text-center">
              <Card.Header className="fw-bold text-white bg-success">{c.titulo}</Card.Header>
              <Card.Body>
                <Card.Text className="fw-bold fs-5 text-success">{c.valor}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="mt-5">Evolución del WIP</h3>
      <Card className="p-3 mb-4">
        <GraficoWip serieWip={datos.serieWip} capacidadWip={capacidadWip} />
      </Card>

      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3 h-100">
            <GraficoFlujo totales={kgFlujo} />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="fw-bold bg-success text-white">Decisión IF-THEN</Card.Header>
            <Card.Body>
              <p
                className={
                  t.requiereUpgradeIman ? 'text-warning fw-semibold' : 'text-success'
                }
              >
                {t.decisionFinal}
              </p>
              {datos.porDia?.map((d) => (
                <div key={d.dia} className="small border-top pt-2 mt-2">
                  <strong>Día {d.dia}:</strong> WIP prom. {d.wipPromedio} kg · {d.decisionInversion}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Resultados;
