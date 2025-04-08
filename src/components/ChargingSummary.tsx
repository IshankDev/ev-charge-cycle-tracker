
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration } from '@/utils/calculations';
import { useSessions } from '@/hooks/useSessions';
import { Battery, Clock, Calendar } from 'lucide-react';

interface ChargingSummaryProps {
  details: {
    startPercentage: number;
    endPercentage: number;
    remainingPercentage: number;
    hoursToFullCharge: number;
    unitsRequired: number;
    totalCost: number;
  };
  onReset: () => void;
}

const ChargingSummary = ({ details, onReset }: ChargingSummaryProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { addSession, isAdding } = useSessions();

  const handleSaveSession = async () => {
    setIsSaving(true);
    
    const session = {
      startPercentage: details.startPercentage,
      endPercentage: details.endPercentage,
      duration: details.hoursToFullCharge,
      unitsConsumed: details.unitsRequired,
      cost: details.totalCost,
      date: new Date().toISOString()
    };
    
    try {
      await addSession(session);
      onReset();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Charging Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Start Level</span>
            <div className="flex items-center">
              <Battery className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-semibold">{details.startPercentage}%</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Target Level</span>
            <div className="flex items-center">
              <Battery className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-xl font-semibold">{details.endPercentage}%</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Remaining</span>
            <div className="flex items-center">
              <span className="text-xl font-semibold">{details.remainingPercentage}%</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Est. Time</span>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-semibold">{formatDuration(details.hoursToFullCharge)}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Units Required</span>
            <span className="text-xl font-semibold">{details.unitsRequired.toFixed(1)} units</span>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Estimated Cost</span>
            <span className="text-2xl font-bold">₹{details.totalCost.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleSaveSession} 
          className="w-full" 
          disabled={isSaving || isAdding}
        >
          {isSaving || isAdding ? 'Saving...' : 'Save Session'}
        </Button>
        <Button variant="outline" onClick={onReset} className="w-full">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChargingSummary;
