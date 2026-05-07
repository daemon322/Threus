import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaFire } from "react-icons/fa";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-2xl p-6 md:p-10 mb-12 shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-green-900 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Tu mercado de <span className="text-green-600">conveniencia</span>{" "}
            24/7
          </motion.h1>
          <motion.p
            className="text-lg text-gray-700 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Productos frescos, precios bajos y entrega rápida. Todo lo que
            necesitas en un solo lugar.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <button
              onClick={() => navigate("/productos")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              Ordenar ahora
            </button>
            <button
              onClick={() => navigate("/ofertas")}
              className="bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-5 py-3 rounded-lg font-medium transition-all"
            >
              Ver ofertas
            </button>
          </motion.div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <div className="bg-white p-3 rounded-xl shadow-lg absolute -top-4 -left-4 z-10">
              <div className="bg-green-100 rounded-lg p-3">
                <FaFire className="text-orange-500 text-xl" />
              </div>
              <p className="font-semibold mt-2">Oferta del día</p>
            </div>
            <img
              src="/assets/images/hero-basket.png"
              alt="Canasta de compras"
              className="w-full max-w-md rounded-xl shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
