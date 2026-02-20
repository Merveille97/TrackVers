import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qpkcuorzviapweeiseje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwa2N1b3J6dmlhcHdlZWlzZWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODc3NzcsImV4cCI6MjA3ODk2Mzc3N30.qO4RN500tMfiiHUDLeJ5gjeBDOUYnzTLvTn5nqdN-bU';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
