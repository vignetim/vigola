import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { questionPool } from '../lib/questions.mjs';
import { questionPoolForLanguage } from '../lib/question-locales.mjs';
import { turkishQuestions } from '../lib/question-locales-tr.mjs';
import { bankStorageKeys, savedBankForLanguage } from '../lib/room-preferences.mjs';
import { questionMatchesSearch } from '../lib/question-search.mjs';
import { Engine, validateBank } from '../server/engine.mjs';

const identity = text => createHash('sha256').update(text.normalize('NFC').replace(/\s+/g, ' ').toLocaleLowerCase('tr')).digest('hex');

test('all 264 questions have authored Turkish prompts and explanations with canonical technical answers', () => {
 const tr = questionPoolForLanguage('tr');
 const en = questionPoolForLanguage('en');
 assert.deepEqual(Object.keys(turkishQuestions).sort(), questionPool.map(q => q.id).sort());
 assert.deepEqual(en, questionPool);
 assert.equal(tr.length, 264);
 for (let i = 0; i < en.length; i++) {
  const english = en[i], turkish = tr[i];
  assert.notEqual(turkish.text, english.text, english.id);
  assert.notEqual(turkish.explanation, english.explanation, english.id);
  assert.ok(turkish.text.trim() && turkish.explanation.trim());
  for (const key of ['id', 'letter', 'answer', 'difficulty', 'points', 'penalty', 'multiplier']) assert.equal(turkish[key], english[key], `${english.id}: ${key}`);
  assert.equal(turkish.answer[0].toUpperCase(), turkish.letter);
  assert.doesNotMatch(turkish.text + turkish.explanation, /çağrı yığın|olay döngüsü|kapanım/iu);
 }
 assert.match(turkishQuestions['E-1'].explanation, /call stack/i);
});

test('localized catalog identities match existing English history while custom edits keep distinct identities', () => {
 const en = validateBank(questionPoolForLanguage('en'));
 const tr = validateBank(questionPoolForLanguage('tr'));
 assert.deepEqual(tr.map(q => q.id), en.map(q => q.id));
 assert.deepEqual(en.map(q => q.id), questionPool.map(q => identity(q.text)));
 const custom = { ...questionPoolForLanguage('tr')[0], text: 'Bu tamamen özel bir API sorusu mu?' };
 assert.equal(validateBank([custom])[0].id, identity(custom.text));
 assert.notEqual(validateBank([custom])[0].id, en[0].id);
 const changedAnswer = { ...questionPoolForLanguage('tr')[0], answer: 'Adapter' };
 assert.equal(validateBank([changedAnswer])[0].id, identity(changedAnswer.text));
 assert.throws(() => validateBank([questionPoolForLanguage('en')[0], questionPoolForLanguage('tr')[0]]), /birden fazla/);
});

test('both game modes create rooms in either question language and restore the correct default pool', () => {
 const engine = new Engine();
 assert.equal(engine.create().language, 'en'); // Existing clients remain compatible.
 for (const mode of ['buzzer', 'multiple-choice']) {
  for (const language of ['tr', 'en']) {
   const room = engine.create(undefined, mode, language);
   assert.equal(room.language, language);
   assert.equal(engine.state(room).language, language);
   assert.equal(room.pool[0].text, questionPoolForLanguage(language)[0].text);
   engine.setPool(room, [{ ...questionPool[0], text: 'A custom question kept exactly as entered?' }]);
   assert.equal(room.pool[0].text, 'A custom question kept exactly as entered?');
   engine.setPool(room);
   assert.equal(room.pool.length, 264);
   assert.equal(room.pool[0].text, questionPoolForLanguage(language)[0].text);
   if (mode === 'multiple-choice') {
    for (const q of room.pool) {
     assert.equal(q.choices.length, 4);
     assert.equal(q.choices.filter(c => c.text === q.answer).length, 1);
     assert.ok(q.choices.every(c => c.text[0].toUpperCase() === q.letter));
    }
   }
  }
 }
});

