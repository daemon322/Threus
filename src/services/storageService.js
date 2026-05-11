import { supabase } from "../utils/supabase";

/**
 * Subir imagen
 */
export const uploadImage = async (
  file,
  bucket = "productos",
) => {
  try {
    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: data.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("❌ Error uploadImage:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Eliminar imagen
 */
export const deleteImage = async (
  imageUrl,
  bucket = "productos",
) => {
  try {
    if (!imageUrl) return;

    // Extraer path real
    const parts = imageUrl.split(`/${bucket}/`);

    if (parts.length < 2) return;

    const filePath = parts[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Error deleteImage:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};