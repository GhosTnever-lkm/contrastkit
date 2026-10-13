import { normalizeHex, ratio, thresholds } from './contrast.mjs';

(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fg = $('#fg'), bg = $('#bg'), fgPicker = $('#fg-picker'), bgPicker = $('#bg-picker');
  let textSize = 'normal';
  let colors = ['#24352D', '#4D8067', '#87A98F', '#D5E7D9', '#F0C879'];
  let toastTimer;

  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1700);
  }
  function badge(label, pass) {
    return `<span class="badge ${pass ? 'pass' : 'fail'}">${label} ${pass ? 'Pass' : 'Fail'}</span>`;
  }
  function setInputColor(textInput, picker, source) {
    const value = normalizeHex(source.value);
    if (!value) { textInput.setAttribute('aria-invalid', 'true'); return false; }
    textInput.removeAttribute('aria-invalid');
    textInput.value = value.toLowerCase(); picker.value = value.toLowerCase();
    return true;
  }
  function render() {
    const text = normalizeHex(fg.value), surface = normalizeHex(bg.value);
    if (!text || !surface) {
      $('#ratio').textContent = '—'; $('#criteria').innerHTML = '<span class="badge info">Enter a valid 3 or 6 digit hex color</span>';
      $('#score-note').textContent = 'Use a hex value such as #263238.'; renderPalette(); return;
    }
    fg.value = text.toLowerCase(); bg.value = surface.toLowerCase(); fgPicker.value = text.toLowerCase(); bgPicker.value = surface.toLowerCase();
    const score = ratio(text, surface), large = textSize === 'large';
    const aaLimit = large ? 3 : 4.5, aaaLimit = large ? 4.5 : 7;
    $('#ratio').textContent = `${score.toFixed(2)}:1`;
    $('#criteria').innerHTML = badge('AA', score >= aaLimit) + badge('AAA', score >= aaaLimit);
    const preview = $('#preview'); preview.style.backgroundColor = surface; preview.style.color = text;
    preview.classList.toggle('large-preview', large); $('#preview-size-label').textContent = large ? '24px body · 40px heading' : '16px body · 32px heading';
    const note = score >= aaaLimit ? 'Excellent contrast. This pair meets AAA for the selected text size.' : score >= aaLimit ? 'This pair meets AA for the selected text size. Try a little more contrast for AAA.' : score >= 3 && !large ? 'This pair passes AA for large text only. Increase contrast for regular text.' : 'This pair does not meet AA for the selected text size. Darken the text or lighten the background.';
    $('#score-note').textContent = note;
    renderPalette();
  }
  function renderPalette() {
    const container = $('#palette'); container.replaceChildren();
    const background = normalizeHex(bg.value);
    const limits = thresholds(textSize);
    colors.forEach((color, index) => {
      const card = document.createElement('article'); card.className = 'swatch';
      const top = document.createElement('div'); top.className = 'swatch-color'; top.style.background = color;
      const picker = document.createElement('input'); picker.type = 'color'; picker.value = color; picker.setAttribute('aria-label', `Change palette color ${index + 1}`);
      picker.addEventListener('input', () => { colors[index] = picker.value.toUpperCase(); renderPalette(); }); top.append(picker);
      const info = document.createElement('div'); info.className = 'swatch-info';
      const name = document.createElement('div'); name.className = 'swatch-name'; name.innerHTML = `<span>Color ${index + 1}</span><button class="copy-color palette-copy" data-color="${color}" aria-label="Copy color ${index + 1}">⧉</button>`;
      const hex = document.createElement('div'); hex.className = 'swatch-hex'; hex.textContent = color;
      const badges = document.createElement('div'); badges.className = 'swatch-results'; const score = background ? ratio(color, background) : NaN;
      if (!Number.isFinite(score)) badges.innerHTML = '<span class="mini-badge info">AA —</span><span class="mini-badge info">AAA —</span>';
      else badges.innerHTML = `<span class="mini-badge ${score >= limits.aa ? 'pass' : 'fail'}">AA ${score >= limits.aa ? '✓' : '×'}</span><span class="mini-badge ${score >= limits.aaa ? 'pass' : 'fail'}">AAA ${score >= limits.aaa ? '✓' : '×'}</span>`;
      info.append(name, hex, badges); card.append(top, info); container.append(card);
    });
    $$('.palette-copy').forEach(button => button.addEventListener('click', () => copyText(button.dataset.color)));
  }
  async function copyText(value) {
    try { await navigator.clipboard.writeText(value); showToast(`Copied ${value}`); }
    catch { showToast('Clipboard access is unavailable'); }
  }
  function swap() {
    const old = fg.value; fg.value = bg.value; bg.value = old;
    fg.removeAttribute('aria-invalid'); bg.removeAttribute('aria-invalid'); render();
  }
  [fg, bg].forEach((field, index) => {
    const picker = index === 0 ? fgPicker : bgPicker;
    field.addEventListener('input', () => {
      const value = normalizeHex(field.value);
      if (value) { field.removeAttribute('aria-invalid'); render(); }
      else { field.setAttribute('aria-invalid', 'true'); render(); }
    });
    field.addEventListener('blur', () => { if (!setInputColor(field, picker, field)) field.setAttribute('aria-invalid', 'true'); render(); });
    field.addEventListener('keydown', event => { if (event.key === 'Enter') { field.blur(); } });
    picker.addEventListener('input', () => { field.value = picker.value; render(); });
  });
  $('#swap').addEventListener('click', swap); $('#swap-small').addEventListener('click', swap);
  $('#reset').addEventListener('click', () => { fg.value = '#24352d'; bg.value = '#ffffff'; textSize = 'normal'; $$('.size-option').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.size === 'normal'))); render(); });
  $$('.size-option').forEach(button => button.addEventListener('click', () => { textSize = button.dataset.size; $$('.size-option').forEach(option => option.setAttribute('aria-pressed', String(option === button))); render(); }));
  $$('.copy-color').forEach(button => button.addEventListener('click', () => copyText($('#' + button.dataset.copy).value.toUpperCase())));
  $('#add-color').addEventListener('click', () => {
    if (colors.length >= 10) return showToast('A palette can contain up to 10 colors');
    colors.push('#7BA68D'); renderPalette();
  });
  $('#export-css').addEventListener('click', () => {
    const tokens = [':root {', `  --text: ${normalizeHex(fg.value) || '#24352D'};`, `  --background: ${normalizeHex(bg.value) || '#FFFFFF'};`, ...colors.map((color, index) => `  --palette-${index + 1}: ${color};`), '}'].join('\n');
    const output = $('#css-output'); output.textContent = tokens; output.hidden = !output.hidden;
    $('#export-css').innerHTML = output.hidden ? 'Export CSS <span>↓</span>' : 'Hide CSS <span>↑</span>';
    if (!output.hidden) copyText(tokens);
  });
  $('#theme').addEventListener('click', () => { document.body.classList.toggle('dark'); try { localStorage.setItem('contrastkit-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch {} });
  try { if (localStorage.getItem('contrastkit-theme') === 'dark') document.body.classList.add('dark'); } catch {}
  render();
})();
