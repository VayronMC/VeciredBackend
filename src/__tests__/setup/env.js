import dotenv from 'dotenv';

dotenv.config();

process.env.SUPABASE_URL ||= 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'test-service-role-key';
process.env.NODE_ENV ||= 'test';
