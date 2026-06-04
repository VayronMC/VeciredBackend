import { createSupabaseClient } from '../config/supabase.js';

export const createRequest = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { usuario_id, publicacion_id } = req.body;

    if (!usuario_id || !publicacion_id) {
      return res.status(400).json({
        error: 'usuario_id y publicacion_id son obligatorios'
      });
    }

    const { data: solicitud, error } = await supabase
      .from('solicitudes')
      .insert([{
        usuario_id,
        publicacion_id,
        estado: 'activa'
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error al crear solicitud',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      solicitud
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

export const getUserRequests = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({
        error: 'usuario_id es obligatorio'
      });
    }

    const { data: solicitudes, error } = await supabase
      .from('solicitudes')
      .select('*, publicaciones:publicacion_id (*, perfiles:usuario_id (nombre_completo, correo_electronico, foto_url))')
      .eq('usuario_id', usuario_id)
      .eq('estado', 'activa')
      .order('fecha_creacion', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: 'Error al obtener solicitudes del usuario',
        details: error.message
      });
    }

    res.status(200).json({
      solicitudes,
      count: solicitudes.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};
