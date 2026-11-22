export function withBase(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  if (!clean) return `${base}/`;
  return `${base}/${clean}`;
}

export function isPlaceholder(url: string) {
  return /PLACEHOLDER|example\.com|example@/i.test(url);
}
