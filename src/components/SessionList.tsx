
import { useState } from 'react';
import { useSessions } from '@/hooks/useSessions';
import SessionCard from '@/components/SessionCard';
import { ChargingSession } from '@/types';
import MonthlyFilter from '@/components/MonthlyFilter';
import DownloadReport from '@/components/DownloadReport';
import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SessionList = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const { sessions, isLoading } = useSessions(selectedMonth, selectedYear);

  const handleFilterChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const clearFilters = () => {
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <MonthlyFilter onChange={handleFilterChange} />
        
        <div className="flex items-center gap-2">
          {(selectedMonth && selectedYear) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <FilterX size={14} />
              Clear Filter
            </Button>
          )}
          
          {sessions.length > 0 && (
            <DownloadReport 
              sessions={sessions} 
              month={selectedMonth} 
              year={selectedYear} 
            />
          )}
        </div>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No charging sessions found</p>
          {(selectedMonth && selectedYear) && (
            <p className="text-sm mt-2">
              Try selecting a different month or{" "}
              <button 
                onClick={clearFilters}
                className="text-primary underline"
              >
                clear the filter
              </button>
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session: ChargingSession) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionList;
