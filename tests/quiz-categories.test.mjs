import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine, validateBank } from '../server/engine.mjs';
import { quizPoolForLanguage, canonicalQuizText } from '../lib/quiz-questions.mjs';
import { QUIZ_CATEGORIES, quizCategoryForQuestion, quizCategoryCounts } from '../lib/quiz-categories.mjs';
import { bankStorageKeys, savedBankForLanguage } from '../lib/room-preferences.mjs';
import { JOKERS, MULTIPLE_CHOICE_SECONDS } from '../lib/game-rules.mjs';

test('eight categories cover every authored question and each supports a full Turkish race', () => {
 assert.equal(QUIZ_CATEGORIES.length, 8);
 assert.equal(new Set(QUIZ_CATEGORIES.map(category => category.id)).size, 8);
 for (const language of ['tr', 'en']) {
  const pool = quizPoolForLanguage(language), counts = quizCategoryCounts(pool);
  assert.equal(Object.values(counts).reduce((total, count) => total + count, 0), pool.length);
  for (const question of pool) assert.ok(quizCategoryForQuestion(question), question.category);
  if (language === 'tr') for (const count of Object.values(counts)) assert.ok(count >= 30);
 }
 assert.equal(quizCategoryForQuestion({ category: '  cLoUd  ' }), 'cloud');
 assert.equal(quizCategoryForQuestion({ category: 'Cloudy unrelated custom category' }), undefined);
});

test('AI and Cloud each add thirty four-option bilingual questions with shared history identities', () => {
 for (const category of ['ai', 'cloud']) {
  const localized = ['tr', 'en'].map(language => quizPoolForLanguage(language).filter(question => quizCategoryForQuestion(question) === category));
  assert.equal(localized[0].length, 30); assert.equal(localized[1].length, 30);
  assert.deepEqual(validateBank(localized[0]).map(question => question.id), validateBank(localized[1]).map(question => question.id));
  for (let i = 0; i < 30; i++) {
   const tr = localized[0][i], en = localized[1][i];
   assert.equal(tr.choices.length, 4); assert.equal(en.choices.length, 4);
   assert.equal(canonicalQuizText(tr.text, tr.answer), en.text);
   assert.equal(canonicalQuizText(en.text, en.answer), en.text);
   assert.notEqual(tr.text, en.text);
  }
 }
});

test('every category starts exactly thirty matching questions and retains the timer and all jokers', () => {
 let now = 100000;
 const engine = new Engine(() => now);
 for (const category of QUIZ_CATEGORIES) {
  const room = engine.create(undefined, 'quiz', 'tr', category.id);
  assert.equal(room.quizCategory, category.id); assert.equal(engine.state(room).quizCategory, category.id);
  assert.ok(room.pool.length >= 30);
  assert.ok(room.pool.every(question => quizCategoryForQuestion(question) === category.id));
  const player = engine.join(room, 'Ada'); player.sockets.add(category.id);
  assert.deepEqual([...player.availableJokers], JOKERS);
  engine.start(room); now += 3000; engine.tick();
  assert.equal(room.bank.length, 30); assert.equal(new Set(room.bank.map(question => question.id)).size, 30);
  assert.ok(room.bank.every(question => quizCategoryForQuestion(question) === category.id));
  assert.equal(room.deadline - now, MULTIPLE_CHOICE_SECONDS * 1000);
 }
});

test('omitting a category keeps the entire mixed pool and existing letter modes ignore quiz categories', () => {
 const engine = new Engine();
 for (const selected of [undefined, '']) {
  const room = engine.create(undefined, 'quiz', 'tr', selected);
  assert.equal(room.quizCategory, ''); assert.equal(room.pool.length, 660);
  engine.start(room); assert.equal(room.bank.length, 30);
 }
 const legacy = engine.create(); assert.equal(legacy.mode, 'buzzer'); assert.equal(legacy.quizCategory, '');
 for (const mode of ['buzzer', 'multiple-choice']) {
  const room = engine.create(undefined, mode, 'tr', 'ai');
  assert.equal(room.quizCategory, ''); assert.equal(room.bank.length, 24);
 }
});

test('invalid categories and insufficient category pools cannot create rooms or mutate an existing pool', () => {
 const engine = new Engine();
 for (const category of [null, false, {}, [], 'AI', 'unknown', ' ai ']) {
  assert.throws(() => engine.create(undefined, 'quiz', 'tr', category), /kategori/);
  assert.equal(engine.rooms.size, 0);
 }
 assert.throws(() => engine.create(undefined, 'quiz', 'en', 'programming'), /en az 30/);
 assert.equal(engine.rooms.size, 0);
 const all = quizPoolForLanguage('tr');
 const ai = all.filter(question => quizCategoryForQuestion(question) === 'ai');
 const cloud = all.filter(question => quizCategoryForQuestion(question) === 'cloud');
 assert.throws(() => engine.create([...ai.slice(1), ...cloud], 'quiz', 'tr', 'ai'), /en az 30/);
 const room = engine.create(all, 'quiz', 'tr', 'ai'), before = room.pool;
 assert.equal(room.pool.length, 30);
 assert.throws(() => engine.setPool(room, [...ai.slice(1), ...cloud]), /en az 30/);
 assert.equal(room.pool, before);
 engine.setPool(room, undefined);
 assert.equal(room.pool.length, 30); assert.ok(room.pool.every(question => quizCategoryForQuestion(question) === 'ai'));
});

test('category-specific custom banks and default preferences never overwrite mixed or other category sets', () => {
 const values = new Map(), read = key => values.get(key);
 const mixed = bankStorageKeys('tr', 'quiz'), ai = bankStorageKeys('tr', 'quiz', 'ai'), cloud = bankStorageKeys('tr', 'quiz', 'cloud');
 values.set(mixed.bank, ['mixed']); values.set(ai.bank, ['AI']); values.set(cloud.bank, ['Cloud']);
 assert.deepEqual(savedBankForLanguage(read, 'tr', 'quiz'), ['mixed']);
 assert.deepEqual(savedBankForLanguage(read, 'tr', 'quiz', 'ai'), ['AI']);
 assert.deepEqual(savedBankForLanguage(read, 'tr', 'quiz', 'cloud'), ['Cloud']);
 assert.equal(savedBankForLanguage(read, 'en', 'quiz', 'ai'), undefined);
 values.set(ai.useDefault, true);
 assert.equal(savedBankForLanguage(read, 'tr', 'quiz', 'ai'), undefined);
 assert.deepEqual(savedBankForLanguage(read, 'tr', 'quiz', 'cloud'), ['Cloud']);
 assert.deepEqual(savedBankForLanguage(read, 'tr', 'quiz'), ['mixed']);
});

test('completing a category consumes only its questions and keeps other categories available', () => {
 let now = 100000;
 const engine = new Engine(() => now);
 const room = engine.create(undefined, 'quiz', 'tr', 'ai');
 for (let index = 0; index < 30; index++) {
  engine.start(room); now += 3000; engine.tick(); engine.revealChoices(room, room.bank[index].id);
 }
 assert.equal(engine.usedQuestions.size, 30);
 const cloud = engine.create(undefined, 'quiz', 'tr', 'cloud'); engine.start(cloud);
 assert.ok(cloud.bank.every(question => !engine.usedQuestions.has(question.id)));
 const replay = engine.create(undefined, 'quiz', 'en', 'ai'); engine.start(replay);
 assert.equal(replay.bank.length, 30); assert.equal(new Set(replay.bank.map(question => question.id)).size, 30);
 assert.ok(replay.bank.every(question => engine.usedQuestions.has(question.id)));
});
