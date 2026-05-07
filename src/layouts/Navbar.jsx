import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/logo1.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-green-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={logo}
                alt="MiniMarket Logo"
                className="h-10 w-10 mr-3"
              />
              <span className="text-white font-bold text-xl">
                MiniMarket Express
              </span>
            </Link>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="text-white hover:text-yellow-300 font-medium transition-colors"
            >
              Productos
            </Link>

            {/* Carrito */}
            <Link
              to="/carrito"
              className="relative text-white hover:text-yellow-300 font-medium transition-colors flex items-center gap-2"
            >
              <FaShoppingCart />
              Carrito
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-5 bg-yellow-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divisor */}
            <div className="h-6 border-l border-green-500"></div>

            {/* Auth Buttons */}
            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
            ) : isAuthenticated && user ? (
              // Usuario autenticado - Menu dropdown
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium transition-all"
                >
                  <FaUser />
                  {user.email?.split("@")[0] || user.user_metadata?.full_name}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Conectado como:</p>
                        <p className="font-semibold text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <FaSignOutAlt /> Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Sin autenticar
              <Link
                to="/login"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <FaUser /> Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center gap-4">
            {/* Carrito móvil */}
            <Link
              to="/carrito"
              className="relative text-white hover:text-yellow-300 transition-colors"
            >
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-400 text-green-900 text-xs font-bold px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Menu hamburguesa */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 transition-colors"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-green-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link
                to="/"
                className="block text-white py-2 px-3 rounded hover:bg-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="block text-white py-2 px-3 rounded hover:bg-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Productos
              </Link>

              {/* Divisor móvil */}
              <div className="border-t border-green-600 my-2"></div>

              {/* Auth mobile */}
              {isAuthenticated && user ? (
                <>
                  <div className="text-white py-2 px-3 text-sm">
                    <p className="text-gray-300">Conectado:</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-400 py-2 px-3 rounded hover:bg-red-600/20 transition-colors flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
