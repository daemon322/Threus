import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getFormasPago } from "../services/ventasService"; // 👈 importa la función
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Truck,
  CheckCircle,
  AlertTriangle,
  Banknote,
  Loader2,
} from "lucide-react";

const CheckoutPage = () => {
  const { cart, procesarVenta, creatingVenta, ventaError, ventaSuccess, setVentaError, setVentaSuccess, usuario } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });
  const [metodoPagoId, setMetodoPagoId] = useState(null); // UUID de la forma de pago
  const [observaciones, setObservaciones] = useState("");
  const [formasPago, setFormasPago] = useState([]);
  const [cargandoFormas, setCargandoFormas] = useState(true);

  // Cargar formas de pago desde la base de datos
  useEffect(() => {
    const cargarFormas = async () => {
      try {
        const data = await getFormasPago();
        setFormasPago(data);
        // Seleccionar la primera por defecto
        if (data.length > 0) {
          setMetodoPagoId(data[0].id);
        }
      } catch (error) {
        console.error("Error cargando formas de pago:", error);
        setVentaError("No se pudieron cargar los métodos de pago.");
      } finally {
        setCargandoFormas(false);
      }
    };
    cargarFormas();
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + item.precio * (item.quantity || 0),
    0
  );
  const envio = total > 100 ? 0 : 5;
  const totalFinal = total + envio;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmarVenta = async () => {
    if (!form.nombre || !form.direccion || !form.ciudad) {
      alert("Por favor completa los campos obligatorios de envío.");
      return;
    }

    if (!usuario) {
      alert("Debes iniciar sesión para finalizar la compra.");
      return;
    }

    if (!metodoPagoId) {
      alert("Selecciona un método de pago.");
      return;
    }

    // Obtener el nombre del método seleccionado para la observación
    const metodoNombre = formasPago.find(fp => fp.id === metodoPagoId)?.nombre || "";

    const result = await procesarVenta({
      usuario_id: usuario.id,
      cliente_id: null,
      forma_pago_id: metodoPagoId, // ✅ UUID real
      observaciones: `Envío: ${form.nombre}, ${form.direccion}, ${form.ciudad}, CP: ${form.codigoPostal}. Pago: ${metodoNombre}. Notas: ${observaciones}`,
      descuento: 0,
      iva: 0,
    });

    if (result.success) {
      // Éxito manejado por el estado ventaSuccess en el contexto
    }
  };

  const handleReset = () => {
    setVentaError(null);
    setVentaSuccess(null);
  };

  // Pantalla de éxito
  if (ventaSuccess) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 min-h-[70vh] text-center">
        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          ¡Pedido confirmado!
        </h2>
        <p className="text-gray-600 mb-8">{ventaSuccess}</p>
        <button
          onClick={() => {
            handleReset();
            navigate("/");
          }}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Volver al inicio
        </button>
      </main>
    );
  }

  // Carrito vacío
  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10 min-h-[70vh] text-center">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <Truck className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes productos para comprar
          </h2>
          <button
            onClick={() => navigate("/productos")}
            className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Ir a la tienda
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Volver */}
      <button
        onClick={() => navigate("/carrito")}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Volver al carrito
      </button>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-600" /> Datos de envío
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="Calle, número, piso"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Lima"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={form.codigoPostal}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="15001"
                />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mt-8">
            <CreditCard className="w-6 h-6 text-emerald-600" /> Método de pago
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {cargandoFormas ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando métodos de pago...
              </div>
            ) : formasPago.length === 0 ? (
              <p className="text-red-500 text-sm">Por favor inicia sesión para poder ver las formas de pago y continuar con el checkout. <a href="/login" className="text-blue-500">Click Aquí</a> </p>
            ) : (
              <div className="space-y-3">
                {formasPago.map((fp) => (
                  <label
                    key={fp.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      metodoPagoId === fp.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={fp.id}
                      checked={metodoPagoId === fp.id}
                      onChange={() => setMetodoPagoId(fp.id)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {fp.nombre.toLowerCase().includes("efectivo") ? (
                        <Banknote className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                      )}
                      {fp.nombre}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones adicionales
            </label>
            <textarea
              name="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="Ej: entregar en horario de oficina..."
              rows={3}
            />
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen del pedido
            </h2>
            <ul className="divide-y divide-gray-100 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">
                    {item.nombre} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    S/ {(item.precio * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>{envio === 0 ? "Gratis" : `S/ ${envio.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span className="text-emerald-600">
                  S/ {totalFinal.toFixed(2)}
                </span>
              </div>
            </div>

            {ventaError && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {ventaError}
              </div>
            )}

            <button
              onClick={handleConfirmarVenta}
              disabled={creatingVenta || cargandoFormas || !metodoPagoId}
              className={`w-full mt-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {creatingVenta ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Confirmar pedido
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Al confirmar aceptas nuestros términos y condiciones.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;