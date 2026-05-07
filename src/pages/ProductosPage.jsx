import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { loadProducts } from "../data/products";
import useProductSearch from "../hooks/useProductSearch";

const ProductosPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { filteredProducts, isSearching } = useProductSearch(
    productos,
    searchTerm,
  );

  // Cargar todos los productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await loadProducts();
        setProductos(data);
        if (data.length === 0) {
          setError("No hay productos disponibles");
        }
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <FaArrowLeft /> Volver al inicio
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Todos los Productos
        </h1>
        <p className="text-gray-600 mt-2">
          Explora nuestro catálogo completo de productos
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-green-700">
              {isSearching
                ? `Resultados para "${searchTerm}"`
                : "Todos los Productos"}
            </h2>
            <span className="text-gray-500 text-sm">
              {filteredProducts.length} productos
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                <p className="text-4xl">🔍</p>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                No encontramos productos que coincidan con "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Ver todos
              </button>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductosPage;
