(() => {
  'use strict';

  function normalizeHex(value) {
    if (typeof value !== 'string') return null;
    const clean = value.trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(clean)) return `#${clean.split('').map((char) => char + char).join('').toUpperCase()}`;
    if (/^[0-9a-f]{6}$/i.test(clean)) return `#${clean.toUpperCase()}`;
    return null;
  }

  function channelToLinear(byte) {
    const channel = byte / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }

  function luminance(value) {
    const color = normalizeHex(value);
    if (!color) return NaN;
    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);
    return 0.2126 * channelToLinear(red) + 0.7152 * channelToLinear(green) + 0.0722 * channelToLinear(blue);
  }

  function ratio(first, second) {
    const firstLuminance = luminance(first);
    const secondLuminance = luminance(second);
    if (!Number.isFinite(firstLuminance) || !Number.isFinite(secondLuminance)) return NaN;
    return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
  }

  function thresholds(size) {
    return size === 'large' ? { aa: 3, aaa: 4.5 } : { aa: 4.5, aaa: 7 };
  }

  function evaluate(foreground, background, size) {
    const text = normalizeHex(foreground);
    const surface = normalizeHex(background);
    if (!text || !surface) return { valid: false, ratio: NaN, aa: false, aaa: false };
    const score = ratio(text, surface);
    const limits = thresholds(size);
    return { valid: true, foreground: text, background: surface, ratio: score, aa: score >= limits.aa, aaa: score >= limits.aaa };
  }

  globalThis.ContrastKitCore = Object.freeze({ normalizeHex, luminance, ratio, thresholds, evaluate });
})();
