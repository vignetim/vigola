import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function loadQuestionHistory(path = resolve('.vigola-data', 'used-questions.json')) {
 let ids = [];
 try {
  ids = JSON.parse(readFileSync(path, 'utf8'));
 } catch (error) {
  if (error.code !== 'ENOENT') throw error;
 }

 if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string' || !/^[a-f0-9]{64}$/.test(id))) {
  throw new Error('Soru geçmişi okunamadı.');
 }

 return {
  usedQuestions: new Set(ids),
  saveUsedQuestions(usedQuestions) {
   const temporary = path + '.tmp';
   try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(temporary, JSON.stringify([...usedQuestions]));
    renameSync(temporary, path);
   } catch (error) {
    console.error('Could not save question history:', error.code);
    throw new Error('Soru geçmişi kaydedilemedi. Sunucu depolamasını kontrol et.');
   }
  },
 };
}
