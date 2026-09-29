// Deliveries run Monday–Friday only (next-day fulfillment from Sun–Thu orders;
// closed Friday 3pm–Saturday 8pm, so no Saturday or Sunday delivery).
const MAX_DAYS_AHEAD = 30;

const toISODate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isWeekday = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6; // not Sun/Sat

const addDays = (d: Date, days: number) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
};

/** Earliest selectable delivery date: tomorrow, bumped forward to the next weekday. */
export function earliestDeliveryDate(): Date {
  let date = addDays(new Date(), 1);
  while (!isWeekday(date)) date = addDays(date, 1);
  return date;
}

export function earliestDeliveryDateISO(): string {
  return toISODate(earliestDeliveryDate());
}

export function latestDeliveryDateISO(): string {
  return toISODate(addDays(new Date(), MAX_DAYS_AHEAD));
}

/** True if the given yyyy-mm-dd string is a valid delivery day (weekday, not in the past). */
export function isValidDeliveryDate(iso: string): boolean {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  if (!isWeekday(date)) return false;
  return toISODate(date) >= earliestDeliveryDateISO();
}

/** Nearest valid delivery day on/after the given yyyy-mm-dd string. */
export function nearestValidDeliveryDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  let date = (y && m && d) ? new Date(y, m - 1, d) : earliestDeliveryDate();
  const earliest = earliestDeliveryDate();
  if (date < earliest) date = earliest;
  while (!isWeekday(date)) date = addDays(date, 1);
  return toISODate(date);
}

export function formatDeliveryDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
