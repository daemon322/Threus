import { useState, useEffect } from "react";
import { getUsuarios } from "../services/usuariosService";

/**
 * Hook para obtener usuarios (empleados/cajeros)
 */
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError(`Error al cargar usuarios: ${err.message}`);
        console.error("Error en useUsuarios:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  return { usuarios, loading, error };
};

export default useUsuarios;
