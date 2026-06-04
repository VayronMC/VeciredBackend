import { createSupabaseClient } from '../config/supabase.js';

export const createResena = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { usuario_id, evaluado_id, publicacion_id, solicitud_id, calificacion, comentario } = req.body;

    if (!usuario_id || !evaluado_id || !publicacion_id || !solicitud_id || !calificacion) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: usuario_id, evaluado_id, publicacion_id, solicitud_id, calificacion'
      });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({
        error: 'La calificación debe estar entre 1 y 5'
      });
    }

    const { data: resena, error } = await supabase
      .from('resenas')
      .insert({
        usuario_id,
        evaluado_id,
        publicacion_id,
        solicitud_id,
        calificacion,
        comentario: comentario || null
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error al crear reseña',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Reseña creada exitosamente',
      resena
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

export const getResenasByUser = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'ID de usuario es obligatorio'
      });
    }

    const { data: resenas, error } = await supabase
      .from('resenas')
      .select('*, perfiles:usuario_id (nombre_completo, foto_url), publicaciones:publicacion_id (titulo)')
      .eq('evaluado_id', id)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: 'Error al obtener reseñas',
        details: error.message
      });
    }

    res.status(200).json({
      resenas,
      count: resenas.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

export const updateSolicitudEstado = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        error: 'Estado es obligatorio'
      });
    }

    if (!['pendiente', 'completada'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado debe ser "pendiente" o "completada"'
      });
    }

    const { data: solicitud, error } = await supabase
      .from('solicitudes')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error al actualizar estado de solicitud',
        details: error.message
      });
    }

    res.status(200).json({
      message: 'Estado de solicitud actualizado exitosamente',
      solicitud
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};
