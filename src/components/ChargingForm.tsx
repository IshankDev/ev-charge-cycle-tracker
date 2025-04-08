
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculateChargingDetails } from '@/utils/calculations';
import { Slider } from '@/components/ui/slider';
import { ChargingSession } from '@/types';

interface ChargingFormProps {
  onCalculate: (details: any) => void;
}

const ChargingForm = ({ onCalculate }: ChargingFormProps) => {
  const [startPercentage, setStartPercentage] = useState<number>(20);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      setStartPercentage(0);
      return;
    }
    
    if (parsed < 0) {
      setStartPercentage(0);
      setError('Starting percentage cannot be negative');
    } else if (parsed > 99) {
      setStartPercentage(99);
      setError('Starting percentage must be less than 100');
    } else {
      setStartPercentage(parsed);
      setError(null);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setStartPercentage(value[0]);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const details = calculateChargingDetails(startPercentage);
      onCalculate(details);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start Charging</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="batteryLevel" className="text-sm font-medium">
              Current Battery Level: {startPercentage}%
            </label>
            
            <div className="pt-4 pb-2">
              <Slider
                defaultValue={[startPercentage]}
                max={99}
                min={0}
                step={1}
                onValueChange={handleSliderChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                id="batteryLevel"
                type="number"
                value={startPercentage}
                onChange={(e) => handleInputChange(e.target.value)}
                min={0}
                max={99}
                className="w-24"
              />
              <span className="text-sm">%</span>
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          
          <Button type="submit" className="w-full">
            Calculate Charge
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChargingForm;
