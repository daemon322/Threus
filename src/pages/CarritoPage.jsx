import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";

const CarritoPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0,
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Tu Carrito</h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">El carrito está vacío.</div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center py-4">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-16 w-16 object-contain rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.nombre}</div>
                  <div className="text-sm text-gray-500">
                    {item.cantidad || item.quantity} x S/{" "}
                    {item.precio.toFixed(2)}
                  </div>
                </div>
                <div className="font-bold text-green-700 mr-4">
                  S/{" "}
                  {(item.precio * (item.cantidad || item.quantity)).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-green-700 text-xl">
              S/ {total.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Vaciar carrito
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium">
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default CarritoPage;
