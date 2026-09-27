// Keep both existing versions; use one consistent version throughout each day.
export function copyVariant(original, current) {
  const today = new Date();
  const day = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  return day % 2 === 0 ? original : current;
}
