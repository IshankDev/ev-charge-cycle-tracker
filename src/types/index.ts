
export interface ChargingSession {
  id?: string;
  userId?: string;
  startPercentage: number;
  endPercentage: number;
  duration: number; // in hours
  unitsConsumed: number; 
  cost: number; // in INR
  date: string; // ISO date string
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalUnits: number;
  totalCost: number;
  sessionCount: number;
}
