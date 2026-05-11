import { getProductos } from "../services/productosService";

const STORAGE_KEY = "minimarket_productos_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

let productosCache = [];
let cacheTimestamp = 0;

// ============================================================================
// LEER CACHE
// ============================================================================
const readLocalCache = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed || !Array.isArray(parsed.productos)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("❌ Error leyendo cache:", error);
    return null;
  }
};

// ============================================================================
// GUARDAR CACHE
// ============================================================================
const writeLocalCache = (productos, timestamp = Date.now()) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timestamp,
        productos,
      }),
    );
  } catch (error) {
    console.error("❌ Error guardando cache:", error);
  }
};

// ============================================================================
// VALIDAR CACHE
// ============================================================================
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// ============================================================================
// CARGAR PRODUCTOS
// ============================================================================
export const loadProducts = async ({ forceRefresh = false } = {}) => {
  const now = Date.now();

  // CACHE EN MEMORIA
  if (
    !forceRefresh &&
    productosCache.length > 0 &&
    isCacheValid(cacheTimestamp)
  ) {
    return productosCache;
  }

  // CACHE LOCALSTORAGE
  if (!forceRefresh) {
    const localCache = readLocalCache();

    if (
      localCache?.productos?.length > 0 &&
      isCacheValid(localCache.timestamp)
    ) {
      productosCache = localCache.productos;
      cacheTimestamp = localCache.timestamp;

      return productosCache;
    }
  }

  // CONSULTAR SUPABASE
  try {
    const productos = await getProductos();

    if (Array.isArray(productos)) {
      productosCache = productos;
      cacheTimestamp = now;

      writeLocalCache(productos, now);

      return productos;
    }

    return [];
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);

    // FALLBACK LOCAL
    const fallback = readLocalCache();

    if (fallback?.productos?.length > 0) {
      productosCache = fallback.productos;
      cacheTimestamp = fallback.timestamp;

      return fallback.productos;
    }

    return [];
  }
};

// ============================================================================
// OBTENER PRODUCTOS SINCRÓNICO
// ============================================================================
export const getProductosSync = () => {
  if (productosCache.length > 0) {
    return productosCache;
  }

  const localCache = readLocalCache();

  if (localCache?.productos?.length > 0) {
    productosCache = localCache.productos;
    cacheTimestamp = localCache.timestamp;

    return localCache.productos;
  }

  return [];
};

// ============================================================================
// INVALIDAR CACHE
// ============================================================================
export const invalidateProductCache = () => {
  productosCache = [];
  cacheTimestamp = 0;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("❌ Error eliminando cache:", error);
  }
};

// ============================================================================
// ACTUALIZAR CACHE
// ============================================================================
export const updateProductCache = (productos) => {
  const now = Date.now();

  productosCache = Array.isArray(productos)
    ? productos
    : [];

  cacheTimestamp = now;

  writeLocalCache(productosCache, now);
};

export default productosCache;