export function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMatch(text, query) {
  if (!query.trim()) return text;
  if (!text) return "";

  const safe = escapeRegExp(query.trim());
  const regex = new RegExp(`(${safe})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <span key={i} className="bg-amber-500/30 text-amber-100 px-0.5 rounded">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
