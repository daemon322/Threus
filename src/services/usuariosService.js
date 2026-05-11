import { supabase } from "../utils/supabase";

/**
 * Obtener todos los usuarios (empleados/cajeros)
 */
export const getUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre_usuario, nombre_completo, email, rol")
      .eq("activo", true);

    if (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    return [];
  }
};

/**
 * Obtener usuario por ID
 */
export const getUsuarioById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .eq("activo", true)
      .single();

    if (error) {
      console.error("Error al obtener usuario:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en getUsuarioById:", error);
    return null;
  }
};

/**
 * Obtener usuario por email
 */
export const getUsuarioByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .eq("activo", true)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = No rows found
      console.error("Error al obtener usuario:", error);
    }

    return data || null;
  } catch (error) {
    console.error("Error en getUsuarioByEmail:", error);
    return null;
  }
};

/**
 * Crear un nuevo usuario
 */
export const crearUsuario = async (usuarioData) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre_usuario: usuarioData.nombre_usuario,
          nombre_completo: usuarioData.nombre_completo,
          email: usuarioData.email,
          rol: usuarioData.rol || "cajero",
        },
      ])
      .select();

    if (error) {
      console.error("Error al crear usuario:", error);
      return { success: false, error: error.message };
    }

    return { success: true, usuario: data[0] };
  } catch (error) {
    console.error("Error en crearUsuario:", error);
    return { success: false, error: error.message };
  }
};
