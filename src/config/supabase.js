import { createClient } from '@supabase/supabase-js';

// Configuración con las credenciales correctas
const supabaseUrl = 'https://rtnoeoltbradyshujicb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bm9lb2x0YnJhZHlzaHVqaWNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY4MzIxMywiZXhwIjoyMDkzMjU5MjEzfQ.MvIdUM6yRtLKssCFnvO1SgJ3W-p1TvjmTWs2Wfq8kis';

// Crear cliente para cada solicitud (evitar problemas de caché)
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Cliente por defecto para compatibilidad
export const supabase = createSupabaseClient();
