import { useState, useEffect } from "react";
import { loadProducts, invalidateProductCache } from "../data/products";

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = async ({ forceRefresh = false } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loadProducts({ forceRefresh });
      setProductos(data);

      if (data.length === 0) {
        setError("No hay productos disponibles.");
      }
    } catch (err) {
      setError(`Error al cargar productos: ${err.message}`);
      console.error("Error en useProductos:", err);
    } finally {
      setLoading(false);
    }
  };

  const recargar = async () => {
    invalidateProductCache();
    await cargarProductos({ forceRefresh: true });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return { productos, loading, error, recargar };
};

export default useProductos;