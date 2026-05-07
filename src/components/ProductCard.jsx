import { useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaLeaf, FaEgg, FaStar, FaFire } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";

const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleAdd = () => {
    addToCart(producto);
    setShowSidebar(true);
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {producto.categoria === "Ofertas" && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <FaFire className="mr-1" /> OFERTA
            </div>
          )}
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-48 object-contain p-4 bg-gray-50"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-yellow-700 text-xs">
              <FaStar className="mr-1" /> 4.8
            </div>
          </div>
          <p className="text-green-700 font-bold text-lg mt-1">
            S/ {producto.precio.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm mt-2 h-12 overflow-hidden">
            {producto.descripcion}
          </p>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {producto.categoria}
            </span>
            <span className="text-xs text-gray-500">
              Stock: {producto.stock}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <FaShoppingCart /> Agregar
          </button>
        </div>
      </motion.div>
      <CartSidebar open={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
};

export default ProductCard;
