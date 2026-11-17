import { turkishExtraAL } from './question-locales-tr-extra-al.mjs';
import { turkishExtraMZ } from './question-locales-tr-extra-mz.mjs';

// Authored Turkish-only additions. Existing bilingual IDs and history stay stable.
export const extraTurkishQuestions = Object.entries({ ...turkishExtraAL, ...turkishExtraMZ }).flatMap(([letter, rows]) =>
 rows.trim().split('\n').map((row, index) => {
  const fields = row.split('|');
  const [category, difficulty, answer, text, explanation] = fields;
  if (fields.length !== 5 || fields.some(field => !field.trim()) || !['Kolay', 'Orta', 'Zor'].includes(difficulty) || answer[0].toUpperCase() !== letter) {
   throw new Error(`Invalid Turkish question: ${letter}-${index + 1}`);
  }
  return {
   id: `tr-${letter}-${index + 1}`, letter, category, difficulty, answer, text, explanation,
   code: '', points: 100,
   penalty: difficulty === 'Zor' ? 50 : difficulty === 'Orta' ? 30 : 25,
   multiplier: difficulty === 'Zor' ? 2 : difficulty === 'Orta' ? 1.5 : 1,
  };
 }),
);
