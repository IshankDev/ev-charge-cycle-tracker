
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSessions, fetchSessionsByMonth, saveSession } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ChargingSession } from '@/types';

export const useSessions = (month?: number, year?: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Fetch all sessions or sessions for a specific month
  const sessionsQuery = useQuery({
    queryKey: ['sessions', userId, month, year],
    queryFn: async () => {
      if (!userId) return [];
      
      let data;
      if (month !== undefined && year !== undefined) {
        data = await fetchSessionsByMonth(userId, month, year);
      } else {
        data = await fetchSessions(userId);
      }
      
      // Map database column names to our frontend model
      return data.map((item: any) => ({
        id: item.id,
        userId: item.userid,
        startPercentage: item.startpercentage,
        endPercentage: item.endpercentage,
        duration: item.duration,
        unitsConsumed: item.unitsconsumed,
        cost: item.cost,
        date: item.date,
        createdAt: item.createdat
      }));
    },
    enabled: !!userId,
  });

  // Mutation for adding a new session
  const addSessionMutation = useMutation({
    mutationFn: (newSession: ChargingSession) => {
      const sessionWithUser = {
        ...newSession,
        userId,
        date: newSession.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      return saveSession(sessionWithUser);
    },
    onSuccess: () => {
      toast({
        title: 'Session saved',
        description: 'Your charging session has been recorded',
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save charging session',
      });
    },
  });

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    addSession: addSessionMutation.mutate,
    isAdding: addSessionMutation.isPending,
  };
};
