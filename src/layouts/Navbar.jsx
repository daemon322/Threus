import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => handleNavigation("/")}
          >
            <span className="text-2xl font-bold text-blue-600">🏪</span>
            <span className="text-xl font-bold text-gray-900">Threus</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavigation("/")}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavigation("/productos")}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Productos
            </button>
            <button
              onClick={() => handleNavigation("/ofertas")}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Ofertas
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigation("/carrito")}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition text-2xl"
            >
              🛒
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            {isAuthenticated && usuario ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                    {usuario.nombre_completo || usuario.nombre_usuario}
                  </span>
                  <span className="text-xs text-gray-700">
                    {isUserMenuOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl py-2 w-56 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {usuario.nombre_completo || usuario.nombre_usuario}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {usuario.email}
                      </p>
                      <p className="text-xs font-medium text-blue-600 mt-2">
                        Rol: {usuario.rol}
                      </p>
                    </div>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleNavigation("/admin/productos")}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition text-sm font-medium"
                        >
                          ⚙️ Panel Admin P
                        </button>
                        <button
                          onClick={() => handleNavigation("/admin/categorias")}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition text-sm font-medium"
                        >
                          ⚙️ Panel Admin C
                        </button>
                        <div className="border-b border-gray-100" />
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm font-medium"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
              >
                🔓 Iniciar Sesión
              </button>
            )}

            <button
              className="md:hidden px-3 py-2 rounded-lg border border-gray-200 text-gray-700"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              ☰
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2 md:hidden">
            <button
              onClick={() => handleNavigation("/")}
              className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavigation("/productos")}
              className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Productos
            </button>
            <button
              onClick={() => handleNavigation("/ofertas")}
              className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Ofertas
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
