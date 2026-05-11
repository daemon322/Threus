import { useState, useEffect } from "react";
import {
  getAllProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock,
} from "../services/adminProductosService";

export const useAdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      setProductosFiltrados(productos);
      return;
    }

    const filtrados = productos.filter((p) => {
      const nombre = (p.nombre || "").toLowerCase();
      const codigo = (p.codigo_barras || "").toLowerCase();
      return nombre.includes(termino) || codigo.includes(termino);
    });

    setProductosFiltrados(filtrados);
  }, [busqueda, productos]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);

      const datos = await getAllProductosAdmin();
      setProductos(datos);
      setProductosFiltrados(datos);

      localStorage.setItem("productos_cache", JSON.stringify(datos));
    } catch (err) {
      try {
        const cache = localStorage.getItem("productos_cache");
        if (cache) {
          const datos = JSON.parse(cache);
          setProductos(datos);
          setProductosFiltrados(datos);
        }
      } catch (cacheError) {
        console.error("Error leyendo cache:", cacheError);
      }

      console.error("Error cargando productos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crearNuevoProducto = async (nuevoProducto) => {
    try {
      setError(null);
      const resultado = await crearProducto(nuevoProducto);

      if (resultado.success) {
        await cargarProductos();
        return { success: true, data: resultado.producto };
      }

      setError(resultado.error);
      return { success: false, error: resultado.error };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const actualizarProductoExistente = async (id, datosActualizados) => {
    try {
      setError(null);
      const resultado = await actualizarProducto(id, datosActualizados);

      if (resultado.success) {
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? resultado.producto : p)),
        );
        setProductosFiltrados((prev) =>
          prev.map((p) => (p.id === id ? resultado.producto : p)),
        );
        return { success: true, data: resultado.producto };
      }

      setError(resultado.error);
      return { success: false, error: resultado.error };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const eliminarProductoExistente = async (id) => {
    try {
      setError(null);
      const resultado = await eliminarProducto(id);

      if (resultado.success) {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        setProductosFiltrados((prev) => prev.filter((p) => p.id !== id));
        return { success: true };
      }

      setError(resultado.error);
      return { success: false, error: resultado.error };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const actualizarStockProducto = async (id, nuevoStock) => {
    try {
      setError(null);
      const resultado = await actualizarStock(id, nuevoStock);

      if (resultado.success) {
        setProductos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, stock_actual: nuevoStock } : p,
          ),
        );
        setProductosFiltrados((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, stock_actual: nuevoStock } : p,
          ),
        );
        return { success: true };
      }

      setError(resultado.error);
      return { success: false, error: resultado.error };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    productos,
    productosFiltrados,
    loading,
    error,
    busqueda,
    setBusqueda,
    cargarProductos,
    crearNuevoProducto,
    actualizarProductoExistente,
    eliminarProductoExistente,
    actualizarStockProducto,
  };
};