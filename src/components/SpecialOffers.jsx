import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaFire, FaLeaf } from "react-icons/fa";

const SpecialOffers = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-2 rounded-lg">
          <FaFire className="text-red-500 text-xl" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Ofertas Especiales
        </h2>
      </div>
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-white rounded-xl shadow-lg p-4 w-64">
              <img
                src="https://via.placeholder.com/300x200?text=Pack+Desayuno"
                alt="Oferta especial"
                className="w-full h-48 object-contain"
              />
              <div className="mt-4">
                <h3 className="font-semibold">Pack de Desayuno</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-red-600 font-bold">S/ 12.99</span>
                  <span className="text-gray-400 text-sm line-through">
                    S/ 18.99
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Desayuno Completo Familiar
            </h3>
            <p className="text-gray-600 mb-6">
              Aprovecha nuestro pack especial de desayuno familiar. Incluye
              leche, pan, huevos, mermelada y café. Todo lo necesario para un
              desayuno completo y nutritivo.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/ofertas")}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-medium"
              >
                Comprar ahora
              </button>
              <button
                onClick={() => navigate("/ofertas")}
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-5 py-3 rounded-lg font-medium"
              >
                Ver detalles
              </button>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <FaLeaf />
                </div>
                <p>
                  <span className="font-medium">Entrega gratuita</span> en
                  pedidos mayores a S/ 50
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialOffers;
