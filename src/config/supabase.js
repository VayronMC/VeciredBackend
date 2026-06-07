import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Copia .env.example a .env y configura los valores.',
  );
}

/**
 * Crea un cliente de Supabase con credenciales de servicio para operaciones del backend.
 * @returns {import('@supabase/supabase-js').SupabaseClient} Cliente configurado sin persistencia de sesión
 */
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const supabase = createSupabaseClient();
