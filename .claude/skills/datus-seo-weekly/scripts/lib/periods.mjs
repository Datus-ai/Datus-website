/** Report weeks run Monday–Sunday; the default week is the one that ended last Sunday. */

export function getReportPeriods(weekEndOverride, today = new Date()) {
  const currentEnd = weekEndOverride ? parseDateOnly(weekEndOverride) : lastSunday(today);
  if (currentEnd.getDay() !== 0) {
    throw new Error(`REPORT_WEEK_END must be a Sunday, got ${formatDate(currentEnd)}`);
  }
  const currentStart = addDays(currentEnd, -6);
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(previousEnd, -6);
  return {
    current: { start: formatDate(currentStart), end: formatDate(currentEnd) },
    previous: { start: formatDate(previousStart), end: formatDate(previousEnd) },
    fileSuffix: formatDate(currentEnd),
  };
}

function lastSunday(ref) {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  d.setDate(d.getDate() - (d.getDay() === 0 ? 7 : d.getDay()));
  return d;
}

function parseDateOnly(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function pctChange(current, previous) {
  if (!previous) return current > 0 ? null : 0; // null = "new", not +100%
  return (current - previous) / previous;
}
