
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signIn, signUp, signOut, getCurrentUser, getSession } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { AuthState, User } from '@/types';

// Create auth context
const AuthContext = createContext<{
  user: User | null;
  session: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  session: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check for existing session
        const session = await getSession();
        const user = session ? await getCurrentUser() : null;
        
        setState({
          user: user ? { id: user.id, email: user.email || '' } : null,
          session,
          loading: false,
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({ ...state, loading: false });
      }
    };

    initialize();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = await getCurrentUser();
          setState({
            user: user ? { id: user.id, email: user.email || '' } : null,
            session,
            loading: false,
          });
        } else {
          setState({ user: null, session: null, loading: false });
        }
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { session, user } = await signIn(email, password);
      setState({
        user: user ? { id: user.id, email: user.email || '' } : null,
        session,
        loading: false,
      });
      toast({
        title: 'Logged in successfully',
        description: `Welcome back, ${email}!`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
      });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { user } = await signUp(email, password);
      toast({
        title: 'Registration successful',
        description: 'Please check your email for verification',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setState({ user: null, session: null, loading: false });
      toast({
        title: 'Logged out successfully',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        session: state.session,
        loading: state.loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
