import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine, validateBank } from '../server/engine.mjs';
import { quizPoolForLanguage, canonicalQuizText } from '../lib/quiz-questions.mjs';
import { turkishQuizExtraA } from '../lib/quiz-questions-tr-a.mjs';
import { turkishQuizExtraB } from '../lib/quiz-questions-tr-b.mjs';
import { MAX_POOL_QUESTIONS } from '../lib/game-rules.mjs';

const normalized = text => text.normalize('NFC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr');

test('Turkish quiz bank preserves the original 600 questions alongside 60 bilingual AI and Cloud additions', () => {
 const tr = quizPoolForLanguage('tr'), en = quizPoolForLanguage('en');
 assert.equal(tr.length, 660); assert.equal(en.length, 120);
 assert.equal(turkishQuizExtraA.length, 270); assert.equal(turkishQuizExtraB.length, 270);
 assert.deepEqual(tr.slice(0, 60).map(question => question.id), en.slice(0, 60).map(question => question.id));
 assert.deepEqual(validateBank(tr.slice(0, 60)).map(question => question.id), validateBank(en.slice(0, 60)).map(question => question.id));
 assert.equal(tr.slice(60, 600).every(question => question.id.startsWith('quiz-tr-')), true);
 assert.equal(new Set(tr.map(question => question.id)).size, 660);
 assert.ok(MAX_POOL_QUESTIONS >= tr.length);
});

test('all 660 prompts are distinct, including after numbers are normalized to detect superficial variants', () => {
 const tr = quizPoolForLanguage('tr');
 const prompts = tr.map(question => normalized(question.text));
 assert.equal(new Set(prompts).size, 660);
 const withoutNumbers = new Map();
 for (const question of tr) {
  const key = normalized(question.text).replace(/\d+/g, '#');
  assert.equal(withoutNumbers.has(key), false, `${question.id} duplicates ${withoutNumbers.get(key)}`);
  withoutNumbers.set(key, question.id);
 }
 assert.equal(validateBank(tr).length, 660);
});

test('Turkish-only questions retain canonical identity only for authored prompts and their exact answers', () => {
 for (const question of quizPoolForLanguage('tr').slice(60, 600)) {
  assert.equal(canonicalQuizText(question.text, question.answer), question.text);
  assert.equal(canonicalQuizText(`  ${question.text.replaceAll(' ', '  ')}  `, question.answer), question.text);
  assert.equal(canonicalQuizText(question.text, 'Not the authored answer'), undefined);
 }
 const question = quizPoolForLanguage('tr')[60];
 const edited = { ...question, text: `${question.text} Kullanıcı tarafından değiştirildi.` };
 assert.equal(canonicalQuizText(edited.text, edited.answer), undefined);
 assert.notEqual(validateBank([edited])[0].id, validateBank([question])[0].id);
});

test('new Turkish questions are independently editable and never mutate the source data or English bank', () => {
 const first = quizPoolForLanguage('tr'), second = quizPoolForLanguage('tr');
 const english = quizPoolForLanguage('en');
 const original = second[60].choices[0].text;
 first[60].choices[0].text = 'Changed'; first[60].text = 'Changed'; first.pop();
 assert.equal(second.length, 660); assert.equal(quizPoolForLanguage('tr').length, 660);
 assert.equal(second[60].choices[0].text, original);
 assert.equal(turkishQuizExtraA[0][4][0], original);
 assert.deepEqual(quizPoolForLanguage('en'), english);
});

test('the expanded default pool still starts a 30-question quiz with opaque four-option choices', () => {
 let now = 100000;
 const engine = new Engine(() => now);
 const room = engine.create(undefined, 'quiz', 'tr');
 assert.equal(room.pool.length, 660); assert.equal(engine.state(room).total, 30);
 engine.start(room); now += 3000; engine.tick();
 assert.equal(room.bank.length, 30); assert.equal(new Set(room.bank.map(question => question.id)).size, 30);
 assert.equal(room.bank.every(question => question.choices.length === 4), true);
 const state = engine.state(room);
 assert.equal(state.question.answer, undefined); assert.equal(state.question.explanation, undefined);
 assert.deepEqual(state.letters, []);
 for (const choice of state.question.choices) assert.match(choice.id, /^[a-f0-9]{24}$/);
});

test('twenty-two completed Turkish races use all 660 questions once before the pool refills', () => {
 let now = 100000, saves = 0;
 const engine = new Engine(() => now, { saveUsedQuestions: () => { saves++; } });
 const seen = new Set();
 for (let match = 0; match < 22; match++) {
  const room = engine.create(undefined, 'quiz', 'tr');
  for (let index = 0; index < 30; index++) {
   engine.start(room); now += 3000; engine.tick();
   const question = room.bank[index];
   assert.equal(seen.has(question.id), false, `Repeated question in match ${match + 1}`);
   seen.add(question.id); engine.revealChoices(room, question.id);
  }
  assert.equal(engine.usedQuestions.size, (match + 1) * 30);
 }
 assert.equal(seen.size, 660); assert.equal(saves, 22);
 const replay = engine.create(undefined, 'quiz', 'tr'); engine.start(replay);
 assert.equal(replay.bank.length, 30); assert.equal(new Set(replay.bank.map(question => question.id)).size, 30);
});
