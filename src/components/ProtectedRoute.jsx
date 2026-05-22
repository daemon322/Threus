import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaSpinner,
  FaWifi,
  FaExclamationTriangle,
} from "react-icons/fa";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { loading, isAuthenticated, isAdmin, usuario } = useAuth();

  // =========================================================
  // SIN INTERNET
  // =========================================================
  if (!navigator.onLine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-red-100"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-5 rounded-full">
              <FaWifi className="text-5xl text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Sin conexión
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            No se pudo conectar con el servidor.
            Verifica tu internet e intenta nuevamente.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================
  if (loading || (isAuthenticated && adminOnly && !usuario)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-green-100"
        >
          {/* Spinner */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
              className="bg-green-100 p-5 rounded-full"
            >
              <FaSpinner className="text-5xl text-green-600" />
            </motion.div>
          </div>

          {/* Texto */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Verificando sesión
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Estamos validando tu acceso y cargando tu información...
          </p>

          {/* Barra animada */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: ["0%", "40%", "70%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />
          </div>

          {/* Mensaje lento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{
              duration: 1,
              delay: 4,
            }}
            className="mt-6 flex items-center justify-center gap-2 text-yellow-600"
          >
            <FaExclamationTriangle />
            <span className="text-sm">
              La conexión está un poco lenta...
            </span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // =========================================================
  // NO LOGIN
  // =========================================================
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // =========================================================
  // NO ADMIN
  // =========================================================
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // =========================================================
  // OK
  // =========================================================
  return children;
};

export default ProtectedRoute;