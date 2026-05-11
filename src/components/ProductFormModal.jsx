import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategorias } from "../services/categoriasService";

const ProductFormModal = ({
  isOpen,
  producto,
  onClose,
  onSave,
  categorias,
}) => {
  const [formData, setFormData] = useState({
    codigo_barras: "",
    nombre: "",
    descripcion: "",
    precio_compra: "",
    precio_venta: "",
    stock_actual: "",
    stock_minimo: "",
    unidad_medida: "unidad",
    categoria_id: "",
    proveedor_id: "",
    activo: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Cargar datos si está editando
  useEffect(() => {
    if (producto) {
      setFormData({
        codigo_barras: producto.codigo_barras || "",
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio_compra: producto.precio_compra || "",
        precio_venta: producto.precio_venta || "",
        stock_actual: producto.stock_actual || "",
        stock_minimo: producto.stock_minimo || "",
        unidad_medida: producto.unidad_medida || "unidad",
        categoria_id: producto.categoria_id || "",
        proveedor_id: producto.proveedor_id || "",
        activo: producto.activo !== false,
      });
      setPreview(producto.imagen_url || "");
    } else {
      // Reset form para crear nuevo
      setFormData({
        codigo_barras: "",
        nombre: "",
        descripcion: "",
        precio_compra: "",
        precio_venta: "",
        stock_actual: "",
        stock_minimo: "",
        unidad_medida: "unidad",
        categoria_id: "",
        proveedor_id: "",
        activo: true,
      });
      setPreview("");
      setImagenFile(null);
    }
    setErrors({});
  }, [producto, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Limpiar error para este campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImagenFile(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.precio_compra || parseFloat(formData.precio_compra) <= 0) {
      newErrors.precio_compra = "El precio de compra debe ser mayor a 0";
    }
    if (!formData.precio_venta || parseFloat(formData.precio_venta) <= 0) {
      newErrors.precio_venta = "El precio de venta debe ser mayor a 0";
    }
    if (!formData.categoria_id) {
      newErrors.categoria_id = "Selecciona una categoría";
    }
    if (formData.stock_actual === "" || parseInt(formData.stock_actual) < 0) {
      newErrors.stock_actual = "El stock no puede ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    await onSave(formData, imagenFile);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-white">
                {producto ? "Editar Producto" : "Crear Nuevo Producto"}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Leche fresca"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              {/* Código de barras */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Barras
                </label>
                <input
                  type="text"
                  name="codigo_barras"
                  value={formData.codigo_barras}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ej: 789123456"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Descripción del producto"
                />
              </div>

              {/* Precios y Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Compra (S/) *
                  </label>
                  <input
                    type="number"
                    name="precio_compra"
                    value={formData.precio_compra}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                      errors.precio_compra
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.precio_compra && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.precio_compra}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Venta (S/) *
                  </label>
                  <input
                    type="number"
                    name="precio_venta"
                    value={formData.precio_venta}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                      errors.precio_venta ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.precio_venta && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.precio_venta}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Actual *
                  </label>
                  <input
                    type="number"
                    name="stock_actual"
                    value={formData.stock_actual}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                      errors.stock_actual ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                  {errors.stock_actual && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.stock_actual}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock Mínimo y Unidad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={formData.stock_minimo}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    name="unidad_medida"
                    value={formData.unidad_medida}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="unidad">Unidad</option>
                    <option value="pqt">Paquete</option>
                    <option value="cj">Caja</option>
                    <option value="doc">Docena</option>
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="l">Litro (L)</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="g">Gramo (g)</option>
                    <option value="m">Metro (m)</option>
                    <option value="m2">Metro cuadrado (m²)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                      errors.categoria_id ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecciona categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.categoria_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.categoria_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del producto
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-40 h-40 object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* Estado */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Producto activo
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;
