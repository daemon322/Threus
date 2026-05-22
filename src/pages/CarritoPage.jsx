import { useCart } from "../context/CartContext";
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CarritoPage = () => {
  const { cart, addToCart, decreaseFromCart, removeFromCart, clearCart } =
    useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (acc, item) => acc + item.precio * (item.quantity || 0),
    0
  );

  const incrementar = (item) => {
    // Verificar stock si existe la propiedad
    if (item.stock !== undefined && item.quantity >= item.stock) return;
    addToCart(item); // Agrega una unidad
  };

  const decrementar = (item) => {
    if (item.quantity <= 1) return; // evitar eliminar accidentalmente con el botón (-)
    decreaseFromCart(item.id);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-emerald-600" />
          Tu Carrito
        </h1>
        {cart.length > 0 && (
          <span className="text-sm text-gray-500 mt-2 sm:mt-0">
            {cart.length} {cart.length === 1 ? "producto" : "productos"}
          </span>
        )}
      </div>

      {/* Carrito vacío */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6 text-center max-w-sm">
            Agrega productos desde nuestra tienda para empezar a comprar.
          </p>
          <button
            onClick={() => navigate("/productos")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-md"
          >
            Ir a comprar
          </button>
        </div>
      ) : (
        <>
          {/* Lista de productos */}
          <ul className="space-y-4 mb-10">
            {cart.map((item) => {
              const quantity = item.quantity || 0;
              const stockDisponible = item.stock ?? Infinity;
              const maxAlcanzado = quantity >= stockDisponible;

              return (
                <li
                  key={item.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl bg-gray-50 p-2">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.nombre}
                    </h3>
                    {item.stock !== undefined && (
                      <p className="text-xs text-gray-500">
                        Stock disponible: {item.stock}
                      </p>
                    )}
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementar(item)}
                      disabled={quantity <= 1}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => incrementar(item)}
                      disabled={maxAlcanzado}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Precio y eliminar */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                    <span className="text-lg font-bold text-emerald-600">
                      S/ {(item.precio * quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200/60">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium text-gray-700">
                Total a pagar
              </span>
              <span className="text-3xl font-extrabold text-emerald-600">
                S/ {total.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={clearCart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Vaciar carrito
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-300/50 transition-all duration-200 active:scale-[0.98]"
              >
                Finalizar compra
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default CarritoPage;