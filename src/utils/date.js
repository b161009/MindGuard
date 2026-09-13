export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('vi-VN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}

export function getDateKey(date = new Date()) {
  const value = new Date(date);
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 10);
}

export function getDaysAgo(days = 1) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}
