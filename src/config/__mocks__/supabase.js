import { createMockSupabase } from '../../__tests__/setup/supabaseMock.js';

export const createSupabaseClient = jest.fn(() => createMockSupabase());

export const supabase = createSupabaseClient();
