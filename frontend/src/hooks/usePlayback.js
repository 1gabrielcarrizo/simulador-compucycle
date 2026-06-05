import { useState, useEffect, useRef } from 'react';

const JORNADA_MIN = 480;

/**
 * Reproduce el log de eventos del backend para animar el monitor SCADA.
 */
export function usePlayback(resultado, activo) {
  const [frame, setFrame] = useState(null);
  const [tiempoMin, setTiempoMin] = useState(0);
  const [eventosVisibles, setEventosVisibles] = useState([]);
  const idxRef = useRef(0);

  useEffect(() => {
    if (!activo || !resultado?.logEventos?.length) {
      if (resultado?.estadoFinal && !activo) {
        setFrame(resultado.estadoFinal);
        setTiempoMin(JORNADA_MIN);
        setEventosVisibles(resultado.logEventos?.slice(-5) || []);
      }
      return undefined;
    }

    idxRef.current = 0;
    setFrame(resultado.logEventos[0]?.snapshot || null);
    setTiempoMin(0);
    setEventosVisibles([]);

    const total = resultado.logEventos.length;
    const msPerEvent = Math.max(40, Math.min(120, 8000 / total));

    const timer = setInterval(() => {
      const i = idxRef.current;
      if (i >= total) {
        clearInterval(timer);
        setFrame(resultado.estadoFinal);
        setTiempoMin(JORNADA_MIN);
        setEventosVisibles(resultado.logEventos.slice(-5));
        return;
      }
      const ev = resultado.logEventos[i];
      setFrame(ev.snapshot);
      setTiempoMin(ev.tiempoMin);
      setEventosVisibles((prev) => [...prev.slice(-4), ev]);
      idxRef.current += 1;
    }, msPerEvent);

    return () => clearInterval(timer);
  }, [resultado, activo]);

  const progresoPct = Math.min(100, Math.round((tiempoMin / JORNADA_MIN) * 100));

  return { frame, tiempoMin, eventosVisibles, progresoPct };
}

export function formatoTiempoLargo(minutos) {
  const h = Math.floor(minutos / 60);
  const m = Math.floor(minutos % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}
