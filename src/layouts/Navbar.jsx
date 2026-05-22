import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  Store,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  LogOut,
  Settings,
  Tag,
  LogIn,
} from "lucide-react";

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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavigation("/")}
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md shadow-blue-200/50 transition-transform group-hover:scale-105">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Threus
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Inicio", path: "/" },
              { label: "Productos", path: "/productos" },
              { label: "Ofertas", path: "/ofertas", icon: Tag },
            ].map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/70 flex items-center gap-2"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
                {/* Optional active indicator - you can add active styling based on current route */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <button
              onClick={() => handleNavigation("/carrito")}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce-in">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User menu / Login */}
            {isAuthenticated && usuario ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200/50 shadow-sm"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="bg-blue-200 rounded-full p-1">
                    <User className="w-4 h-4 text-blue-700" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 hidden sm:inline max-w-[120px] truncate">
                    {usuario.nombre_completo || usuario.nombre_usuario}
                  </span>
                  {isUserMenuOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Dropdown menu with transition */}
                <div
                  className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 transform origin-top-right ${
                    isUserMenuOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-white">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {usuario.nombre_completo || usuario.nombre_usuario}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {usuario.email}
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {usuario.rol}
                    </span>
                  </div>

                  <div className="py-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleNavigation("/admin/productos")}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-blue-500" />
                          Administrar Productos
                        </button>
                        <button
                          onClick={() => handleNavigation("/admin/categorias")}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-blue-500" />
                          Administrar Categorías
                        </button>
                        <button
                          onClick={() => handleNavigation("/admin/historial")}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-blue-500" />
                          Historial de Ventas
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-300/50 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu with smooth height animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-100 mt-2">
            {[
              { label: "Inicio", path: "/" },
              { label: "Productos", path: "/productos" },
              { label: "Ofertas", path: "/ofertas", icon: Tag },
            ].map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
              >
                {Icon && <Icon className="w-5 h-5 text-blue-500" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;