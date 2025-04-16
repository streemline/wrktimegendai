// Database schema for SQLite

export interface User {
  id?: number; 
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  profile_image: string;
  work_hours_per_day: number;
  break_minutes: number;
  auto_break: boolean;
  work_days: string; // JSON array as string
}

export interface TimeEntry {
  id?: number;
  userId: number;
  date: string; // ISO date string
  startTime: string; // 24h format "HH:MM"
  endTime: string; // 24h format "HH:MM"
  hourlyRate: number;
  notes: string;
  moodRating: number; // 1-5
  energyLevel: number; // 1-5
}

export interface MonthlyReport {
  id?: number;
  userId: number;
  year: number;
  month: number; // 1-12
  workDays: number;
  workedMinutes: number;
  targetMinutes: number;
  overtimeMinutes: number;
  vacationDays: number;
  carriedFromMinutes: number;
  carriedToMinutes: number;
}

// Default user for initialization
export const userInitialData: User = {
  username: "demo",
  password: "demo1234",
  full_name: "Demo User",
  email: "demo@example.com",
  phone: "+380123456789",
  position: "Software Developer",
  profile_image: "",
  work_hours_per_day: 8,
  break_minutes: 60,
  auto_break: true,
  work_days: JSON.stringify([1, 2, 3, 4, 5]) // Monday-Friday
};