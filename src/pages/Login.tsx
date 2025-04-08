
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { BatteryCharging } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const Login = () => {
  const { user, loading } = useAuth();

  // If user is already authenticated, redirect to the dashboard
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BatteryCharging className="h-6 w-6" />
          <span className="text-xl font-bold">EV Charge Tracker</span>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to track your EV charging
            </p>
          </div>
          
          <AuthForm />
        </div>
      </main>
      
      <footer className="p-4 md:p-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} EV Charge Tracker • All rights reserved
      </footer>
    </div>
  );
};

export default Login;
