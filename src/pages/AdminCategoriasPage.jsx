// src/pages/AdminCategoriasPage.jsx

import React, { useState } from "react";

import { useCategorias } from "../hooks/useCategorias";
import { uploadImage } from "../services/storageService";
import CategoriaForm from "../components/admin/CategoriaForm";
import CategoriasTable from "../components/admin/CategoriasTable";

const AdminCategoriasPage = () => {
  const {
    categorias,
    loading,
    error,

    agregarCategoria,
    editarCategoria,
    borrarCategoria,
  } = useCategorias();

  const [categoriaEditar, setCategoriaEditar] = useState(null);

  // ==========================================================================
  // GUARDAR
  // ==========================================================================
  const handleSave = async (categoria) => {
    let result;

    // ============================================================
    // SUBIR IMAGEN
    // ============================================================
    let imagen_url = null;

    if (categoria.imagen) {
      const upload = await uploadImage(categoria.imagen, "categorias");

      if (!upload.success) {
        alert(upload.error);
        return;
      }

      imagen_url = upload.url;
    }

    // ============================================================
    // DATA FINAL
    // ============================================================
    const categoriaData = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      imagen_url,
    };

    // ============================================================
    // EDITAR
    // ============================================================
    if (categoriaEditar) {
      result = await editarCategoria(categoriaEditar.id, categoriaData);
    } else {
      // ==========================================================
      // CREAR
      // ==========================================================
      result = await agregarCategoria(categoriaData);
    }

    // ============================================================
    // RESULTADO
    // ============================================================
    if (result.success) {
      setCategoriaEditar(null);
    } else {
      alert(result.error);
    }
  };

  // ==========================================================================
  // EDITAR
  // ==========================================================================
  const handleEdit = (categoria) => {
    setCategoriaEditar(categoria);
  };

  // ==========================================================================
  // ELIMINAR
  // ==========================================================================
  const handleDelete = async (id) => {
    const confirmDelete = confirm("¿Eliminar categoría?");

    if (!confirmDelete) return;

    const result = await borrarCategoria(id);

    if (!result.success) {
      alert(result.error);
    }
  };

  // ==========================================================================
  // LOADING
  // ==========================================================================
  if (loading) {
    return <div className="p-8">Cargando categorías...</div>;
  }

  // ==========================================================================
  // ERROR
  // ==========================================================================
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Administración de Categorías</h1>

      <CategoriaForm
        categoriaEditar={categoriaEditar}
        onSave={handleSave}
        onCancel={() => setCategoriaEditar(null)}
      />

      <CategoriasTable
        categorias={categorias}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminCategoriasPage;
