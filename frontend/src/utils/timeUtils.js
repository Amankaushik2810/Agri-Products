// ✅ Updated timeUtils.js
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export const formatToIST = (utcDateString) => {
  try {
    const timeZone = 'Asia/Kolkata';
    const zonedDate = toZonedTime(utcDateString, timeZone);
    return formatInTimeZone(zonedDate, timeZone, 'dd-MM-yyyy hh:mm a');
  } catch (error) {
    console.error('Failed to format date:', error);
    return utcDateString;
  }
};
