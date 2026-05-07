import { supabase } from "./supabase";

/**
 * Obtener todos los productos activos con sus categorías
 */
export const getProductos = async () => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select(
        "id, codigo_barras, nombre, descripcion, precio_venta, stock_actual, unidad_medida, categoria_id, categorias(id, nombre)",
      )
      .eq("activo", true)
      .order("nombre");

    if (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }

    // Transformar los datos para compatibilidad con el frontend
    return data.map((producto) => ({
      id: producto.id,
      codigo_barras: producto.codigo_barras,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio_venta,
      stock: producto.stock_actual,
      unidad: producto.unidad_medida,
      categoria_id: producto.categoria_id,
      categoria: producto.categorias?.nombre || "Sin categoría",
      imagen: `https://via.placeholder.com/200x200?text=${encodeURIComponent(producto.nombre)}`,
    }));
  } catch (error) {
    console.error("Error en getProductos:", error);
    return [];
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select(
        "id, codigo_barras, nombre, descripcion, precio_venta, stock_actual, unidad_medida, categoria_id, categorias(id, nombre)",
      )
      .eq("id", id)
      .eq("activo", true)
      .single();

    if (error) {
      console.error("Error al obtener producto:", error);
      return null;
    }

    return {
      id: data.id,
      codigo_barras: data.codigo_barras,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio_venta,
      stock: data.stock_actual,
      unidad: data.unidad_medida,
      categoria_id: data.categoria_id,
      categoria: data.categorias?.nombre || "Sin categoría",
      imagen: `https://via.placeholder.com/200x200?text=${encodeURIComponent(data.nombre)}`,
    };
  } catch (error) {
    console.error("Error en getProductoById:", error);
    return null;
  }
};

/**
 * Obtener productos por categoría
 */
export const getProductosByCategoria = async (categoriaId) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select(
        "id, codigo_barras, nombre, descripcion, precio_venta, stock_actual, unidad_medida, categoria_id, categorias(id, nombre)",
      )
      .eq("categoria_id", categoriaId)
      .eq("activo", true)
      .order("nombre");

    if (error) {
      console.error("Error al obtener productos por categoría:", error);
      return [];
    }

    return data.map((producto) => ({
      id: producto.id,
      codigo_barras: producto.codigo_barras,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio_venta,
      stock: producto.stock_actual,
      unidad: producto.unidad_medida,
      categoria_id: producto.categoria_id,
      categoria: producto.categorias?.nombre || "Sin categoría",
      imagen: `https://via.placeholder.com/200x200?text=${encodeURIComponent(producto.nombre)}`,
    }));
  } catch (error) {
    console.error("Error en getProductosByCategoria:", error);
    return [];
  }
};

/**
 * Buscar productos por término de búsqueda
 */
export const buscarProductos = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select(
        "id, codigo_barras, nombre, descripcion, precio_venta, stock_actual, unidad_medida, categoria_id, categorias(id, nombre)",
      )
      .eq("activo", true)
      .or(
        `nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%,codigo_barras.ilike.%${searchTerm}%`,
      )
      .order("nombre");

    if (error) {
      console.error("Error al buscar productos:", error);
      return [];
    }

    return data.map((producto) => ({
      id: producto.id,
      codigo_barras: producto.codigo_barras,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio_venta,
      stock: producto.stock_actual,
      unidad: producto.unidad_medida,
      categoria_id: producto.categoria_id,
      categoria: producto.categorias?.nombre || "Sin categoría",
      imagen: `https://via.placeholder.com/200x200?text=${encodeURIComponent(producto.nombre)}`,
    }));
  } catch (error) {
    console.error("Error en buscarProductos:", error);
    return [];
  }
};

/**
 * Actualizar stock de un producto (interno)
 */
export const actualizarStockProducto = async (productoId, nuevaCantidad) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .update({ stock_actual: nuevaCantidad })
      .eq("id", productoId)
      .select();

    if (error) {
      console.error("Error al actualizar stock:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error en actualizarStockProducto:", error);
    return false;
  }
};
