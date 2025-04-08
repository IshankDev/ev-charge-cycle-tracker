
import DashboardLayout from '@/layout/DashboardLayout';
import SessionList from '@/components/SessionList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Calendar, Wallet } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { generateMonthlyReport } from '@/utils/calculations';

const SessionHistory = () => {
  const { sessions } = useSessions();
  
  // Generate a summary report for all sessions
  const report = generateMonthlyReport(sessions);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
          <p className="text-muted-foreground">
            View and analyze your past charging sessions
          </p>
        </div>
        
        {sessions.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{report.sessionCount}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Battery className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{report.totalUnits.toFixed(1)}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">₹{report.totalCost.toFixed(2)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <SessionList />
      </div>
    </DashboardLayout>
  );
};

export default SessionHistory;
