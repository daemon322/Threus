import { createClient } from "@supabase/supabase-js";

// Obtener variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Error: Las variables de entorno de Supabase no están configuradas.",
  );
  console.error("Por favor, crea un archivo .env.local con:");
  console.error("VITE_SUPABASE_URL=https://your-project.supabase.co");
  console.error("VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key");
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
