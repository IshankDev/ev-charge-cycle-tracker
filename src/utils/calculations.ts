
/**
 * Calculate charging details based on starting percentage
 * @param startPercentage - Starting battery percentage (0-100)
 * @returns Charging calculation details
 */
export const calculateChargingDetails = (startPercentage: number) => {
  // Validate input
  if (startPercentage < 0 || startPercentage > 100) {
    throw new Error('Starting percentage must be between 0 and 100');
  }

  // Constants
  const FULL_CHARGE = 100;
  const PERCENTAGE_PER_HOUR = 10; // 10% per hour
  const UNITS_PER_TEN_PERCENT = 1; // 1 unit per 10%
  const COST_PER_UNIT = 10; // ₹10 per unit

  // Calculations
  const remainingPercentage = FULL_CHARGE - startPercentage;
  const hoursToFullCharge = remainingPercentage / PERCENTAGE_PER_HOUR;
  const unitsRequired = (remainingPercentage / 10) * UNITS_PER_TEN_PERCENT;
  const totalCost = unitsRequired * COST_PER_UNIT;

  return {
    startPercentage,
    endPercentage: FULL_CHARGE,
    remainingPercentage,
    hoursToFullCharge,
    unitsRequired,
    totalCost
  };
};

/**
 * Format hours to a readable duration string
 * @param hours - Number of hours
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (hours: number): string => {
  const fullHours = Math.floor(hours);
  const minutes = Math.round((hours - fullHours) * 60);
  
  if (fullHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${fullHours}h`;
  } else {
    return `${fullHours}h ${minutes}m`;
  }
};

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Apr 8, 2025")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Group sessions by month and year
 * @param sessions - Array of charging sessions
 * @returns Object with month-year keys and arrays of sessions
 */
export const groupSessionsByMonth = (sessions: any[]) => {
  const grouped: Record<string, any[]> = {};
  
  sessions.forEach(session => {
    const date = new Date(session.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(session);
  });
  
  return grouped;
};

/**
 * Generate monthly report data
 * @param sessions - Array of charging sessions for a specific month
 * @returns Monthly report object
 */
export const generateMonthlyReport = (sessions: any[]): MonthlyReport => {
  if (!sessions || sessions.length === 0) {
    return {
      month: '',
      year: 0,
      totalUnits: 0,
      totalCost: 0,
      sessionCount: 0
    };
  }
  
  const date = new Date(sessions[0].date);
  const totalUnits = sessions.reduce((sum, session) => sum + session.unitsConsumed, 0);
  const totalCost = sessions.reduce((sum, session) => sum + session.cost, 0);
  
  return {
    month: date.toLocaleString('default', { month: 'long' }),
    year: date.getFullYear(),
    totalUnits,
    totalCost,
    sessionCount: sessions.length
  };
};

/**
 * Convert monthly report to CSV format
 * @param report - Monthly report object
 * @param sessions - Array of charging sessions
 * @returns CSV string
 */
export const reportToCsv = (report: MonthlyReport, sessions: any[]) => {
  const headerRow = 'Date,Start %,End %,Duration (hours),Units Consumed,Cost (₹)';
  
  const dataRows = sessions.map(session => {
    return `${formatDate(session.date)},${session.startPercentage},${session.endPercentage},${session.duration},${session.unitsConsumed},${session.cost}`;
  }).join('\n');
  
  const summaryRow = `\n\nMonthly Summary for ${report.month} ${report.year}\nTotal Sessions,${report.sessionCount}\nTotal Units Consumed,${report.totalUnits}\nTotal Cost (₹),${report.totalCost}`;
  
  return `${headerRow}\n${dataRows}${summaryRow}`;
};
