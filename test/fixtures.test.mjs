import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cases, generate, serialize } from '../src/index.mjs';
test('seeded output is reproducible and seed-sensitive', () => {
  assert.deepEqual(generate({ seed: 42 }), generate({ seed: 42 }));
  assert.notDeepEqual(generate({ seed: 42 }), generate({ seed: 43 }));
  assert.equal(new Set(generate({ count: 100 }).map((r) => r.recordId)).size, 100);
});
test('Unicode and missing-value cases preserve their semantics', () => {
  const byId = Object.fromEntries(cases.map((c) => [c.id, c]));
  assert.equal(byId['unicode-decomposed'].input.normalize('NFC'), byId['unicode-composed'].input);
  assert.equal(Object.hasOwn(byId.absent, 'input'), false);
  assert.equal(byId.null.input, null);
  assert.equal(byId.zero.input, 0);
  assert.equal(
    new Intl.Segmenter('en', { granularity: 'grapheme' })
      .segment(byId['emoji-sequence'].input)
      [Symbol.iterator]()
      .next().value.segment,
    '👩‍💻',
  );
});
test('JSON and NDJSON round-trip exact types; CSV quotes embedded content', () => {
  const rows = generate({ count: 200 });
  assert.deepEqual(JSON.parse(serialize(rows)), rows);
  assert.deepEqual(serialize(rows, 'ndjson').trim().split('\n').map(JSON.parse), rows);
  const csv = serialize(
    [
      {
        recordId: '=1+1',
        caseId: 'quote',
        category: 'text',
        value: 'a,"b"\nnext',
        note: '@formula',
      },
    ],
    'csv',
  );
  assert.match(csv, /"'=1\+1"/);
  assert.match(csv, /"'@formula"/);
  assert.ok(csv.includes('""'));
});
test('bounds and CLI failure are explicit', () => {
  assert.throws(() => generate({ count: -1 }));
  assert.throws(() => generate({ seed: NaN }));
  assert.throws(() => serialize([], 'xml'));
  assert.equal(spawnSync(process.execPath, ['src/cli.mjs', '--count', '-1']).status, 2);
  const r = spawnSync(process.execPath, ['src/cli.mjs', '--count', '2'], { encoding: 'utf8' });
  assert.equal(JSON.parse(r.stdout).length, 2);
});
