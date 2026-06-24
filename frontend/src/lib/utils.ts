import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number) {
  const amount = typeof value === 'string' ? Number.parseFloat(value) : value;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatRelativeTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'unknown';
  }

  const diff = date.getTime() - Date.now();
  const absoluteSeconds = Math.round(Math.abs(diff) / 1000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (absoluteSeconds < 60) return formatter.format(Math.round(diff / 1000), 'second');
  const absoluteMinutes = absoluteSeconds / 60;
  if (absoluteMinutes < 60) return formatter.format(Math.round(diff / 60000), 'minute');
  const absoluteHours = absoluteMinutes / 60;
  if (absoluteHours < 24) return formatter.format(Math.round(diff / 3600000), 'hour');
  const absoluteDays = absoluteHours / 24;
  return formatter.format(Math.round(diff / 86400000), 'day');
}

export function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
