import { supabase } from "./supabase";

/**
 * Crear una nueva venta y sus detalles
 * @param {Object} ventaData - Datos de la venta
 * @param {UUID} ventaData.usuario_id - ID del usuario (cajero)
 * @param {UUID} ventaData.cliente_id - ID del cliente (puede ser null para consumidor final)
 * @param {UUID} ventaData.forma_pago_id - ID de la forma de pago
 * @param {Array} ventaData.detalles - Array de detalles de venta
 * @param {Number} ventaData.total - Total de la venta
 * @param {Number} ventaData.descuento - Descuento aplicado
 * @param {Number} ventaData.iva - IVA calculado
 * @param {String} ventaData.observaciones - Observaciones
 */
export const crearVenta = async (ventaData) => {
  try {
    // 1. Crear la venta
    const { data: venta, error: errorVenta } = await supabase
      .from("ventas")
      .insert([
        {
          usuario_id: ventaData.usuario_id,
          cliente_id: ventaData.cliente_id || null,
          forma_pago_id: ventaData.forma_pago_id,
          total: ventaData.total,
          descuento: ventaData.descuento || 0,
          iva: ventaData.iva || 0,
          estado: "completada",
          observaciones: ventaData.observaciones || "",
        },
      ])
      .select();

    if (errorVenta) {
      console.error("Error al crear venta:", errorVenta);
      return { success: false, error: errorVenta.message };
    }

    const ventaId = venta[0].id;

    // 2. Crear los detalles de venta
    const detalles = ventaData.detalles.map((detalle) => ({
      venta_id: ventaId,
      producto_id: detalle.id,
      cantidad: detalle.quantity,
      precio_unitario: detalle.precio,
      descuento: detalle.descuento || 0,
    }));

    const { data: detallesVenta, error: errorDetalles } = await supabase
      .from("detalles_venta")
      .insert(detalles)
      .select();

    if (errorDetalles) {
      console.error("Error al crear detalles de venta:", errorDetalles);
      return { success: false, error: errorDetalles.message };
    }

    return {
      success: true,
      venta: {
        id: ventaId,
        folio: venta[0].folio,
        ...venta[0],
      },
    };
  } catch (error) {
    console.error("Error en crearVenta:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todas las ventas
 */
export const getVentas = async (limite = 50) => {
  try {
    const { data, error } = await supabase
      .from("ventas")
      .select(
        `
        id,
        folio,
        fecha,
        total,
        descuento,
        iva,
        estado,
        clientes(nombres, apellidos),
        formas_pago(nombre),
        usuarios(nombre_completo)
      `,
      )
      .order("fecha", { ascending: false })
      .limit(limite);

    if (error) {
      console.error("Error al obtener ventas:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getVentas:", error);
    return [];
  }
};

/**
 * Obtener detalles de una venta específica
 */
export const getDetallesVenta = async (ventaId) => {
  try {
    const { data, error } = await supabase
      .from("detalles_venta")
      .select(
        `
        id,
        cantidad,
        precio_unitario,
        descuento,
        subtotal,
        productos(id, nombre, codigo_barras)
      `,
      )
      .eq("venta_id", ventaId);

    if (error) {
      console.error("Error al obtener detalles de venta:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getDetallesVenta:", error);
    return [];
  }
};

/**
 * Obtener formas de pago disponibles
 */
export const getFormasPago = async () => {
  try {
    const { data, error } = await supabase
      .from("formas_pago")
      .select("id, nombre")
      .eq("activo", true);

    if (error) {
      console.error("Error al obtener formas de pago:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getFormasPago:", error);
    return [];
  }
};

/**
 * Anular una venta
 */
export const anularVenta = async (ventaId) => {
  try {
    const { data, error } = await supabase
      .from("ventas")
      .update({ estado: "anulada" })
      .eq("id", ventaId)
      .select();

    if (error) {
      console.error("Error al anular venta:", error);
      return { success: false, error: error.message };
    }

    return { success: true, venta: data[0] };
  } catch (error) {
    console.error("Error en anularVenta:", error);
    return { success: false, error: error.message };
  }
};
