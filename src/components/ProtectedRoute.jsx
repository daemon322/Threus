import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  // SOLO AQUÍ mostramos loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // NO LOGIN
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // NO ADMIN
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
