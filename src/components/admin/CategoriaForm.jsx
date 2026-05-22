// src/components/admin/CategoriaForm.jsx
import React, { useEffect, useState } from "react";
import { FiCamera, FiX, FiUploadCloud } from "react-icons/fi";
import { useToast } from "./Toast"; // Opcional si ya usas toast

const CategoriaForm = ({ categoriaEditar, onSave, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const addToast = useToast(); // Si quieres mostrar errores locales también

  useEffect(() => {
    if (categoriaEditar) {
      setNombre(categoriaEditar.nombre || "");
      setDescripcion(categoriaEditar.descripcion || "");
      setImagen(null);
      setPreview(null);
    }
  }, [categoriaEditar]);

  useEffect(() => {
    if (imagen) {
      const objectUrl = URL.createObjectURL(imagen);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [imagen]);

  const handleRemoveImage = () => {
    setImagen(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      addToast?.("El nombre es obligatorio", "warning");
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        nombre,
        descripcion,
        imagen,
      });

      if (!categoriaEditar) {
        setNombre("");
        setDescripcion("");
        setImagen(null);
        setPreview(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {categoriaEditar ? "Editar Categoría" : "Nueva Categoría"}
        </h2>
        {categoriaEditar && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cancelar edición"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-5">
          <div>
            <label htmlFor="categoria-nombre" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="categoria-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         transition-all placeholder:text-gray-400 text-gray-800"
              placeholder="Ej. Tecnología, Moda..."
              required
            />
          </div>
          <div>
            <label htmlFor="categoria-descripcion" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Descripción
            </label>
            <textarea
              id="categoria-descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         transition-all placeholder:text-gray-400 text-gray-800 resize-none"
              placeholder="Describe brevemente la categoría..."
            />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Imagen de la categoría
          </label>

          {preview ? (
            <div className="relative group w-full aspect-square max-w-[200px]">
              <img
                src={preview}
                alt="Vista previa"
                className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 
                           shadow backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Eliminar imagen"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="categoria-imagen"
              className="flex flex-col items-center justify-center w-full h-48 
                         border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 
                         hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <FiUploadCloud size={28} className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-blue-600 font-medium">
                Subir imagen
              </span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG (max. 2MB)</span>
              <input
                id="categoria-imagen"
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}

          {preview && (
            <label
              htmlFor="categoria-imagen"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 
                         font-medium cursor-pointer transition-colors"
            >
              <FiCamera size={14} />
              Cambiar imagen
              <input
                id="categoria-imagen"
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        {categoriaEditar && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 bg-white 
                       hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !nombre.trim()}
          className={`px-6 py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 
                      transition-all duration-200 
                      ${
                        submitting || !nombre.trim()
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md shadow-blue-200"
                      }`}
        >
          {submitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </>
          ) : categoriaEditar ? (
            "Actualizar"
          ) : (
            "Crear categoría"
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoriaForm;