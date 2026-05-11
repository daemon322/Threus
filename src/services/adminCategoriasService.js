// src/services/adminCategoriasService.js

import { supabase } from "../utils/supabase";
import { uploadImage, deleteImage } from "./storageService";
// ============================================================================
// OBTENER TODAS LAS CATEGORÍAS
// ============================================================================
export const getAllCategorias = async () => {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error("❌ getAllCategorias:", err);
    throw err;
  }
};

// ============================================================================
// CREAR CATEGORÍA
// ============================================================================
export const crearCategoria = async (categoriaData) => {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .insert([
        {
          nombre: categoriaData.nombre,
          descripcion: categoriaData.descripcion,
          imagen_url: categoriaData.imagen_url || null,
        },
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      categoria: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
// ============================================================================
// ACTUALIZAR CATEGORÍA
// ============================================================================
export const actualizarCategoria = async (id, categoriaData) => {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .update({
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion,
        imagen_url: categoriaData.imagen_url || null,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (categoriaData.imagenFile) {
      const { data: categoriaActual } = await supabase
        .from("categorias")
        .select("imagen_url")
        .eq("id", id)
        .single();

      if (categoriaActual?.imagen_url) {
        await deleteImage(categoriaActual.imagen_url, "categorias");
      }
    }

    return {
      success: true,
      categoria: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================================
// ELIMINAR CATEGORÍA
// ============================================================================
export const eliminarCategoria = async (id) => {
  try {
    const { error } = await supabase.from("categorias").delete().eq("id", id);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (err) {
    console.error("❌ eliminarCategoria:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
