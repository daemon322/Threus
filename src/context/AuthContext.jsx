import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al montar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error("Error al verificar sesión:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      console.log("Auth event:", event);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Login con Google
   */
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/Threus`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
      console.error("Error en loginWithGoogle:", err);
    }
  };

  /**
   * Login con email y contraseña
   */
  const loginWithEmail = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      console.error("Error en loginWithEmail:", err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Registrarse con email y contraseña
   */
  const signUp = async (email, password, fullName) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      console.error("Error en signUp:", err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // 🔒 LIMPIAR DATOS SENSIBLES Y CARRITO DEL USUARIO
      if (user?.id) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      // No eliminar cart_anonymous para que persista si no está autenticado

      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error("Error en logout:", err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    loginWithGoogle,
    loginWithEmail,
    signUp,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
