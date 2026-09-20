import { readFile } from 'node:fs/promises';

const inputPath = process.argv[2];
if (!inputPath) throw new Error('Dùng: node research/scripts/validateDataset.mjs <file.jsonl>');

const schema = JSON.parse(await readFile(new URL('../label_schema.json', import.meta.url), 'utf8'));
const lines = (await readFile(inputPath, 'utf8')).split(/\r?\n/).filter(Boolean);
const invalid = [];

for (const [index, line] of lines.entries()) {
  try {
    const row = JSON.parse(line);
    const missing = schema.requiredFields.filter((field) => row[field] === undefined);
    const badEmotion = !Array.isArray(row.emotion) || row.emotion.some((label) => !schema.emotion.includes(label));
    const badSignals = !Array.isArray(row.signals) || row.signals.some((label) => !schema.signals.includes(label));
    const badRisk = row.riskLevel !== undefined && !schema.riskLevel.includes(row.riskLevel);
    const badSourceType = row.sourceType !== undefined && !schema.sourceTypes.includes(row.sourceType);
    if (missing.length || badEmotion || badSignals || badRisk || badSourceType) invalid.push({ line: index + 1, missing, badEmotion, badSignals, badRisk, badSourceType });
  } catch (error) {
    invalid.push({ line: index + 1, error: error.message });
  }
}

if (invalid.length) {
  console.error(JSON.stringify({ valid: false, invalid }, null, 2));
  process.exit(1);
}
console.log(`Hợp lệ: ${lines.length} bản ghi.`);
