import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import SpecialOffers from "../components/SpecialOffers";
import { loadProducts } from "../data/products";
import useProductSearch from "../hooks/useProductSearch";
import { AnimatePresence } from "framer-motion";

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filteredProducts, isSearching } = useProductSearch(
    products,
    searchTerm,
  );

  // Cargar productos de Supabase al montar el componente
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
      <HeroSection />
      <Categories />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        </div>
      )}

      {/* Main content */}
      {!loading && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-green-700">
              {isSearching
                ? `Resultados para "${searchTerm}"`
                : "Productos Destacados"}
            </h2>
            <span className="text-gray-500 text-sm">
              {filteredProducts.length} productos
            </span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 inline-block">
                {/* ...icono de búsqueda... */}
              </div>
              <p className="mt-4 text-gray-600 text-lg">
                No encontramos productos que coincidan con {searchTerm}
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Ver todos los productos
              </button>
            </div>
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
      <SpecialOffers />
    </main>
  );
};
