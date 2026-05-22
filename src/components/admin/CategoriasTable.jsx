// src/components/admin/CategoriasTable.jsx
import React from "react";
import { FiEdit3, FiTrash2, FiAlertCircle } from "react-icons/fi";

const CategoriasTable = ({ categorias, onEdit, onDelete }) => {
  if (!categorias || categorias.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FiAlertCircle className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Sin categorías</h3>
          <p className="text-gray-500 max-w-sm">
            Crea tu primera categoría utilizando el formulario de arriba.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categorias.map((categoria) => (
              <tr
                key={categoria.id}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{categoria.nombre}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
                  {categoria.descripcion || "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {categoria.imagen_url ? (
                      <img
                        src={categoria.imagen_url}
                        alt={categoria.nombre}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        N/A
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(categoria)}
                      className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 
                                 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      title="Editar"
                    >
                      <FiEdit3 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(categoria.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 
                                 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                      title="Eliminar"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriasTable;