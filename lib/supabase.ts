import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sgkzbzopwzmktcoawnmx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNna3piem9wd3pta3Rjb2F3bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDc4NTgsImV4cCI6MjA4NzUyMzg1OH0.By9Afsd6sy3x0pfECe4vyVlJFb3-5Ida3GNTWdngATs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
