import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { loadProducts } from "../data/products";
import useProductSearch from "../hooks/useProductSearch";
import { AnimatePresence, motion } from "framer-motion";

const OfertasPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filteredProducts, isSearching } = useProductSearch(
    products,
    searchTerm,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productosData = await loadProducts();
        setProducts(productosData);
        if (productosData.length === 0) {
          setError(
            "No hay productos disponibles. Por favor, verifica tu conexión a Supabase.",
          );
        }
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError(
          "Error al cargar productos. Verifica tu configuración de Supabase.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 min-h-[80vh] overflow-x-hidden">
      {/* Botón Volver */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-6 text-green-600 hover:text-green-700 font-medium transition-colors"
      >
        <span>←</span> Volver al inicio
      </button>

      {/* Encabezado */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🔥 Ofertas Especiales
        </h1>
        <p className="text-gray-600 text-lg">
          Descubre nuestras mejores ofertas y promociones exclusivas
        </p>
      </motion.div>

      {/* Búsqueda */}
      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Productos */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isSearching
                ? `Resultados de búsqueda (${filteredProducts.length})`
                : `Todos los productos (${products.length})`}
            </h2>
          </div>

          {filteredProducts.length === 0 && isSearching ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              layout
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      )}
    </main>
  );
};

export default OfertasPage;
