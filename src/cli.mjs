#!/usr/bin/env node
import fs from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { generate, serialize } from './index.mjs';
try {
  const { values } = parseArgs({
    options: {
      count: { type: 'string', default: '20' },
      seed: { type: 'string', default: '42' },
      format: { type: 'string', default: 'json' },
      out: { type: 'string' },
      help: { type: 'boolean' },
    },
    strict: true,
    allowPositionals: false,
  });
  if (values.help) {
    console.log(
      'node src/cli.mjs [--count 20] [--seed 42] [--format json|ndjson|csv] [--out new-file.json]\n--out writes UTF-8 and refuses to overwrite an existing file.',
    );
  } else {
    if (!/^\d+$/.test(values.count) || !/^\d+$/.test(values.seed))
      throw new Error('count and seed must be nonnegative decimal integers');
    if (values.out !== undefined && !values.out.trim())
      throw new Error('--out requires a nonempty filename');
    const output = serialize(
      generate({ count: Number(values.count), seed: Number(values.seed) }),
      values.format,
    );
    if (values.out !== undefined) {
      await fs.writeFile(values.out, output, { encoding: 'utf8', flag: 'wx' });
      console.log('Wrote UTF-8 ' + values.format + ' to ' + values.out);
    } else process.stdout.write(output);
  }
} catch (error) {
  console.error(error.code === 'EEXIST' ? 'Output exists; choose a new filename.' : error.message);
  process.exitCode = 2;
}
