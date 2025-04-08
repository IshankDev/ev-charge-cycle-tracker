
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { ChargingSession } from '@/types';

// Session management functions
export const fetchSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('charging_sessions')
    .select('*')
    .eq('userid', userId) // Note: column name is 'userid' (lowercase) in the database
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const fetchSessionsByMonth = async (userId: string, month: number, year: number) => {
  // Create date range for the selected month
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('charging_sessions')
    .select('*')
    .eq('userid', userId) // Note: column name is 'userid' (lowercase) in the database
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const saveSession = async (session: ChargingSession) => {
  // Ensure data formatting matches database column names
  const formattedSession = {
    userid: session.userId, // Convert to lowercase to match database column
    startpercentage: session.startPercentage,
    endpercentage: session.endPercentage,
    duration: session.duration,
    unitsconsumed: session.unitsConsumed,
    cost: session.cost,
    date: session.date,
    createdat: session.createdAt || new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('charging_sessions')
    .insert([formattedSession]);
    
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
