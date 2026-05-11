// src/components/admin/CategoriaForm.jsx

import React, { useEffect, useState } from "react";

const CategoriaForm = ({ categoriaEditar, onSave, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    if (categoriaEditar) {
      setNombre(categoriaEditar.nombre || "");
      setDescripcion(categoriaEditar.descripcion || "");
      setImagen(null);
    }
  }, [categoriaEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    await onSave({
      nombre,
      descripcion,
      imagen,
    });

    if (!categoriaEditar) {
      setNombre("");
      setDescripcion("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">
        {categoriaEditar ? "Editar Categoría" : "Nueva Categoría"}
      </h2>

      <div>
        <label className="block mb-1 font-medium">Nombre</label>

        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Nombre categoría"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Descripción</label>

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
          rows="4"
          placeholder="Descripción"
        />
      </div>
      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagen del Producto
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />

        {imagen && (
          <img
            src={URL.createObjectURL(imagen)}
            alt="preview"
            className="mt-3 w-32 h-32 object-cover rounded-lg border"
          />
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          {categoriaEditar ? "Actualizar" : "Crear"}
        </button>

        {categoriaEditar && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoriaForm;
