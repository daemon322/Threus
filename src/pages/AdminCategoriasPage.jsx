// src/pages/AdminCategoriasPage.jsx
import React, { useState } from "react";
import { useCategorias } from "../hooks/useCategorias";
import { uploadImage } from "../services/storageService";
import CategoriaForm from "../components/admin/CategoriaForm";
import CategoriasTable from "../components/admin/CategoriasTable";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import { ToastProvider, useToast } from "../components/admin/Toast";

const AdminCategoriasPageContent = () => {
  const {
    categorias,
    loading,
    error: fetchError,
    agregarCategoria,
    editarCategoria,
    borrarCategoria,
  } = useCategorias();

  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // categoría a eliminar
  const [isDeleting, setIsDeleting] = useState(false);
  const addToast = useToast();

  // Guardar / actualizar
  const handleSave = async (categoria) => {
    let imagen_url = null;

    if (categoria.imagen) {
      const upload = await uploadImage(categoria.imagen, "categorias");
      if (!upload.success) {
        addToast(upload.error, "error");
        return;
      }
      imagen_url = upload.url;
    }

    const categoriaData = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      imagen_url,
    };

    let result;
    if (categoriaEditar) {
      result = await editarCategoria(categoriaEditar.id, categoriaData);
      if (result.success) {
        addToast("Categoría actualizada correctamente", "success");
        setCategoriaEditar(null);
      } else {
        addToast(result.error, "error");
      }
    } else {
      result = await agregarCategoria(categoriaData);
      if (result.success) {
        addToast("Categoría creada exitosamente", "success");
      } else {
        addToast(result.error, "error");
      }
    }
  };

  const handleEdit = (categoria) => {
    setCategoriaEditar(categoria);
    document.getElementById("categoria-form")?.scrollIntoView({ behavior: "smooth" });
  };

  // Abre el modal de confirmación
  const handleRequestDelete = (id) => {
    setDeleteTarget(id);
  };

  // Ejecuta eliminación tras confirmar
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const result = await borrarCategoria(deleteTarget);
    setIsDeleting(false);

    if (result.success) {
      addToast("Categoría eliminada", "success");
      setDeleteTarget(null);
    } else {
      addToast(result.error, "error");
      setDeleteTarget(null); // cerramos el modal igual
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded-lg" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="h-80 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          <p className="font-semibold text-lg">Error al cargar categorías</p>
          <p className="text-sm mt-1">{fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-500 mt-1">
            Gestiona las categorías de productos de tu tienda
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {categorias.length} categoría{categorias.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Formulario */}
      <div id="categoria-form">
        <CategoriaForm
          categoriaEditar={categoriaEditar}
          onSave={handleSave}
          onCancel={() => setCategoriaEditar(null)}
        />
      </div>

      {/* Tabla */}
      <CategoriasTable
        categorias={categorias}
        onEdit={handleEdit}
        onDelete={handleRequestDelete} // ahora solo abre modal
      />

      {/* Modal de confirmación */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Eliminar categoría"
        message="¿Estás seguro de que deseas eliminar esta categoría permanentemente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

const AdminCategoriasPage = () => (
  <ToastProvider>
    <AdminCategoriasPageContent />
  </ToastProvider>
);

export default AdminCategoriasPage;