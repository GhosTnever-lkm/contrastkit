import test from 'node:test';
import assert from 'node:assert/strict';
import { luminance, normalizeHex, ratio } from './contrast.mjs';

test('normalizes short and long hex colors and rejects unsupported input', () => {
  assert.equal(normalizeHex('#abc'), '#AABBCC');
  assert.equal(normalizeHex('263238'), '#263238');
  assert.equal(normalizeHex('#12xz90'), null);
  assert.equal(normalizeHex(null), null);
});

test('matches WCAG reference contrast ratios', () => {
  assert.ok(Math.abs(ratio('#000000', '#ffffff') - 21) < 1e-12);
  assert.ok(Math.abs(ratio('#767676', '#ffffff') - 4.542) < 0.001);
  assert.ok(Math.abs(ratio('#777777', '#ffffff') - 4.478) < 0.001);
  assert.equal(ratio('#ffffff', '#000000'), ratio('#000000', '#ffffff'));
});

test('invalid colors do not produce a numeric contrast result', () => {
  assert.ok(Number.isNaN(luminance('not-a-color')));
  assert.ok(Number.isNaN(ratio('#ffffff', 'transparent')));
});