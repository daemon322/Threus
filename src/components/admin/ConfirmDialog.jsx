// src/components/admin/ConfirmDialog.jsx
import React, { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmDialog = ({ isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, isLoading = false }) => {
  const cancelRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  // Foco en botón cancelar al abrir
  useEffect(() => {
    if (isOpen && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={isLoading ? undefined : onCancel}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 opacity-100 animate-dialog-in"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="text-red-500" size={20} />
          </div>
          <div className="flex-1">
            <h3 id="confirm-title" className="text-lg font-semibold text-gray-900">
              {title || "Confirmar acción"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {message || "¿Estás seguro de que deseas continuar?"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                       rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 
                       transition-colors disabled:opacity-50"
          >
            {cancelLabel || "Cancelar"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl flex items-center gap-2 
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 
                        ${
                          isLoading
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
                        }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Eliminando...
              </>
            ) : (
              confirmLabel || "Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;