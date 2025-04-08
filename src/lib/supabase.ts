
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: In a real app, these would come from environment variables
// For Lovable + Supabase integration, these will be provided by the integration
const supabaseUrl = 'SUPABASE_URL'; // Will be replaced by Supabase integration
const supabaseAnonKey = 'SUPABASE_ANON_KEY'; // Will be replaced by Supabase integration

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const TABLE_NAMES = {
  SESSIONS: 'charging_sessions'
};

// Session management functions
export const fetchSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from(TABLE_NAMES.SESSIONS)
    .select('*')
    .eq('userId', userId)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchSessionsByMonth = async (userId: string, month: number, year: number) => {
  // Create date range for the selected month
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from(TABLE_NAMES.SESSIONS)
    .select('*')
    .eq('userId', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const saveSession = async (session: any) => {
  const { data, error } = await supabase
    .from(TABLE_NAMES.SESSIONS)
    .insert([session]);
    
  if (error) throw error;
  return data;
};

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};
