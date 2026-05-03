import { supabase } from '../config/supabase.js';

export const register = async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, direccion, contraseña } = req.body;

    // Validar campos obligatorios
    if (!nombre_completo || !correo_electronico || !direccion || !contraseña) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios excepto la foto de perfil'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
      return res.status(400).json({
        error: 'El formato del correo electrónico no es válido'
      });
    }

    // Validar longitud de contraseña
    if (contraseña.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo_electronico,
      password: contraseña,
      options: {
        data: {
          nombre_completo,
          direccion
        }
      }
    });

    if (authError) {
      console.error('Error en autenticación:', authError);
      return res.status(400).json({
        error: 'Error al registrar usuario en autenticación',
        details: authError.message
      });
    }

    // Crear perfil en la tabla perfiles
    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles')
      .insert([
        {
          id: authData.user.id,
          nombre_completo,
          correo_electronico,
          direccion
        }
      ])
      .select()
      .single();

    if (perfilError) {
      console.error('Error al crear perfil:', perfilError);
      // Intentar eliminar el usuario de auth si falló la creación del perfil
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return res.status(500).json({
        error: 'Error al crear el perfil del usuario',
        details: perfilError.message
      });
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        perfil: perfilData
      }
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};
