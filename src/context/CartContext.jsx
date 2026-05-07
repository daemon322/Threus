import { createContext, useContext, useState, useEffect } from "react";
import { crearVenta } from "../services/ventasService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [creatingVenta, setCreatingVenta] = useState(false);
  const [ventaError, setVentaError] = useState(null);
  const [ventaSuccess, setVentaSuccess] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔵 INICIALIZAR CARRITO AL MONTAR O CUANDO CAMBIA LA AUTENTICACIÓN
  useEffect(() => {
    const initializeCart = async () => {
      if (isAuthenticated && user) {
        // Usuario autenticado: cargar desde BD (si está disponible en el futuro)
        // Por ahora, usar localStorage también
        const savedCart = localStorage.getItem(`cart_${user.id}`);
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (err) {
            console.error("Error al parsear carrito guardado:", err);
            setCart([]);
          }
        }
      } else {
        // Usuario NO autenticado: cargar desde localStorage general
        const savedCart = localStorage.getItem("cart_anonymous");
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (err) {
            console.error("Error al parsear carrito guardado:", err);
            setCart([]);
          }
        }
      }
      setIsInitialized(true);
    };

    initializeCart();
  }, [isAuthenticated, user]);

  // 🔵 GUARDAR CARRITO EN LOCALSTORAGE CUANDO CAMBIA
  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && user) {
      // Usuario autenticado: guardar con su ID
      if (cart.length > 0) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      } else {
        localStorage.removeItem(`cart_${user.id}`);
      }
    } else {
      // Usuario NO autenticado: guardar carrito anónimo
      if (cart.length > 0) {
        localStorage.setItem("cart_anonymous", JSON.stringify(cart));
      } else {
        localStorage.removeItem("cart_anonymous");
      }
    }
  }, [cart, isAuthenticated, user, isInitialized]);

  // Solo aumenta la cantidad en 1
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Disminuye la cantidad en 1, elimina si llega a 0
  const decreaseFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  /**
   * Procesar la venta en Supabase
   * @param {Object} ventaConfig - Configuración de la venta
   * @param {string} ventaConfig.usuario_id - ID del usuario/cajero
   * @param {string} ventaConfig.cliente_id - ID del cliente (opcional)
   * @param {string} ventaConfig.forma_pago_id - ID de la forma de pago
   * @param {number} ventaConfig.descuento - Descuento total (opcional)
   * @param {number} ventaConfig.iva - IVA calculado (opcional)
   * @returns {Promise<Object>} Resultado de la venta { success, venta, error }
   */
  const procesarVenta = async (ventaConfig) => {
    if (cart.length === 0) {
      setVentaError("El carrito está vacío");
      return { success: false, error: "El carrito está vacío" };
    }

    if (!ventaConfig.usuario_id || !ventaConfig.forma_pago_id) {
      setVentaError("Faltan datos requeridos para la venta");
      return { success: false, error: "Faltan datos requeridos" };
    }

    setCreatingVenta(true);
    setVentaError(null);
    setVentaSuccess(null);

    try {
      // Calcular total
      const total = cart.reduce(
        (acc, item) => acc + item.precio * item.quantity,
        0,
      );

      // Crear venta en Supabase
      const result = await crearVenta({
        usuario_id: ventaConfig.usuario_id,
        cliente_id: ventaConfig.cliente_id || null,
        forma_pago_id: ventaConfig.forma_pago_id,
        detalles: cart,
        total: total,
        descuento: ventaConfig.descuento || 0,
        iva: ventaConfig.iva || 0,
        observaciones: ventaConfig.observaciones || "",
      });

      if (result.success) {
        setVentaSuccess(
          `Venta registrada exitosamente - Folio: ${result.venta.folio}`,
        );
        clearCart();
        setCreatingVenta(false);
        return { success: true, venta: result.venta };
      } else {
        setVentaError(result.error || "Error al procesar la venta");
        setCreatingVenta(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMsg = error.message || "Error desconocido al procesar venta";
      setVentaError(errorMsg);
      setCreatingVenta(false);
      console.error("Error en procesarVenta:", error);
      return { success: false, error: errorMsg };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        clearCart,
        procesarVenta,
        creatingVenta,
        ventaError,
        ventaSuccess,
        setVentaError,
        setVentaSuccess,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
