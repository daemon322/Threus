// src/hooks/useCategorias.js

import { useEffect, useState } from "react";

import {
  getAllCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/adminCategoriasService";

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================================================
  // CARGAR
  // ==========================================================================
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCategorias();

      setCategorias(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // CREAR
  // ==========================================================================
  const agregarCategoria = async (categoria) => {
    const result = await crearCategoria(categoria);

    if (result.success) {
      setCategorias((prev) => [
        ...prev,
        result.categoria,
      ]);
    }

    return result;
  };

  // ==========================================================================
  // ACTUALIZAR
  // ==========================================================================
  const editarCategoria = async (
    id,
    categoria,
  ) => {
    const result = await actualizarCategoria(
      id,
      categoria,
    );

    if (result.success) {
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === id
            ? result.categoria
            : cat,
        ),
      );
    }

    return result;
  };

  // ==========================================================================
  // ELIMINAR
  // ==========================================================================
  const borrarCategoria = async (id) => {
    const result = await eliminarCategoria(id);

    if (result.success) {
      setCategorias((prev) =>
        prev.filter((cat) => cat.id !== id),
      );
    }

    return result;
  };

  // ==========================================================================
  // INIT
  // ==========================================================================
  useEffect(() => {
    cargarCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,

    cargarCategorias,
    agregarCategoria,
    editarCategoria,
    borrarCategoria,
  };
};