test('invalid languages never allocate a room or silently choose an unintended catalog', () => {
 const engine = new Engine();
 for (const language of [null, '', 'TR', 'de', {}, true]) {
  assert.throws(() => engine.create(undefined, 'buzzer', language), /Soru dili/);
  assert.throws(() => questionPoolForLanguage(language), /Soru dili/);
 }
 assert.equal(engine.rooms.size, 0);
});

test('a completed question in one language is not reused in the other', () => {
 let now = 100000;
 const engine = new Engine(() => now);
 const turkish = engine.create([questionPoolForLanguage('tr')[0]], 'buzzer', 'tr');
 engine.start(turkish); now += 3000; engine.tick(); engine.pass(turkish);
 const english = engine.create([questionPoolForLanguage('en')[0]], 'buzzer', 'en');
 assert.throws(() => engine.start(english), /kullanılmamış soru kalmadı/);
 assert.equal(english.phase, 'lobby');
});

test('Turkish MC content stays hidden until open and uses the same canonical answer and weighted scores', () => {
 let now = 100000;
 const engine = new Engine(() => now);
 const room = engine.create([questionPoolForLanguage('tr')[0]], 'multiple-choice', 'tr');
 const player = engine.join(room, 'Ada'); player.sockets.add('ada');
 engine.start(room);
 assert.equal(engine.state(room).question.text, '');
 assert.equal(engine.state(room).question.choices, undefined);
 now += 3000; engine.tick();
 assert.equal(engine.state(room).question.text, turkishQuestions.a.text);
 assert.equal(engine.state(room).question.answer, undefined);
 const correct = room.bank[0].choices.find(c => c.text === 'API');
 engine.submitChoice(room, player, room.bank[0].id, correct.id);
 engine.revealChoices(room, room.bank[0].id);
 assert.equal(player.score, 100);
 assert.equal(engine.state(room).question.explanation, turkishQuestions.a.explanation);
 assert.equal(engine.state(room).completed[0].text, turkishQuestions.a.text);
});

test('saved custom sets and default-pool preferences stay isolated by language', () => {
 const values = new Map();
 const read = key => values.get(key) ?? null;
 values.set('vigola-bank', ['legacy-English']);
 assert.deepEqual(savedBankForLanguage(read, 'en'), ['legacy-English']);
 assert.equal(savedBankForLanguage(read, 'tr'), undefined);
 values.set(bankStorageKeys('tr').bank, ['Turkish']);
 values.set(bankStorageKeys('en').bank, ['English']);
 assert.deepEqual(savedBankForLanguage(read, 'tr'), ['Turkish']);
 assert.deepEqual(savedBankForLanguage(read, 'en'), ['English']);
 values.set(bankStorageKeys('tr').useDefault, true);
 assert.equal(savedBankForLanguage(read, 'tr'), undefined);
 assert.deepEqual(savedBankForLanguage(read, 'en'), ['English']);
 values.set('vigola-use-default-pool', true);
 assert.equal(savedBankForLanguage(read, 'en'), undefined);
 values.set(bankStorageKeys('en').useDefault, false);
 assert.deepEqual(savedBankForLanguage(read, 'en'), ['English']);
});


test('question search handles Turkish dotted I and preserved English technical terms together', () => {
 const turkish = { letter: 'D', text: 'İki thread aynı Index kaydını işliyor.' };
 for (const search of ['iki', 'İKİ', 'i\u0307ki', 'INDEX', 'index', 'kaydını', 'kaydini']) {
  assert.equal(questionMatchesSearch(turkish, search), true, search);
 }
 const english = { letter: 'I', text: 'Incoming requests use an Index.' };
 for (const search of ['incoming', 'INCOMING', 'index', 'i', 'I', 'ı', 'İ']) assert.equal(questionMatchesSearch(english, search), true, search);
 assert.equal(questionMatchesSearch(turkish, 'unrelated'), false);
});
