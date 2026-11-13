import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cli = fileURLToPath(new URL('../src/cli.mjs', import.meta.url));
test('CLI rejects incomplete options instead of silently generating different data', () => {
  for (const args of [
    ['--format'],
    ['--out'],
    ['--seed'],
    ['--count'],
    ['--format', '--out', 'a'],
    ['--count', ''],
    ['--seed', '2.5'],
    ['--out', ''],
  ]) {
    const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 2, JSON.stringify(args));
    assert.equal(result.stdout, '');
  }
});
test('file output preserves Unicode and refuses overwrites', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtures-cli-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'records.json');
  const run = () =>
    spawnSync(process.execPath, [cli, '--count', '200', '--seed', '42', '--out', file], {
      encoding: 'utf8',
    });
  assert.equal(run().status, 0);
  const raw = await fs.readFile(file, 'utf8'),
    rows = JSON.parse(raw);
  assert.equal(rows.length, 200);
  assert.ok(rows.some((row) => row.value === 'عائشہ خان'));
  assert.equal(raw.charCodeAt(0), 91);
  assert.equal(run().status, 2);
  assert.equal(await fs.readFile(file, 'utf8'), raw);
});
