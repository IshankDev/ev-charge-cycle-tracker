
import { Card, CardContent } from '@/components/ui/card';
import { ChargingSession } from '@/types';
import { formatDate, formatDuration } from '@/utils/calculations';
import { Battery, Clock, Calendar } from 'lucide-react';

interface SessionCardProps {
  session: ChargingSession;
}

const SessionCard = ({ session }: SessionCardProps) => {
  // Make sure we have session.id defined for the key prop
  const sessionId = session.id || '';
  
  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(session.date)}
          </div>
          <div className="text-sm font-medium">
            ₹{session.cost.toFixed(2)}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Battery className="h-4 w-4 text-red-500" />
            </div>
            <div className="font-semibold">{session.startPercentage}%</div>
            <div className="text-xs text-muted-foreground">Start</div>
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="font-semibold">{formatDuration(session.duration)}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-1">
              <Battery className="h-4 w-4 text-green-500" />
            </div>
            <div className="font-semibold">{session.endPercentage}%</div>
            <div className="text-xs text-muted-foreground">End</div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {session.unitsConsumed.toFixed(1)} units
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
