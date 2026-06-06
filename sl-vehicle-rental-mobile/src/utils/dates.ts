// ============================================================================
// Date Utils - Date formatting and manipulation using date-fns
// ============================================================================

import {
  format,
  formatDistanceToNow,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  addDays,
  subDays,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  isValid,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from 'date-fns';

// Format date for display (e.g., "Jan 15, 2024")
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, 'MMM dd, yyyy') : 'Invalid date';
};

// Format date short (e.g., "Jan 15")
export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, 'MMM dd') : 'Invalid date';
};

// Format date with time (e.g., "Jan 15, 2024 3:30 PM")
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, 'MMM dd, yyyy h:mm a') : 'Invalid date';
};

// Format time only (e.g., "3:30 PM")
export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, 'h:mm a') : 'Invalid time';
};

// Format for API (ISO date string)
export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format for API with time
export const formatDateTimeForApi = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};

// Relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : 'Unknown';
};

// Calculate days between two dates
export const getDaysBetween = (start: string | Date, end: string | Date): number => {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInDays(e, s);
};

// Check if date range is valid
export const isValidDateRange = (start: Date, end: Date): boolean => {
  return isAfter(end, start);
};

// Check if date is in the past
export const isPast = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(d, new Date());
};

// Check if date is in the future
export const isFuture = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(d, new Date());
};

// Get booking duration text
export const getBookingDuration = (start: string | Date, end: string | Date): string => {
  const days = getDaysBetween(start, end);
  if (days === 1) return '1 day';
  return `${days} days`;
};

// Format date range (e.g., "Jan 15 - Jan 20, 2024")
export const formatDateRange = (start: string | Date, end: string | Date): string => {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  if (!isValid(s) || !isValid(e)) return 'Invalid range';

  if (isSameDay(s, e)) {
    return format(s, 'MMM dd, yyyy');
  }

  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  if (sameMonth) {
    return `${format(s, 'MMM dd')} - ${format(e, 'dd, yyyy')}`;
  }

  if (sameYear) {
    return `${format(s, 'MMM dd')} - ${format(e, 'MMM dd, yyyy')}`;
  }

  return `${format(s, 'MMM dd, yyyy')} - ${format(e, 'MMM dd, yyyy')}`;
};

// Check if a date is available (not in blocked dates)
export const isDateAvailable = (
  date: Date,
  blockedDates: string[],
  bookedRanges: { startDate: string; endDate: string }[]
): boolean => {
  const dateStr = formatDateForApi(date);
  if (blockedDates.includes(dateStr)) return false;

  return !bookedRanges.some((range) => {
    const start = startOfDay(parseISO(range.startDate));
    const end = endOfDay(parseISO(range.endDate));
    return isWithinInterval(date, { start, end });
  });
};

// Get time ago in a human-readable format (shorter)
export const getTimeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Unknown';

  const minutes = differenceInMinutes(new Date(), d);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = differenceInHours(new Date(), d);
  if (hours < 24) return `${hours}h ago`;

  const days = differenceInDays(new Date(), d);
  if (days < 7) return `${days}d ago`;

  return formatDate(d);
};

// Export commonly used date-fns functions
export {
  addDays,
  subDays,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  isValid,
  startOfDay,
  endOfDay,
  isWithinInterval,
};
