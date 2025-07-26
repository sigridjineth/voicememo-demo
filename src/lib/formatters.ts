import { format, formatDistance, formatRelative, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DATE_FORMATS } from './constants';

export function formatDate(date: string | Date, formatType: keyof typeof DATE_FORMATS = 'MEDIUM') {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (formatType === 'RELATIVE') {
    return formatRelative(dateObj, new Date(), { locale: ko });
  }

  return format(dateObj, DATE_FORMATS[formatType], { locale: ko });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}초`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 
      ? `${minutes}분 ${remainingSeconds}초`
      : `${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}시간 ${remainingMinutes}분`
    : `${hours}시간`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return `오늘 ${format(dateObj, DATE_FORMATS.TIME_ONLY, { locale: ko })}`;
  }

  if (isYesterday(dateObj)) {
    return `어제 ${format(dateObj, DATE_FORMATS.TIME_ONLY, { locale: ko })}`;
  }

  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: ko });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function truncateText(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}