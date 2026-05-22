// src/components/admin/Toast.jsx
import React, { useEffect, useState, useCallback, createContext, useContext } from "react";
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiX } from "react-icons/fi";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const iconMap = {
  success: <FiCheckCircle className="text-green-500" size={20} />,
  error: <FiXCircle className="text-red-500" size={20} />,
  warning: <FiAlertCircle className="text-yellow-500" size={20} />,
};

const bgMap = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
};

const ToastItem = ({ toast, onRemove }) => {
  const { id, message, type, duration } = toast;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg 
        animate-slide-in-right ${bgMap[type]} backdrop-blur-sm max-w-xs w-full`}
    >
      {iconMap[type]}
      <p className="text-sm text-gray-800 flex-1">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};