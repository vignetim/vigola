import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine, validateBank } from '../server/engine.mjs';
import { quizPoolForLanguage, canonicalQuizText } from '../lib/quiz-questions.mjs';
import { bankStorageKeys, savedBankForLanguage } from '../lib/room-preferences.mjs';
import { QUIZ_QUESTION_COUNT, MULTIPLE_CHOICE_SECONDS, JOKERS, isChoiceMode } from '../lib/game-rules.mjs';

const customPool = (count = 35) => Array.from({ length: count }, (_, index) => ({
 id: `custom-${index}`, letter: '?', category: 'Mantık', text: `Özel yarışma sorusu ${index + 1}: hangi seçenek doğrudur?`,
 answer: 'Doğru seçenek', explanation: `Soru ${index + 1} açıklaması.`, difficulty: 'Orta', points: 100, penalty: 25, multiplier: 1,
 choices: [{ id: 'predictable-right', text: 'Doğru seçenek' }, { id: 'a', text: 'Benzer yanlış', weight: -17 }, { id: 'b', text: 'Başka yanlış', weight: -99 }, { id: 'c', text: 'Farklı yanlış' }],
}));
function setup({ pool = customPool(), count = 3, settings, language = 'tr' } = {}) {
 let now = 100000;
 const engine = new Engine(() => now, settings);
 const room = engine.create(pool, 'quiz', language);
 const players = Array.from({ length: count }, (_, i) => engine.join(room, `Player ${i}`));
 const advance = ms => { now += ms; engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 const question = () => room.bank[room.index];
 const option = text => question().choices.find(choice => choice.text === text).id;
 const answer = (player, text = 'Doğru seçenek') => engine.submitChoice(room, player, question().id, option(text));
 const use = (player, joker) => engine.useJoker(room, player, question().id, joker);
 const reveal = () => engine.revealChoices(room, question().id);
 return { engine, room, players, advance, open, question, option, answer, use, reveal };
}

test('quiz is a third mode sharing choice rules while existing modes keep their letter-based structure', () => {
 assert.equal(QUIZ_QUESTION_COUNT, 30); assert.equal(isChoiceMode('quiz'), true);
 assert.equal(isChoiceMode('multiple-choice'), true); assert.equal(isChoiceMode('buzzer'), false);
 const { engine, room } = setup();
 assert.equal(room.mode, 'quiz'); assert.equal(engine.state(room).total, 30);
 assert.deepEqual(engine.state(room).letters, []);
 assert.equal(engine.create().mode, 'buzzer');
 assert.equal(engine.create(undefined, 'multiple-choice').bank.length, 24);
});

test('bilingual quiz catalog contains at least sixty unique authored four-option questions with no letter constraint', () => {
 const en = quizPoolForLanguage('en'), tr = quizPoolForLanguage('tr');
 assert.ok(en.length >= 60); assert.equal(en.length, tr.length);
 for (const pool of [en, tr]) {
  const validated = validateBank(pool);
  assert.equal(validated.length, pool.length);
  assert.ok(new Set(pool.map(question => question.category)).size >= 8);
  // Similar output choices may naturally share a bracket or numeric prefix;
  // the catalog must not impose one alphabetic initial on every question.
  assert.ok(pool.filter(question => new Set(question.choices.map(choice => choice.text[0].toUpperCase())).size >= 2).length >= pool.length / 2);
  for (const question of pool) {
   assert.equal(question.choices.length, 4);
   assert.equal(question.choices.filter(choice => choice.text === question.answer).length, 1);
   assert.equal(new Set(question.choices.map(choice => choice.text.toLowerCase())).size, 4);
   assert.ok(question.text.length > 20 && question.explanation.trim().length > 10);
   assert.equal(question.letter, '?');
  }
 }
 assert.deepEqual(validateBank(en).map(question => question.id), validateBank(tr).map(question => question.id));
 assert.notEqual(en[0].text, tr[0].text);
 assert.equal(canonicalQuizText(tr[0].text, tr[0].answer), en[0].text);
 assert.equal(canonicalQuizText(tr[0].text + ' Özel düzenleme.', tr[0].answer), undefined);
 assert.equal(canonicalQuizText(tr[0].text, 'Wrong answer'), undefined);
 for (const language of [null, '', 'de', true]) assert.throws(() => quizPoolForLanguage(language));
});

test('quiz catalog calls return independent editable question and choice objects', () => {
 const first = quizPoolForLanguage('tr'), second = quizPoolForLanguage('tr');
 const text = second[0].choices[0].text;
 first[0].text = 'Changed'; first[0].choices[0].text = 'Changed';
 assert.notEqual(second[0].text, 'Changed'); assert.equal(second[0].choices[0].text, text);
});

test('thirty distinct questions are selected without grouping by letter and choices receive opaque stable identifiers', () => {
 const { engine, room, open, question } = setup();
 assert.equal(new Set(room.pool.map(question => question.letter)).size, 1);
 assert.equal(engine.state(room).question.text, ''); assert.equal(engine.state(room).question.choices, undefined);
 open();
 assert.equal(room.bank.length, 30); assert.equal(new Set(room.bank.map(question => question.id)).size, 30);
 const ids = new Set();
 for (const q of room.bank) for (const choice of q.choices) {
  assert.match(choice.id, /^[a-f0-9]{24}$/); ids.add(choice.id);
 }
 assert.equal(ids.size, 120);
 const state = engine.state(room);
 assert.deepEqual(state.question.choices, question().choices.map(({ id, text }) => ({ id, text })));
 assert.equal(state.question.answer, undefined); assert.equal(state.question.explanation, undefined);
 assert.deepEqual(engine.state(room).question.choices, state.question.choices);
 assert.equal(JSON.stringify(state).includes('weight'), false);
});

test('quiz pools require thirty unique questions with four explicit choices and invalid edits preserve the pool', () => {
 const { engine, room } = setup(); const previous = room.pool;
 const invalid = [customPool(29), customPool().map(({ choices, ...question }) => question), customPool().map(question => ({ ...question, choices: question.choices.slice(0, 3) }))];
 for (const pool of invalid) {
  assert.throws(() => engine.setPool(room, pool)); assert.equal(room.pool, previous);
  const count = engine.rooms.size; assert.throws(() => engine.create(pool, 'quiz'));
  assert.equal(engine.rooms.size, count);
 }
 engine.setPool(room, undefined); assert.equal(room.pool.length, quizPoolForLanguage('tr').length);
 assert.equal(room.bank.length, 30);
});

test('saved quiz banks are isolated from letter-based banks, legacy English keys and other languages', () => {
 const values = new Map([['vigola-bank', ['legacy']], ['vigola-bank-en', ['letter-English']], ['vigola-bank-tr', ['letter-Turkish']]]);
 const read = key => values.get(key) ?? null;
 assert.equal(savedBankForLanguage(read, 'en', 'quiz'), undefined);
 values.set(bankStorageKeys('en', 'quiz').bank, ['quiz-English']); values.set(bankStorageKeys('tr', 'quiz').bank, ['quiz-Turkish']);
 assert.deepEqual(savedBankForLanguage(read, 'en', 'quiz'), ['quiz-English']);
 assert.deepEqual(savedBankForLanguage(read, 'tr', 'quiz'), ['quiz-Turkish']);
 assert.deepEqual(savedBankForLanguage(read, 'en', 'multiple-choice'), ['letter-English']);
 assert.deepEqual(savedBankForLanguage(read, 'tr'), ['letter-Turkish']);
 values.set(bankStorageKeys('en', 'quiz').useDefault, true);
 assert.equal(savedBankForLanguage(read, 'en', 'quiz'), undefined);
 assert.deepEqual(savedBankForLanguage(read, 'en'), ['letter-English']);
});

test('quiz retains fifteen seconds, first-correct scoring, simultaneous answers and early completion', () => {
 const { engine, room, players: [ada, ece], open, advance, answer, question } = setup({ count: 2 });
 open(); assert.equal(room.deadline, room.revealAt + MULTIPLE_CHOICE_SECONDS * 1000);
 advance(3000); answer(ada); answer(ece, 'Benzer yanlış');
 assert.equal(ada.score, 0); advance(0);
 assert.equal(room.phase, 'resolved'); assert.equal(ada.score, 135); assert.equal(ece.score, -17);
 assert.equal(engine.state(room).question.answer, question().answer);
 assert.equal(engine.state(room).completed[0].choiceResults[0].firstCorrectBonus, true);
 assert.throws(() => engine.buzz(room, ada), /seçenek seç/);
});

test('quiz supports every joker together, double-answer bombs, x2 penalties and shields', () => {
 const { engine, room, players: [ada, ece, can], open, use, answer, advance, question, option } = setup();
 open(); for (const joker of JOKERS) use(ada, joker);
 use(ece, 'bomb'); use(ece, 'shield'); use(ece, 'double-points');
 const own = engine.playerAnswer(room, ada);
 assert.deepEqual(own.jokers, JOKERS);
 const remaining = question().choices.find(choice => choice.text !== question().answer && !own.eliminatedChoiceIds.includes(choice.id));
 advance(3000); answer(ada, remaining.text); advance(4500); answer(ada);
 assert.throws(() => engine.submitChoice(room, can, question().id, option(question().answer)), /Bomba patladı/);
 advance(0);
 assert.equal(ada.score, 450); assert.equal(ece.score, 0); assert.equal(can.score, -50);
 assert.equal(room.choiceResults.find(result => result.id === ada.id).bombOutcome, 'winner');
 assert.equal(room.choiceResults.find(result => result.id === can.id).penaltyMultiplier, 2);
 assert.equal(ece.availableJokers.has('bomb'), false);
});

test('quiz reconnect restores all private jokers and selected choices and next question resets only round state', () => {
 const { engine, room, players: [ada], open, use, answer, reveal } = setup();
 open(); use(ada, 'shield'); use(ada, 'double-answer'); answer(ada, 'Benzer yanlış');
 const before = engine.playerAnswer(room, ada); const resumed = engine.join(room, '', ada.token);
 assert.deepEqual(engine.playerAnswer(room, resumed), before); answer(resumed); reveal();
 open(); const after = engine.playerAnswer(room, resumed);
 assert.deepEqual(after.jokers, []); assert.deepEqual(after.choiceIds, []);
 assert.equal(after.availableJokers.includes('shield'), false); assert.equal(after.availableJokers.includes('double-answer'), false);
 assert.equal(room.firstCorrectId, null);
});

test('quiz closes unanswered questions automatically and rejects submissions at the exact deadline', () => {
 const { engine, room, players: [ada], open, question, option, advance } = setup();
 open(); const deadline = room.deadline; advance(15000);
 assert.equal(room.phase, 'resolved'); assert.equal(ada.score, 0); assert.equal(room.history.length, 1);
 assert.throws(() => engine.submitChoice(room, ada, question().id, option(question().answer)), /cevap gönderilemez/);
 assert.equal(deadline, room.revealAt + 15000);
});

test('exactly thirty resolved questions complete the quiz, persist once and never expose unplayed pool questions', () => {
 const saved = [];
 const { engine, room, open, reveal } = setup({ settings: { saveUsedQuestions: used => saved.push(new Set(used)) } });
 for (let index = 0; index < 30; index++) {
  open(); assert.equal(room.index, index); reveal();
  assert.equal(saved.length, index === 29 ? 1 : 0);
  const state = engine.state(room); assert.equal(state.completed.length, index + 1);
  assert.equal(state.completed.every(entry => entry.index <= index), true);
 }
 assert.equal(room.history.length, 30); assert.equal(saved[0].size, 30);
 assert.equal(engine.start(room), true); assert.equal(room.phase, 'final'); assert.equal(room.index, 29);
 assert.equal(engine.start(room), false);
});

test('unseen quiz questions are preferred, while an exhausted pool safely refills without repeating within a race', () => {
 const pool = customPool(60), ids = validateBank(pool).map(question => question.id);
 const unused = new Set(ids.slice(30));
 const fresh = setup({ pool, settings: { usedQuestions: new Set(ids.slice(0, 30)) } }); fresh.open();
 assert.equal(fresh.room.bank.every(question => unused.has(question.id)), true);
 const exhausted = setup({ pool, settings: { usedQuestions: new Set(ids) } }); exhausted.open();
 assert.equal(exhausted.room.bank.length, 30); assert.equal(new Set(exhausted.room.bank.map(question => question.id)).size, 30);
});

test('completed quiz history carries across languages without consuming questions from unfinished races', () => {
 let now = 100000; const engine = new Engine(() => now);
 const en = engine.create(undefined, 'quiz', 'en');
 for (let index = 0; index < 30; index++) { engine.start(en); now += 3000; engine.tick(); engine.revealChoices(en, en.bank[index].id); }
 const consumed = new Set(en.bank.map(question => question.id));
 assert.equal(engine.usedQuestions.size, 30);
 const tr = engine.create(undefined, 'quiz', 'tr'); engine.start(tr);
 assert.equal(tr.bank.some(question => consumed.has(question.id)), false);
 assert.equal(engine.usedQuestions.size, 30);
});

test('quiz final persistence failures leave scores untouched and retry the last question only once', () => {
 let fail = true, writes = 0;
 const { engine, room, players: [ada], open, answer, reveal, advance } = setup({ count: 1, pool: customPool(30), settings: { saveUsedQuestions: () => {
  writes++; if (fail) throw new Error('disk unavailable');
 } } });
 for (let index = 0; index < 29; index++) { open(); reveal(); }
 open(); answer(ada); advance(0);
 assert.equal(room.phase, 'open'); assert.equal(ada.score, 0); assert.equal(writes, 1);
 assert.equal(engine.state(room).completed.length, 29);
 fail = false; advance(1000);
 assert.equal(room.phase, 'resolved'); assert.equal(ada.score, 300); assert.equal(writes, 2);
 assert.equal(engine.state(room).completed.length, 30);
 advance(15000); assert.equal(ada.score, 300); assert.equal(writes, 2);
});
