import { supabase } from "../utils/supabase";
import { uploadImage, deleteImage } from "./storageService";
/**
 * Obtener todos los productos (activos e inactivos) para admin
 */
export const getAllProductosAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select(
        "id, codigo_barras, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida, categoria_id, proveedor_id, imagen_url, activo, categorias(id, nombre)",
      )
      .order("nombre");

    if (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }

    return data.map((producto) => ({
      id: producto.id,
      codigo_barras: producto.codigo_barras,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo,
      unidad_medida: producto.unidad_medida,
      categoria_id: producto.categoria_id,
      categoria: producto.categorias?.nombre || "Sin categoría",
      proveedor_id: producto.proveedor_id,
      imagen_url: producto.imagen_url,
      activo: producto.activo,
    }));
  } catch (error) {
    console.error("Error en getAllProductosAdmin:", error);
    return [];
  }
};

/**
 * Crear nuevo producto
 */
export const crearProducto = async (productoData) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          codigo_barras: productoData.codigo_barras || null,
          nombre: productoData.nombre,
          descripcion: productoData.descripcion || null,
          precio_compra: parseFloat(productoData.precio_compra) || 0,
          precio_venta: parseFloat(productoData.precio_venta) || 0,
          stock_actual: parseFloat(productoData.stock_actual) || 0,
          stock_minimo: parseFloat(productoData.stock_minimo) || 0,
          unidad_medida: productoData.unidad_medida || "unidad",
          categoria_id: productoData.categoria_id,
          proveedor_id: productoData.proveedor_id || null,
          imagen_url: productoData.imagen_url || null,
          activo: productoData.activo !== false,
        },
      ])
      .select();

    if (error) {
      console.error("Error al crear producto:", error);
      return { success: false, error: error.message };
    }

    return { success: true, producto: data[0] };
  } catch (error) {
    console.error("Error en crearProducto:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar producto
 */
export const actualizarProducto = async (id, productoData) => {
  try {
    let imagen_url = productoData.imagen_url || null;

    const { data, error } = await supabase
      .from("productos")
      .update({
        codigo_barras: productoData.codigo_barras || null,

        nombre: productoData.nombre,

        descripcion: productoData.descripcion || null,

        precio_compra: parseFloat(productoData.precio_compra) || 0,

        precio_venta: parseFloat(productoData.precio_venta) || 0,

        stock_actual: parseFloat(productoData.stock_actual) || 0,

        stock_minimo: parseFloat(productoData.stock_minimo) || 0,

        unidad_medida: productoData.unidad_medida || "unidad",

        categoria_id: productoData.categoria_id,

        proveedor_id: productoData.proveedor_id || null,

        imagen_url,

        activo: productoData.activo !== false,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error al actualizar producto:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      producto: data[0],
    };
  } catch (error) {
    console.error("Error en actualizarProducto:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Eliminar producto (soft delete - marcar como inactivo)
 */
export const eliminarProducto = async (id) => {
  try {
    const { error } = await supabase
      .from("productos")
      .update({ activo: false })
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar producto:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en eliminarProducto:", error);
    return { success: false, error: error.message };
  }
};
/** Eliminar producto DELET REAL 
 * 
export const eliminarProducto = async (id) => {
  try {
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar producto:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en eliminarProducto:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
*/
/**
 *
 * Restaurar producto (reactivar)
 */
export const restaurarProducto = async (id) => {
  try {
    const { error } = await supabase
      .from("productos")
      .update({ activo: true })
      .eq("id", id);

    if (error) {
      console.error("Error al restaurar producto:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en restaurarProducto:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar stock de producto
 */
export const actualizarStock = async (id, nuevoStock) => {
  try {
    const { error } = await supabase
      .from("productos")
      .update({ stock_actual: nuevoStock })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar stock:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en actualizarStock:", error);
    return { success: false, error: error.message };
  }
};
