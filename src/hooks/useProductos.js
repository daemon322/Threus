import { useState, useEffect } from "react";
import { loadProducts, invalidateProductCache } from "../data/products";

/**
 * Hook personalizado para cargar productos desde Supabase
 * @returns {Object} { productos, loading, error, recargar }
 */
export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recargar = async () => {
    setLoading(true);
    setError(null);
    invalidateProductCache();

    try {
      const data = await loadProducts();
      if (data.length === 0) {
        setError(
          "No hay productos disponibles. Verifica tu conexión a Supabase.",
        );
      } else {
        setProductos(data);
      }
    } catch (err) {
      setError(`Error al cargar productos: ${err.message}`);
      console.error("Error en useProductos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recargar();
  }, []);

  return { productos, loading, error, recargar };
};

export default useProductos;
