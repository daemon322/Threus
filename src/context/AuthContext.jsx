import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../utils/supabase";

// ============================================================================
// CONTEXT
// ============================================================================
const AuthContext = createContext();

// ============================================================================
// HOOK
// ============================================================================
export const useAuth = () => {
  return useContext(AuthContext);
};

// ============================================================================
// PROVIDER
// ============================================================================
export const AuthProvider = ({ children }) => {
  // ==========================================================================
  // STATES
  // ==========================================================================
  const [session, setSession] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // SOLO para hidratación inicial
  const [loading, setLoading] = useState(true);

  // ==========================================================================
  // OBTENER PERFIL
  // ==========================================================================
  const fetchProfile = async (userId) => {
    try {

      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ Error perfil:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("❌ fetchProfile:", err);
      return null;
    }
  };

  // ==========================================================================
  // INICIALIZAR AUTH
  // ==========================================================================
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {

        // ====================================================================
        // RECUPERAR SESIÓN
        // ====================================================================
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ getSession:", error);
        }

        if (!mounted) return;

        // ====================================================================
        // GUARDAR SESSION
        // ====================================================================
        setSession(session);

        // ====================================================================
        // PERFIL (SIN BLOQUEAR APP)
        // ====================================================================
        if (session?.user) {
          fetchProfile(session.user.id)
            .then((profile) => {
              if (!mounted) return;

              setUsuario(profile);
            })
            .catch((err) => {
              console.error("❌ Error perfil async:", err);
            });
        }
      } catch (err) {
        console.error("❌ initializeAuth:", err);
      } finally {
        // ====================================================================
        // IMPORTANTE
        // ====================================================================
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // =========================================================================
    // LISTENER AUTH
    // =========================================================================
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {

        if (!mounted) return;

        // =====================================================================
        // SESSION
        // =====================================================================
        setSession(currentSession);

        // =====================================================================
        // LOGIN
        // =====================================================================
        if (currentSession?.user) {
          fetchProfile(currentSession.user.id)
            .then((profile) => {
              if (!mounted) return;

              setUsuario(profile);
            })
            .catch((err) => {
              console.error("❌ Error perfil listener:", err);
            });
        } else {
          // ===================================================================
          // LOGOUT
          // ===================================================================
          setUsuario(null);
        }
      },
    );

    // =========================================================================
    // CLEANUP
    // =========================================================================
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================================================
  // LOGIN
  // ==========================================================================
  const login = async (email, password) => {
    try {

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      return {
        success: true,
      };
    } catch (err) {
      console.error("❌ Login error:", err);

      return {
        success: false,
        error: err.message,
      };
    }
  };

  // ==========================================================================
  // GOOGLE LOGIN
  // ==========================================================================
  const loginWithGoogle = async () => {
    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });

      if (error) throw error;

      return {
        success: true,
      };
    } catch (err) {
      console.error("❌ Google login:", err);

      return {
        success: false,
        error: err.message,
      };
    }
  };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================
  const logout = async () => {
    try {
      await supabase.auth.signOut();

      setSession(null);
      setUsuario(null);

    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  // ==========================================================================
  // DEBUG
  // ==========================================================================

  // ==========================================================================
  // VALUES
  // ==========================================================================
  const value = {
    // DATA
    session,
    usuario,
    loading,

    // AUTH
    isAuthenticated: !!session,
    estaAutenticado: !!session,

    // ROLE
    isAdmin: usuario?.rol === "admin",

    // ACTIONS
    login,
    loginWithGoogle,
    logout,
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};