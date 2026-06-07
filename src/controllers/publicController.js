import { createSupabaseClient } from '../config/supabase.js';

/**
 * Lista publicaciones activas del tablón con filtros opcionales por categoría y búsqueda.
 * @param {import('express').Request} req - Query opcional: categoria, search
 * @param {import('express').Response} res - Respuesta 200 con publications y count
 * @returns {Promise<void>}
 */
export const getAllPublications = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { categoria, search } = req.query;

    let query = supabase
      .from('publicaciones')
      .select('*, perfiles:usuario_id (id, nombre_completo, correo_electronico, foto_url)')
      .eq('estado', 'activa')
      .order('fecha_creacion', { ascending: false });

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    if (search) {
      const searchPattern = '%'+search+'%';
      query = query.or('titulo.ilike.'+searchPattern+',descripcion.ilike.'+searchPattern);
    }

    const { data: publications, error } = await query;

    if (error) {
      return res.status(500).json({
        error: 'Error al obtener publicaciones',
        details: error.message
      });
    }

    res.status(200).json({
      publications,
      count: publications.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

/**
 * Obtiene el detalle de una publicación por su identificador.
 * @param {import('express').Request} req - Param id (UUID de la publicación)
 * @param {import('express').Response} res - Respuesta 200 con publication o 404
 * @returns {Promise<void>}
 */
export const getPublicationById = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { id } = req.params;

    const { data: publication, error } = await supabase
      .from('publicaciones')
      .select('*, perfiles:usuario_id (nombre_completo, correo_electronico, foto_url, direccion)')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        error: 'Publicación no encontrada',
        details: error.message
      });
    }

    res.status(200).json({ publication });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

/**
 * Crea una publicación en el tablón comunitario y genera notificaciones para otros vecinos.
 * @param {import('express').Request} req - Cuerpo con titulo, descripcion, categoria, usuario_id, telefono
 * @param {import('express').Response} res - Respuesta 201 con publication creada
 * @returns {Promise<void>}
 */
export const createPublication = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { titulo, descripcion, categoria, foto_url, usuario_id, telefono } = req.body;

    if (!descripcion || !categoria || !usuario_id) {
      return res.status(400).json({
        error: 'Descripción, categoría y usuario_id son obligatorios'
      });
    }

    const categoriasValidas = ['Servicios', 'Favores', 'Préstamos'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        error: 'Categoría no válida. Debe ser: Servicios, Favores o Préstamos'
      });
    }

    const { data: publication, error } = await supabase
      .from('publicaciones')
      .insert([{
        titulo,
        descripcion,
        categoria,
        foto_url,
        usuario_id,
        telefono,
        estado: 'activa'
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error al crear publicación',
        details: error.message
      });
    }

    // Crear notificaciones para todos los usuarios excepto el que publicó
    try {
      const { data: usuarios } = await supabase
        .from('perfiles')
        .select('id')
        .neq('id', usuario_id);

      if (usuarios && usuarios.length > 0) {
        const notificaciones = usuarios.map(usuario => ({
          usuario_id: usuario.id,
          publicacion_id: publication.id,
          titulo_publicacion: titulo
        }));

        await supabase
          .from('notificaciones')
          .insert(notificaciones);
      }
    } catch (notifError) {
      console.error('Error al crear notificaciones:', notifError);
      // No fallar la publicación si las notificaciones fallan
    }

    res.status(201).json({
      message: 'Publicación creada exitosamente',
      publication
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

/**
 * Actualiza los campos editables de una publicación existente.
 * @param {import('express').Request} req - Param id y cuerpo con campos a modificar
 * @param {import('express').Response} res - Respuesta 200 con publication actualizada
 * @returns {Promise<void>}
 */
export const updatePublication = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { id } = req.params;
    const { titulo, descripcion, categoria, foto_url, estado, telefono } = req.body;

    const { data: publication, error } = await supabase
      .from('publicaciones')
      .update({
        titulo,
        descripcion,
        categoria,
        foto_url,
        telefono,
        estado,
        fecha_actualizacion: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error al actualizar publicación',
        details: error.message
      });
    }

    res.status(200).json({
      message: 'Publicación actualizada exitosamente',
      publication
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

/**
 * Elimina permanentemente una publicación del tablón.
 * @param {import('express').Request} req - Param id (UUID)
 * @param {import('express').Response} res - Respuesta 200 con mensaje de confirmación
 * @returns {Promise<void>}
 */
export const deletePublication = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('publicaciones')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        error: 'Error al eliminar publicación',
        details: error.message
      });
    }

    res.status(200).json({
      message: 'Publicación eliminada exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

/**
 * Obtiene las notificaciones de nuevas publicaciones para un vecino.
 * @param {import('express').Request} req - Query param usuario_id
 * @param {import('express').Response} res - Respuesta 200 con notifications y count
 * @returns {Promise<void>}
 */
export const getNotifications = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({
        error: 'usuario_id es obligatorio'
      });
    }

    const { data: notifications, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', usuario_id)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: 'Error al obtener notificaciones',
        details: error.message
      });
    }

    res.status(200).json({
      notifications,
      count: notifications.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

/**
 * Lista todas las publicaciones creadas por un vecino específico.
 * @param {import('express').Request} req - Param usuario_id (UUID)
 * @param {import('express').Response} res - Respuesta 200 con publications y count
 * @returns {Promise<void>}
 */
export const getUserPublications = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({
        error: 'usuario_id es obligatorio'
      });
    }

    const { data: publications, error } = await supabase
      .from('publicaciones')
      .select('*, perfiles:usuario_id (nombre_completo, correo_electronico, foto_url)')
      .eq('usuario_id', usuario_id)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: 'Error al obtener publicaciones del usuario',
        details: error.message
      });
    }

    res.status(200).json({
      publications,
      count: publications.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};