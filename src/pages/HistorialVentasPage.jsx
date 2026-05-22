import { useState, useEffect } from "react";
import { getVentas, getDetallesVenta } from "../services/ventasService";
import {
  ShoppingBag,
  Eye,
  X,
  ChevronRight,
  Calendar,
  User,
  CreditCard,
  Hash,
  Package,
  Loader2,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

const HistorialVentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detalle de venta
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const data = await getVentas(100); // hasta 100 registros
      setVentas(data);
    } catch (err) {
      setError("No se pudieron cargar las ventas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const abrirDetalle = async (venta) => {
    setVentaSeleccionada(venta);
    setModalAbierto(true);
    setLoadingDetalle(true);
    try {
      const detalles = await getDetallesVenta(venta.id);
      setDetalleVenta(detalles);
    } catch (err) {
      console.error(err);
      setDetalleVenta([]);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarDetalle = () => {
    setModalAbierto(false);
    setVentaSeleccionada(null);
    setDetalleVenta(null);
  };

  // Estados
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 min-h-[70vh] text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={cargarVentas}
          className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
        >
          Reintentar
        </button>
      </main>
    );
  }

  if (ventas.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 min-h-[70vh] text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">No hay ventas registradas</h2>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-emerald-600" />
          Historial de Ventas
        </h1>
        <span className="text-sm text-gray-500">{ventas.length} ventas</span>
      </div>

      {/* Tabla responsive */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Folio</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Vendedor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Forma de pago</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ventas.map((venta) => (
                <tr key={venta.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                    #{venta.folio}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(venta.fecha).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {venta.clientes
                      ? `${venta.clientes.nombres || ""} ${venta.clientes.apellidos || ""}`
                      : "Consumidor final"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {venta.usuarios?.nombre_completo || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {venta.formas_pago?.nombre || "—"}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600 whitespace-nowrap">
                    S/ {Number(venta.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        venta.estado === "completada"
                          ? "bg-emerald-100 text-emerald-700"
                          : venta.estado === "anulada"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {venta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => abrirDetalle(venta)}
                      className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      aria-label="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalle */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Encabezado */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Venta #{ventaSeleccionada?.folio}
                </h3>
                <p className="text-sm text-gray-500">
                  {ventaSeleccionada &&
                    new Date(ventaSeleccionada.fecha).toLocaleString("es-PE")}
                </p>
              </div>
              <button
                onClick={cerrarDetalle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detalles */}
            <div className="px-6 py-4 space-y-4">
              {loadingDetalle ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
              ) : detalleVenta && detalleVenta.length > 0 ? (
                <>
                  <ul className="divide-y divide-gray-100">
                    {detalleVenta.map((det) => (
                      <li key={det.id} className="flex items-center py-3 gap-4">
                        <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {det.productos?.nombre || "Producto desconocido"}
                          </p>
                          {det.productos?.codigo_barras && (
                            <p className="text-xs text-gray-400">
                              Código: {det.productos.codigo_barras}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-700">
                            {det.cantidad} × S/ {Number(det.precio_unitario).toFixed(2)}
                          </p>
                          <p className="text-sm font-bold text-emerald-600">
                            S/ {Number(det.subtotal).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="text-lg font-extrabold text-emerald-600">
                      S/ {Number(ventaSeleccionada?.total).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No se encontraron detalles para esta venta.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HistorialVentasPage;