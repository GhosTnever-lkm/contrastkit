export function normalizeHex(value) {
  const clean = String(value ?? '').trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(clean)) return '#' + clean.split('').map(char => char + char).join('').toUpperCase();
  if (/^[0-9a-f]{6}$/i.test(clean)) return '#' + clean.toUpperCase();
  return null;
}

function channelToLinear(byte) {
  const c = byte / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex) {
  const color = normalizeHex(hex);
  if (!color) return NaN;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

export function ratio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  if (!Number.isFinite(l1) || !Number.isFinite(l2)) return NaN;
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}