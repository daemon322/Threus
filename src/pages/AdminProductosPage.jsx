import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import ProductFormModal from "../components/ProductFormModal";
import {
  getAllProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restaurarProducto,
} from "../services/adminProductosService";
import { getCategorias } from "../services/categoriasService";
import { invalidateProductCache } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { uploadImage, deleteImage } from "../services/storageService";

const AdminProductosPage = () => {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        getAllProductosAdmin(),
        getCategorias(),
      ]);

      setProductos(productosData);
      setCategorias(categoriasData);
      setError(null);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const cumpleCategoria =
      !filtroCategoria || p.categoria_id === filtroCategoria;
    const cumpleEstado = filtroEstado === "activos" ? p.activo : !p.activo;
    const cumpleSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo_barras.toLowerCase().includes(searchTerm.toLowerCase());

    return cumpleCategoria && cumpleEstado && cumpleSearch;
  });

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedProducto(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setShowModal(true);
  };

  // Guardar producto
  const handleSave = async (formData, imagenFile) => {
    try {
      let imagen_url = selectedProducto?.imagen_url || null;

      // ======================================================
      // SUBIR IMAGEN
      // ======================================================
      if (imagenFile) {
        // Subir nueva imagen
        const imageResult = await uploadImage(imagenFile, "productos");

        if (!imageResult.success) {
          setError(imageResult.error);
          return;
        }

        // Guardar nueva URL
        imagen_url = imageResult.url;
      }

      const dataToSave = {
        ...formData,
        imagen_url,
        imagenFile,
      };

      // ======================================================
      // ACTUALIZAR
      // ======================================================
      if (selectedProducto) {
        const result = await actualizarProducto(
          selectedProducto.id,
          dataToSave,
        );

        if (result.success) {
          setSuccess("Producto actualizado correctamente");
          setShowModal(false);

          invalidateProductCache();

          await loadData();
        } else {
          setError(result.error || "Error al actualizar");
        }
      }

      // ======================================================
      // CREAR
      // ======================================================
      else {
        const result = await crearProducto(dataToSave);

        if (result.success) {
          setSuccess("Producto creado correctamente");

          setShowModal(false);

          invalidateProductCache();

          await loadData();
        } else {
          setError(result.error || "Error al crear");
        }
      }

      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    } catch (err) {
      console.error(err);

      setError("Error inesperado");
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;

    try {
      const result = await eliminarProducto(id);
      if (result.success) {
        setSuccess("Producto eliminado");
        // ✅ Invalidar caché para que HomePage y otras páginas refresquen datos
        invalidateProductCache();
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error al eliminar");
    }
  };

  // Restaurar producto
  const handleRestore = async (id) => {
    try {
      const result = await restaurarProducto(id);
      if (result.success) {
        setSuccess("Producto restaurado");
        // ✅ Invalidar caché para que HomePage y otras páginas refresquen datos
        invalidateProductCache();
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error al restaurar");
    }
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Gestionar Productos
          </h1>
          <p className="text-gray-600 mt-1">
            Total: {productosFiltrados.length} producto(s)
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FaPlus /> Nuevo Producto
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {success}
        </motion.div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFiltroCategoria("");
                setFiltroEstado("activos");
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {productosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No hay productos que mostrar</p>
            <p className="text-sm">
              Intenta ajustar tus filtros o crea uno nuevo
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr
                    key={producto.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      !producto.activo ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={
                          producto.imagen_url ||
                          "https://via.placeholder.com/80"
                        }
                        alt={producto.nombre}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {producto.codigo_barras || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {producto.categoria}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600 text-right">
                      S/ {producto.precio_venta.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          producto.stock_actual > 10
                            ? "bg-green-100 text-green-800"
                            : producto.stock_actual > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {producto.stock_actual}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {producto.activo ? (
                        <FaCheckCircle className="text-green-500 mx-auto" />
                      ) : (
                        <FaTimesCircle className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {producto.activo ? (
                          <>
                            <button
                              onClick={() => handleEdit(producto)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(producto.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(producto.id)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Restaurar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={showModal}
        producto={selectedProducto}
        onClose={() => {
          setShowModal(false);
          setSelectedProducto(null);
        }}
        onSave={handleSave}
        categorias={categorias}
      />
    </main>
  );
};

export default AdminProductosPage;
