// src/components/admin/CategoriasTable.jsx

import React from "react";

const CategoriasTable = ({
  categorias,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-3">
              ID
            </th>

            <th className="text-left px-4 py-3">
              Nombre
            </th>

            <th className="text-left px-4 py-3">
              Descripción
            </th>

            <th className="text-center px-4 py-3">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {categorias.map((categoria) => (
            <tr
              key={categoria.id}
              className="border-t"
            >
              <td className="px-4 py-3">
                {categoria.id}
              </td>

              <td className="px-4 py-3 font-medium">
                {categoria.nombre}
              </td>

              <td className="px-4 py-3">
                {categoria.descripcion}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() =>
                      onEdit(categoria)
                    }
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-lg text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      onDelete(categoria.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriasTable;