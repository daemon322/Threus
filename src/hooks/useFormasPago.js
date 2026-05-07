import { useState, useEffect } from "react";
import { getFormasPago } from "../services/ventasService";

/**
 * Hook para obtener formas de pago disponibles
 */
export const useFormasPago = () => {
  const [formasPago, setFormasPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarFormasPago = async () => {
      try {
        const data = await getFormasPago();
        setFormasPago(data);
      } catch (err) {
        setError(`Error al cargar formas de pago: ${err.message}`);
        console.error("Error en useFormasPago:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarFormasPago();
  }, []);

  return { formasPago, loading, error };
};

export default useFormasPago;
