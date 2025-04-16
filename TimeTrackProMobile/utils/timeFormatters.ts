/**
 * Formats hours and minutes into a display string
 * @param hours Number of hours
 * @param minutes Number of minutes
 * @returns Formatted string like "8:30"
 */
export function formatTimeDisplay(hours: number, minutes: number): string {
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Parses a time string in format "HH:MM" into hours and minutes
 * @param timeString Time string in format "HH:MM"
 * @returns Object with hours and minutes
 */
export function parseTimeString(timeString: string): { hours: number; minutes: number } {
  const [hoursStr, minutesStr] = timeString.split(':');
  return {
    hours: parseInt(hoursStr, 10),
    minutes: parseInt(minutesStr, 10)
  };
}

/**
 * Calculates total minutes between start and end time
 * @param start Start time in format "HH:MM"
 * @param end End time in format "HH:MM"
 * @returns Total minutes
 */
export function calculateTotalMinutes(start: string, end: string): number {
  if (start === '00:00' && end === '00:00') {
    return 0; // Special case for day off, sick day, etc.
  }
  
  const startTime = parseTimeString(start);
  const endTime = parseTimeString(end);
  
  const startMinutes = startTime.hours * 60 + startTime.minutes;
  const endMinutes = endTime.hours * 60 + endTime.minutes;
  
  return endMinutes - startMinutes;
}

/**
 * Formats minutes into hours and minutes string
 * @param minutes Total minutes
 * @returns Formatted string like "8h 30m"
 */
export function formatMinutesToHours(minutes: number): string {
  if (minutes <= 0) return '0h 0m';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
}

/**
 * Calculates progress percentage for target vs worked time
 * @param workedMinutes Minutes worked
 * @param targetMinutes Target minutes
 * @returns Percentage value (0-100)
 */
export function getProgressPercentage(workedMinutes: number, targetMinutes: number): number {
  if (targetMinutes === 0) return 0;
  const percentage = (workedMinutes / targetMinutes) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
}