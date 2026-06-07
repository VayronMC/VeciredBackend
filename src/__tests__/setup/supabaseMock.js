/**
 * Factory de mocks encadenables compatible con await de Supabase PostgREST.
 */
export function createQueryBuilder(result = { data: null, error: null }) {
  const builder = {
    select: jest.fn(function select() {
      return builder;
    }),
    eq: jest.fn(function eq() {
      return builder;
    }),
    neq: jest.fn(function neq() {
      return builder;
    }),
    or: jest.fn(function or() {
      return builder;
    }),
    order: jest.fn(function order() {
      return builder;
    }),
    insert: jest.fn(function insert() {
      return builder;
    }),
    update: jest.fn(function update() {
      return builder;
    }),
    delete: jest.fn(function del() {
      return builder;
    }),
    single: jest.fn(function single() {
      return Promise.resolve(result);
    }),
    then(onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return Promise.resolve(result).catch(onRejected);
    },
  };

  return builder;
}

const DEFAULT_TABLES = {
  perfiles: {
    select: {
      data: [
        { id: 'other-user-id', nombre_completo: 'Otro Usuario' },
        { id: 'test-user-id', nombre_completo: 'Usuario Test', correo_electronico: 'test@example.com', direccion: 'Dir Test', foto_url: null, biografia: null },
      ],
      error: null,
    },
    insert: {
      data: {
        id: 'test-user-id',
        nombre_completo: 'Usuario Test',
        correo_electronico: 'test@example.com',
        direccion: 'Dir Test',
        foto_url: null,
      },
      error: null,
    },
    update: {
      data: {
        id: 'test-user-id',
        nombre_completo: 'Actualizado',
        correo_electronico: 'test@example.com',
        direccion: 'Dir Actualizada',
        foto_url: null,
        biografia: 'Biografia',
      },
      error: null,
    },
  },
  publicaciones: {
    select: {
      data: [
        {
          id: 'test-publication-id',
          titulo: 'Titulo Test',
          descripcion: 'Descripcion Test',
          categoria: 'Servicios',
          estado: 'activa',
          usuario_id: 'test-user-id',
        },
      ],
      error: null,
    },
    insert: {
      data: {
        id: 'new-publication-id',
        titulo: 'Titulo Test',
        descripcion: 'Descripcion Test',
        categoria: 'Servicios',
        estado: 'activa',
        usuario_id: 'test-user-id',
      },
      error: null,
    },
    update: {
      data: {
        id: 'test-publication-id',
        titulo: 'Titulo Actualizado',
        descripcion: 'Descripcion Actualizada',
        categoria: 'Servicios',
        estado: 'activa',
      },
      error: null,
    },
    delete: { data: null, error: null },
  },
  notificaciones: {
    select: {
      data: [{ id: 'notif-1', usuario_id: 'test-user-id', mensaje: 'Nueva publicacion' }],
      error: null,
    },
    insert: { data: null, error: null },
  },
  resenas: {
    select: {
      data: [{ id: 'test-resena-id', calificacion: 5, evaluado_id: 'test-user-id' }],
      error: null,
    },
    insert: {
      data: { id: 'new-resena-id', calificacion: 5, comentario: 'Excelente' },
      error: null,
    },
  },
  solicitudes: {
    select: {
      data: [
        {
          id: 'test-solicitud-id',
          usuario_id: 'test-user-id',
          publicacion_id: 'test-publication-id',
          estado: 'activa',
        },
      ],
      error: null,
    },
    selectSingle: {
      data: null,
      error: { message: 'No rows found', code: 'PGRST116' },
    },
    insert: {
      data: {
        id: 'new-solicitud-id',
        usuario_id: 'test-user-id',
        publicacion_id: 'test-publication-id',
        estado: 'activa',
      },
      error: null,
    },
    update: {
      data: { id: 'test-solicitud-id', estado: 'completada' },
      error: null,
    },
  },
};

const DEFAULT_AUTH = {
  createUser: {
    data: { user: { id: 'test-user-id', email: 'test@example.com' } },
    error: null,
  },
  listUsers: { data: { users: [] }, error: null },
  updateUserById: { error: null },
  signInWithPassword: {
    data: {
      user: { id: 'test-user-id', email: 'test@example.com' },
      session: {
        access_token: 'test-token',
        refresh_token: 'test-refresh',
        expires_at: 9999999999,
      },
    },
    error: null,
  },
};

function resolveConfigValue(value) {
  return typeof value === 'function' ? value() : value;
}

/**
 * Crea un cliente Supabase mockeado configurable por tabla y auth.
 */
export function createMockSupabase(config = {}) {
  const tables = { ...DEFAULT_TABLES, ...(config.tables || {}) };
  const authConfig = { ...DEFAULT_AUTH, ...(config.auth || {}) };

  const getTableResult = (table, operation) => {
    const tableConfig = tables[table] || {};
    const operationResult = tableConfig[operation] ?? { data: null, error: null };
    return resolveConfigValue(operationResult);
  };

  const getSingleResult = (table, operation) => {
    const tableConfig = tables[table] || {};
    if (tableConfig[`${operation}Single`] !== undefined) {
      return resolveConfigValue(tableConfig[`${operation}Single`]);
    }
    return getTableResult(table, operation);
  };

  return {
    from: jest.fn((table) => ({
      select: jest.fn(() => {
        const result = getTableResult(table, 'select');
        const builder = createQueryBuilder(result);
        builder.single = jest.fn(() => Promise.resolve(getSingleResult(table, 'select')));
        return builder;
      }),
      insert: jest.fn(() => {
        const result = getTableResult(table, 'insert');
        const builder = createQueryBuilder(result);
        builder.single = jest.fn(() => Promise.resolve(getSingleResult(table, 'insert')));
        return builder;
      }),
      update: jest.fn(() => {
        const result = getTableResult(table, 'update');
        const builder = createQueryBuilder(result);
        builder.single = jest.fn(() => Promise.resolve(getSingleResult(table, 'update')));
        return builder;
      }),
      delete: jest.fn(() => createQueryBuilder(getTableResult(table, 'delete'))),
    })),
    auth: {
      admin: {
        createUser: jest.fn(() => Promise.resolve(resolveConfigValue(authConfig.createUser))),
        listUsers: jest.fn(() => Promise.resolve(resolveConfigValue(authConfig.listUsers))),
        updateUserById: jest.fn(() => Promise.resolve(resolveConfigValue(authConfig.updateUserById))),
      },
      signInWithPassword: jest.fn(() =>
        Promise.resolve(resolveConfigValue(authConfig.signInWithPassword)),
      ),
    },
  };
}

export const defaultMockSupabase = () => createMockSupabase();
