import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
test('the JavaScript example copied directly from README runs from the repository root', () => {
  const readme = fs.readFileSync('README.md', 'utf8'),
    blocks = [...readme.matchAll(/\x60{3}js\r?\n([\s\S]*?)\r?\n\x60{3}/g)];
  assert.ok(blocks.length > 0);
  for (const [, source] of blocks) {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
      encoding: 'utf8',
      timeout: 10000,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.ok(JSON.parse(result.stdout));
  }
});
