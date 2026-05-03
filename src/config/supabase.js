import { createClient } from '@supabase/supabase-js';

// Configuración con las credenciales correctas
const supabaseUrl = 'https://rtnoeoltbradyshujicb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bm9lb2x0YnJhZHlzaHVqaWNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY4MzIxMywiZXhwIjoyMDkzMjU5MjEzfQ.MvIdUM6yRtLKssCFnvO1SgJ3W-p1TvjmTWs2Wfq8kis';

// Crear cliente con manejo de errores
let supabaseClient;
try {
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('✅ Cliente Supabase inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Supabase:', error.message);
  // Crear un mock para que el servidor no falle
  supabaseClient = {
    auth: {
      signUp: async () => ({ data: null, error: { message: 'Supabase no disponible' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase no disponible' } })
    },
    from: () => ({
      insert: async () => ({ data: null, error: { message: 'Supabase no disponible' } }),
      select: () => ({
        eq: async () => ({ data: null, error: { message: 'Supabase no disponible' }, single: async () => ({ data: null, error: { message: 'Supabase no disponible' } }) })
      })
    })
  };
}

export const supabase = supabaseClient;
