
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, BatteryCharging } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BatteryCharging className="h-6 w-6" />
          <Link to="/" className="text-xl font-bold">
            EV Charge Tracker
          </Link>
        </div>

        {user && (
          <nav className="hidden md:flex gap-6 mr-auto ml-10">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/history' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Session History
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => logout()}
              aria-label="Logout"
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
