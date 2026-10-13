import test from 'node:test';
import assert from 'node:assert/strict';
import './contrast-core.js';

const { normalizeHex, luminance, ratio, thresholds, evaluate } = globalThis.ContrastKitCore;

test('normalizes three- and six-digit hex colors and rejects unsupported input', () => {
  assert.equal(normalizeHex('abc'), '#AABBCC');
  assert.equal(normalizeHex(' #aBc '), '#AABBCC');
  assert.equal(normalizeHex('#12abEF'), '#12ABEF');
  for (const value of [null, '', '#12', '#1234', '#12345g', 'red']) assert.equal(normalizeHex(value), null);
});

test('calculates WCAG contrast reference values symmetrically', () => {
  assert.ok(Math.abs(ratio('#000000', '#ffffff') - 21) < 1e-12);
  assert.ok(Math.abs(ratio('#ffffff', '#000000') - 21) < 1e-12);
  assert.ok(Math.abs(ratio('#767676', '#ffffff') - 4.542224959605253) < 1e-12);
  assert.ok(Number.isNaN(luminance('not-a-color')));
  assert.ok(Number.isNaN(ratio('#fff', 'invalid')));
});

test('uses the normal and large text WCAG AA/AAA thresholds', () => {
  assert.deepEqual(thresholds('normal'), { aa: 4.5, aaa: 7 });
  assert.deepEqual(thresholds('large'), { aa: 3, aaa: 4.5 });
  assert.equal(evaluate('#767676', '#fff', 'normal').aa, true);
  assert.equal(evaluate('#777777', '#fff', 'normal').aa, false);
  assert.equal(evaluate('#777777', '#fff', 'large').aa, true);
  assert.equal(evaluate('#777777', '#fff', 'large').aaa, false);
});

test('does not return a stale score for invalid color input', () => {
  assert.deepEqual(evaluate('#fff', '#12xz00', 'normal'), { valid: false, ratio: NaN, aa: false, aaa: false });
});
