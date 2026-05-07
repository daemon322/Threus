import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { getProductosByCategoria } from "../services/productosService";
import { getCategoriaById } from "../services/categoriasService";
import useProductSearch from "../hooks/useProductSearch";

const ProductosPorCategoriaPage = () => {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [categoria, setCategoria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { filteredProducts, isSearching } = useProductSearch(
    productos,
    searchTerm,
  );

  // Cargar categoría y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos de la categoría
        const categoryData = await getCategoriaById(categoriaId);
        if (!categoryData) {
          setError("Categoría no encontrada");
          setLoading(false);
          return;
        }

        setCategoria(categoryData);

        // Obtener productos de la categoría
        const productosData = await getProductosByCategoria(categoriaId);
        setProductos(productosData);

        if (productosData.length === 0) {
          setError(`No hay productos en la categoría "${categoryData.nombre}"`);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar la categoría y sus productos");
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) {
      fetchData();
    }
  }, [categoriaId]);

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

        {/* Category Title */}
        {categoria && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {categoria.nombre}
            </h1>
            {categoria.descripcion && (
              <p className="text-gray-600 mt-2">{categoria.descripcion}</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate("/productos")}
            className="mt-3 text-red-600 hover:text-red-700 underline text-sm"
          >
            Ver todos los productos
          </button>
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
      {!loading && error === null && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-green-700">
              {isSearching
                ? `Resultados para "${searchTerm}"`
                : `Productos en ${categoria?.nombre}`}
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
                Limpiar búsqueda
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

export default ProductosPorCategoriaPage;
