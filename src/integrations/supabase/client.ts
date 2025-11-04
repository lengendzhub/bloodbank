import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hardcoded values for production
const SUPABASE_URL = 'https://glcnyificwdcdzwfzcnn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY255aWZpY3dkY2R6d2Z6Y25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDY5MTMsImV4cCI6MjA3NzgyMjkxM30.j5Wy5tczcujbq6alo62BJtIgCUWXzvSz08_X5BpXXMg';

if (!SUPABASE_URL) throw new Error('Supabase URL is not configured');
if (!SUPABASE_KEY) throw new Error('Supabase Key is not configured');

// For debugging
console.log('Supabase Configuration:', {
  url: SUPABASE_URL,
  environment: import.meta.env.MODE,
  hasKey: !!SUPABASE_KEY
});

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
