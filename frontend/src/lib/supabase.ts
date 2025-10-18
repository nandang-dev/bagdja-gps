import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type User = {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export type Device = {
  id: string;
  user_id: string;
  name: string;
  avl: string;
  api_key: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type GpsData = {
  id: string;
  device_id: string;
  lat: number;
  lng: number;
  date_time: number;
  created_at: string;
}

