export function localToServerISO(localDateTime) {
  if (!localDateTime) return null;
  const dt = new Date(localDateTime);
  return dt.toISOString();
}

export function isoToLocalInput(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
