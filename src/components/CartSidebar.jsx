import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  FaTrash,
  FaTimes,
  FaPlus,
  FaMinus,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const sidebarVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

const CartSidebar = ({ open, onClose }) => {
  const { cart, removeFromCart, clearCart, addToCart, decreaseFromCart } =
    useCart();

  // Calcula el total
  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center gap-2">
                <FaShoppingCart className="text-green-600 text-xl" />
                <h2 className="text-lg font-bold text-green-700">Carrito</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Cerrar carrito"
              >
                <FaTimes size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-10">
                  <FaShoppingCart className="text-5xl mb-4" />
                  <span className="text-base">El carrito está vacío.</span>
                </div>
              ) : (
                <ul className="space-y-5">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 shadow-sm"
                    >
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="h-14 w-14 object-contain rounded border border-green-100 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">
                          {item.nombre}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.categoria}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-700 font-bold text-sm">
                            S/ {item.precio.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400">
                            x {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <button
                          className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-1 transition-colors"
                          onClick={() => addToCart(item)}
                          aria-label="Aumentar cantidad"
                        >
                          <FaPlus size={14} />
                        </button>
                        <span className="font-semibold text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-1 transition-colors"
                          onClick={() => decreaseFromCart(item.id)}
                          aria-label="Disminuir cantidad"
                        >
                          <FaMinus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                        title="Eliminar"
                        aria-label="Eliminar producto"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t p-4 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex justify-between font-semibold mb-3 text-base">
                <span>Total:</span>
                <span className="text-green-700">S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                  disabled={cart.length === 0}
                >
                  Vaciar
                </button>
                <Link
                  to="/carrito"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                  onClick={onClose}
                >
                  Ir al carrito
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
