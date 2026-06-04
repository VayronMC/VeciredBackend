import { createSupabaseClient } from '../config/supabase.js';

export const register = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { nombre_completo, correo_electronico, direccion, contraseña, foto_perfil } = req.body;

    // Validar campos obligatorios
    if (!nombre_completo || !correo_electronico || !direccion || !contraseña) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
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

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: correo_electronico,
      password: contraseña,
      email_confirm: true,
      user_metadata: {
        nombre_completo,
        direccion
      }
    });

    if (authError) {
      return res.status(400).json({
        error: 'Error al registrar usuario en autenticación',
        details: authError.message
      });
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles')
      .insert([{
        id: authData.user.id,
        nombre_completo,
        correo_electronico,
        direccion,
        foto_url: foto_perfil || null
      }])
      .select()
      .single();

    if (perfilError) {
      return res.status(500).json({
        error: 'Error al crear perfil de usuario',
        details: perfilError.message
      });
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nombre_completo: perfilData.nombre_completo,
        direccion: perfilData.direccion,
        foto_url: perfilData.foto_url
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

export const login = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { correo_electronico, contraseña } = req.body;

    // Validar campos obligatorios
    if (!correo_electronico || !contraseña) {
      return res.status(400).json({
        error: 'Correo electrónico y contraseña son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
      return res.status(400).json({
        error: 'El formato del correo electrónico no es válido'
      });
    }

    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: correo_electronico,
      password: contraseña
    });

    if (authError) {
      if (authError.message.includes('Email not confirmed')) {
        try {
          const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
          
          if (!listError && userList.users) {
            const user = userList.users.find(u => u.email === correo_electronico);
            
            if (user) {
              const { error: confirmError } = await supabase.auth.admin.updateUserById(
                user.id,
                { email_confirm: true }
              );
              
              if (!confirmError) {
                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                  email: correo_electronico,
                  password: contraseña
                });
                
                if (!retryError) {
                  authData = retryData;
                  authError = null;
                }
              }
            }
          }
        } catch (confirmErr) {
          // Continuar con el error original si la confirmación falla
        }
      }
      
      if (authError) {
        return res.status(400).json({
          error: 'Credenciales incorrectas',
          details: authError.message
        });
      }
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (perfilError) {
      return res.status(500).json({
        error: 'Error al obtener perfil de usuario',
        details: perfilError.message
      });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nombre_completo: perfilData.nombre_completo,
        direccion: perfilData.direccion,
        foto_url: perfilData.foto_url
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({
        error: 'usuario_id es obligatorio'
      });
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', usuario_id)
      .single();

    if (perfilError) {
      return res.status(404).json({
        error: 'Perfil no encontrado',
        details: perfilError.message
      });
    }

    res.status(200).json({
      profile: perfilData
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  const supabase = createSupabaseClient();
  
  try {
    const { usuario_id, nombre_completo, correo_electronico, direccion, biografia, foto_url } = req.body;

    if (!usuario_id) {
      return res.status(400).json({
        error: 'usuario_id es obligatorio'
      });
    }

    const updateData = {};
    if (nombre_completo) updateData.nombre_completo = nombre_completo;
    if (correo_electronico) updateData.correo_electronico = correo_electronico;
    if (direccion) updateData.direccion = direccion;
    if (biografia !== undefined) updateData.biografia = biografia;
    if (foto_url !== undefined) updateData.foto_url = foto_url;

    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles')
      .update(updateData)
      .eq('id', usuario_id)
      .select()
      .single();

    if (perfilError) {
      return res.status(500).json({
        error: 'Error al actualizar perfil',
        details: perfilError.message
      });
    }

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      profile: perfilData
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};
