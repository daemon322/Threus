import { supabase } from "./supabase";

/**
 * Obtener todas las categorías activas
 */
export const getCategorias = async () => {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .select("id, nombre, descripcion")
      .eq("activo", true)
      .order("nombre");

    if (error) {
      console.error("Error al obtener categorías:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getCategorias:", error);
    return [];
  }
};

/**
 * Obtener una categoría por ID
 */
export const getCategoriaById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .select("id, nombre, descripcion")
      .eq("id", id)
      .eq("activo", true)
      .single();

    if (error) {
      console.error("Error al obtener categoría:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en getCategoriaById:", error);
    return null;
  }
};
