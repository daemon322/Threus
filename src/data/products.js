/**
 * Este archivo importa productos de Supabase
 * No contiene datos ficticios, usa el servicio de productos
 */

import { getProductos } from "../services/productosService";

// Variable para cachear los productos
let productosCache = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtener productos con caché
 * @returns {Promise<Array>} Array de productos
 */
export const loadProducts = async () => {
  const now = Date.now();

  // Si el caché está vigente, retornar datos cacheados
  if (productosCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return productosCache;
  }

  // Si no hay caché o expiró, obtener de Supabase
  const productos = await getProductos();

  if (productos.length > 0) {
    productosCache = productos;
    cacheTimestamp = now;
  }

  return productos;
};

/**
 * Obtener productos síncronamente del caché (para uso inmediato)
 * Nota: Es mejor usar loadProducts para obtener datos frescos
 * @returns {Array} Productos cacheados
 */
export const getProductosSync = () => {
  return productosCache;
};

/**
 * Invalidar el caché de productos
 */
export const invalidateProductCache = () => {
  productosCache = [];
  cacheTimestamp = 0;
};

// Exportar para uso directo
export default productosCache;
