
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface MonthlyFilterProps {
  onChange: (month: number, year: number) => void;
}

const MonthlyFilter = ({ onChange }: MonthlyFilterProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
    
    if (selectedDate) {
      // Month is 0-indexed in JS Date, so add 1
      onChange(selectedDate.getMonth() + 1, selectedDate.getFullYear());
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-auto justify-start gap-2">
          <Calendar size={16} />
          {date ? format(date, 'MMMM yyyy') : "Filter by Month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          // Show only month and year in the calendar
          captionLayout="dropdown-buttons"
          fromYear={2020}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MonthlyFilter;
