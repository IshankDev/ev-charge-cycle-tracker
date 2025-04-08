
import { Button } from '@/components/ui/button';
import { ChargingSession, MonthlyReport } from '@/types';
import { Download } from 'lucide-react';
import { generateMonthlyReport, reportToCsv } from '@/utils/calculations';

interface DownloadReportProps {
  sessions: ChargingSession[];
  month?: number;
  year?: number;
}

const DownloadReport = ({ sessions, month, year }: DownloadReportProps) => {
  const handleDownload = () => {
    // Generate report data
    const report = generateMonthlyReport(sessions);
    
    // Convert to CSV
    const csv = reportToCsv(report, sessions);
    
    // Create downloadable blob
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    
    // Set filename with month and year if provided
    let filename = 'charging-report';
    if (month && year) {
      const date = new Date(year, month - 1);
      filename += `-${date.toLocaleString('default', { month: 'short' })}-${year}`;
    } else {
      filename += `-all-sessions`;
    }
    
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Button 
      onClick={handleDownload} 
      variant="outline" 
      size="sm"
      className="flex items-center gap-1"
    >
      <Download size={14} />
      Download Report
    </Button>
  );
};

export default DownloadReport;
