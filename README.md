# Edge-Case Test Data

[![CI](https://github.com/AtaraxyDevelopers/edge-case-test-data/actions/workflows/ci.yml/badge.svg)](https://github.com/AtaraxyDevelopers/edge-case-test-data/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Deterministic synthetic fixtures for Unicode, dates, missing values, and boundary cases.

An open-source project from [Ataraxy Developers](https://github.com/AtaraxyDevelopers).

## Quick start

Requires Node.js 22 or 24 and npm. Git is optional if you download the source ZIP.

```sh
git clone https://github.com/AtaraxyDevelopers/edge-case-test-data.git
cd edge-case-test-data
npm ci
npm test
```

```sh
npm run demo
node src/cli.mjs --count 100 --seed 42 --format ndjson
node src/cli.mjs --count 100 --seed 42 --format json > fixtures-output.json
```

## Included cases

The [case catalog](fixtures/cases.json) contains 18 hand-authored synthetic cases:
composed and decomposed Unicode, emoji, Urdu, CJK text, apostrophes, HTML-looking
text, spreadsheet formulas, null, absent fields, zero, unsafe integer strings,
leap days, timezone boundaries, long strings, and embedded newlines.

```js
import { cases, generate, serialize } from './src/index.mjs';
const records = generate({ count: 50, seed: 123 });
const json = serialize(records, 'json');
```

## Formats and reproducibility

JSON preserves types and distinguishes null from absent properties. NDJSON emits
one record per line. CSV includes a hasValue column and stores the value as JSON
text; decode that cell with JSON.parse when hasValue is true. CSV cells are quoted,
embedded quotes escaped, and leading formula characters in metadata are prefixed
with an apostrophe. Prefer JSON for exact test fixtures.

Seed is an unsigned 32-bit integer; count is 0–100,000. The same seed and version
produce the same sequence. Sampling does not guarantee all cases appear: iterate
the exported cases array to cover every case. A generated record's caseId identifies
the original case and its note explains the expected handling.

## Scope and limitations

All records are invented. This generator is for test data, not cryptographic random
values, production identity generation, or a complete locale validation standard.
Invalid dates are intentionally strings. No attempt is made to infer whether a
human name, address, or email is culturally valid.

## Contributing and support

See [CONTRIBUTING.md](CONTRIBUTING.md), [community expectations](CODE_OF_CONDUCT.md),
and [SECURITY.md](SECURITY.md). Open an issue with a minimal synthetic reproduction.
This project is maintained on a best-effort basis. No paid service or account is
required to run the local examples.

## License

[MIT](LICENSE). You may use, adapt, and redistribute this project under its license.
