import fs from 'node:fs';
export const cases = Object.freeze(
  JSON.parse(fs.readFileSync(new URL('../fixtures/cases.json', import.meta.url), 'utf8')).map(
    Object.freeze,
  ),
);
export function generate({ count = 20, seed = 42 } = {}) {
  if (!Number.isInteger(count) || count < 0 || count > 100000)
    throw new RangeError('count must be 0..100000');
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff)
    throw new RangeError('seed must be a uint32');
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state;
  };
  return Array.from({ length: count }, (_, i) => {
    const item = cases[next() % cases.length];
    return {
      recordId: 'synthetic-' + (i + 1),
      caseId: item.id,
      category: item.category,
      ...(Object.hasOwn(item, 'input') ? { value: item.input } : {}),
      note: item.note,
    };
  });
}
function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function serialize(records, format = 'json') {
  if (format === 'json') return JSON.stringify(records, null, 2) + '\n';
  if (format === 'ndjson')
    return records.map((row) => JSON.stringify(row)).join('\n') + (records.length ? '\n' : '');
  if (format === 'csv') {
    const columns = ['recordId', 'caseId', 'category', 'hasValue', 'value', 'note'];
    return (
      columns.join(',') +
      '\r\n' +
      records
        .map((row) =>
          [
            row.recordId,
            row.caseId,
            row.category,
            Object.hasOwn(row, 'value'),
            JSON.stringify(row.value),
            row.note,
          ]
            .map(csvCell)
            .join(','),
        )
        .join('\r\n') +
      (records.length ? '\r\n' : '')
    );
  }
  throw new Error('format must be json, ndjson, or csv');
}
