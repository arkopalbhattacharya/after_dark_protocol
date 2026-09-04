export interface CipherDate {
  day: number;
  month: number; // 1 to 12
  year: number;
}

export const DEFAULT_CIPHER_DATE: CipherDate = {
  day: 31,
  month: 8, // August
  year: 2007
};

export const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER'
];

export const MONTH_ABBR = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const STORAGE_KEY = 'after_dark_jennifer_pass_date';

export function getStoredCipherPassDate(): CipherDate {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CIPHER_DATE };
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.day === 'number' &&
      typeof parsed?.month === 'number' &&
      typeof parsed?.year === 'number'
    ) {
      return {
        day: Math.min(31, Math.max(1, parsed.day)),
        month: Math.min(12, Math.max(1, parsed.month)),
        year: parsed.year
      };
    }
  } catch (err) {
    console.warn('Failed to parse cipher pass date from storage:', err);
  }
  return { ...DEFAULT_CIPHER_DATE };
}

export function saveStoredCipherPassDate(date: CipherDate): void {
  try {
    const sanitized: CipherDate = {
      day: Math.min(31, Math.max(1, Math.round(date.day))),
      month: Math.min(12, Math.max(1, Math.round(date.month))),
      year: Math.round(date.year)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Failed to save cipher pass date to storage:', err);
  }
}

export function verifyCipherDate(input: CipherDate): boolean {
  const target = getStoredCipherPassDate();
  return (
    input.day === target.day &&
    input.month === target.month &&
    input.year === target.year
  );
}

export function formatCipherDateString(date: CipherDate): string {
  const monthName = MONTH_NAMES[date.month - 1] || 'UNKNOWN';
  const dayStr = String(date.day).padStart(2, '0');
  return `${dayStr} ${monthName} ${date.year}`;
}
