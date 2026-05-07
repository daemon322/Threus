import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategorias } from "../services/categoriasService";
import { FaFire } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarCategorias();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="mb-10 text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Botón "Ver Todos" */}
        <Link
          to="/productos"
          className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer"
        >
          <motion.div className="text-3xl mb-2" whileHover={{ y: -5 }}>
            <FaFire className="text-orange-500" />
          </motion.div>
          <h3 className="font-medium text-gray-800 text-center text-sm">
            Ver Todos
          </h3>
        </Link>

        {/* Categorías dinámicas */}
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categoria/${category.id}`}
            state={{ categoryName: category.nombre }}
          >
            <motion.div
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer h-full"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-medium text-gray-800 text-center text-sm line-clamp-2">
                {category.nombre}
              </h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Categories;
