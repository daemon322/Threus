import { createContext, useContext, useEffect, useRef, useState } from "react";
import { crearVenta } from "../services/ventasService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

const ANONYMOUS_KEY = "cart_anonymous";

const readCart = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error leyendo carrito:", error);
    return [];
  }
};

const writeCart = (key, cart) => {
  try {
    if (cart.length > 0) {
      localStorage.setItem(key, JSON.stringify(cart));
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Error guardando carrito:", error);
  }
};

const mergeCarts = (baseCart = [], extraCart = []) => {
  const merged = baseCart.map((item) => ({ ...item }));

  for (const extraItem of extraCart) {
    const index = merged.findIndex((item) => item.id === extraItem.id);

    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        quantity: (merged[index].quantity || 0) + (extraItem.quantity || 0),
      };
    } else {
      merged.push({ ...extraItem });
    }
  }

  return merged;
};

export const CartProvider = ({ children }) => {
  const { session, usuario, authState, estaAutenticado } = useAuth();

  const [cart, setCart] = useState([]);
  const [creatingVenta, setCreatingVenta] = useState(false);
  const [ventaError, setVentaError] = useState(null);
  const [ventaSuccess, setVentaSuccess] = useState(null);

  const hydratedRef = useRef(false);

  const userId = session?.user?.id || null;
  const storageKey = userId ? `cart_${userId}` : ANONYMOUS_KEY;

  useEffect(() => {
    if (authState === "checking") return;

    const anonymousCart = readCart(ANONYMOUS_KEY);

    if (userId) {
      const userCart = readCart(`cart_${userId}`);

      if (userCart.length > 0 && anonymousCart.length > 0) {
        const merged = mergeCarts(userCart, anonymousCart);
        setCart(merged);
        writeCart(`cart_${userId}`, merged);
        localStorage.removeItem(ANONYMOUS_KEY);
      } else if (userCart.length > 0) {
        setCart(userCart);
      } else if (anonymousCart.length > 0) {
        setCart(anonymousCart);
        writeCart(`cart_${userId}`, anonymousCart);
        localStorage.removeItem(ANONYMOUS_KEY);
      } else {
        setCart([]);
      }
    } else {
      setCart(anonymousCart);
    }

    hydratedRef.current = true;
  }, [authState, userId]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (authState === "checking") return;

    writeCart(storageKey, cart);
  }, [cart, storageKey, authState]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 0) - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

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
      const total = cart.reduce(
        (acc, item) => acc + Number(item.precio) * Number(item.quantity),
        0,
      );

      const result = await crearVenta({
        usuario_id: ventaConfig.usuario_id,
        cliente_id: ventaConfig.cliente_id || null,
        forma_pago_id: ventaConfig.forma_pago_id,
        detalles: cart,
        total,
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
      }

      setVentaError(result.error || "Error al procesar la venta");
      setCreatingVenta(false);
      return { success: false, error: result.error };
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
        items: cart,
        cartCount: cart.length,
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
        estaAutenticado,
        usuario,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};