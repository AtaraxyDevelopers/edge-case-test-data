#!/usr/bin/env node
import { generate, serialize } from './index.mjs';
try {
  let count = 20,
    seed = 42,
    format = 'json';
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count') count = Number(args[++i]);
    else if (args[i] === '--seed') seed = Number(args[++i]);
    else if (args[i] === '--format') format = args[++i];
    else if (args[i] === '--help') {
      console.log('node src/cli.mjs [--count 20] [--seed 42] [--format json|ndjson|csv]');
      process.exit(0);
    } else throw new Error('Unknown argument');
  }
  process.stdout.write(serialize(generate({ count, seed }), format));
} catch (e) {
  console.error(e.message);
  process.exitCode = 2;
}
