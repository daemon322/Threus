import { supabase } from "./supabase";

/**
 * Obtener todos los clientes
 */
export const getClientes = async () => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombres, apellidos, numero_documento, email, telefono")
      .eq("activo", true)
      .order("nombres");

    if (error) {
      console.error("Error al obtener clientes:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getClientes:", error);
    return [];
  }
};

/**
 * Obtener cliente por ID
 */
export const getClienteById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .eq("activo", true)
      .single();

    if (error) {
      console.error("Error al obtener cliente:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en getClienteById:", error);
    return null;
  }
};

/**
 * Obtener cliente por número de documento
 */
export const getClienteByDocumento = async (numeroDocumento) => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("numero_documento", numeroDocumento)
      .eq("activo", true)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = No rows found
      console.error("Error al obtener cliente:", error);
    }

    return data || null;
  } catch (error) {
    console.error("Error en getClienteByDocumento:", error);
    return null;
  }
};

/**
 * Crear un nuevo cliente
 */
export const crearCliente = async (clienteData) => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .insert([
        {
          tipo_documento: clienteData.tipo_documento,
          numero_documento: clienteData.numero_documento,
          nombres: clienteData.nombres,
          apellidos: clienteData.apellidos,
          telefono: clienteData.telefono,
          email: clienteData.email,
          direccion: clienteData.direccion,
        },
      ])
      .select();

    if (error) {
      console.error("Error al crear cliente:", error);
      return { success: false, error: error.message };
    }

    return { success: true, cliente: data[0] };
  } catch (error) {
    console.error("Error en crearCliente:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar cliente
 */
export const actualizarCliente = async (id, clienteData) => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .update(clienteData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error al actualizar cliente:", error);
      return { success: false, error: error.message };
    }

    return { success: true, cliente: data[0] };
  } catch (error) {
    console.error("Error en actualizarCliente:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener el cliente "Consumidor Final" por defecto
 */
export const getClienteConsumidorFinal = async () => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("id")
      .eq("numero_documento", "CONSUMIDOR")
      .eq("activo", true)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error al obtener consumidor final:", error);
    }

    return data?.id || null;
  } catch (error) {
    console.error("Error en getClienteConsumidorFinal:", error);
    return null;
  }
};
