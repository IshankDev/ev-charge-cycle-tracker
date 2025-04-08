
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChargingForm from '@/components/ChargingForm';
import ChargingSummary from '@/components/ChargingSummary';
import DashboardLayout from '@/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useSessions } from '@/hooks/useSessions';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SessionCard from '@/components/SessionCard';

const Index = () => {
  const [calculationDetails, setCalculationDetails] = useState<any>(null);
  const { user } = useAuth();
  const { sessions } = useSessions();
  
  // Take only the 3 most recent sessions
  const recentSessions = sessions.slice(0, 3);

  const handleCalculate = (details: any) => {
    setCalculationDetails(details);
  };

  const handleReset = () => {
    setCalculationDetails(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track and manage your EV charging sessions
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {calculationDetails ? (
            <ChargingSummary 
              details={calculationDetails} 
              onReset={handleReset} 
            />
          ) : (
            <ChargingForm onCalculate={handleCalculate} />
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>
                  Your latest charging sessions
                </CardDescription>
              </div>
              <Link 
                to="/history" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No charging sessions yet</p>
                  <p className="text-sm mt-1">
                    Use the form to record your first session
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
