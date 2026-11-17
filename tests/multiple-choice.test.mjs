import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine, validateBank } from '../server/engine.mjs';
import { questions } from '../lib/questions.mjs';
import { ANSWER_SECONDS } from '../lib/game-rules.mjs';

const options = (answer = 'API') => [
 { id: 'option-one', text: answer },
 { id: 'option-two', text: 'Adapter' },
 { id: 'option-three', text: 'Array' },
 { id: 'option-four', text: 'Assertion' },
];
const sample = changes => ({ ...questions[0], choices: options(), ...changes });
function setup(bank = [sample(), questions[1]], settings) {
 let now = 100000;
 const engine = new Engine(() => now, settings);
 const room = engine.create(bank, 'multiple-choice');
 const ada = engine.join(room, 'Ada'); ada.sockets.add('ada');
 const ece = engine.join(room, 'Ece'); ece.sockets.add('ece');
 const elapse = ms => { now += ms; };
 const advance = ms => { elapse(ms); engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 const question = () => room.bank[room.index];
 const correct = () => question().choices.find(choice => choice.text === question().answer);
 const wrong = () => question().choices.find(choice => choice.text !== question().answer);
 return { engine, room, ada, ece, advance, elapse, open, question, correct, wrong };
}

test('room mode defaults to buzzer and invalid modes never create rooms', () => {
 const engine = new Engine();
 assert.equal(engine.create().mode, 'buzzer');
 assert.equal(engine.state(engine.create()).mode, 'buzzer');
 const count = engine.rooms.size;
 for (const mode of [null, '', 'quiz', {}, true]) assert.throws(() => engine.create(undefined, mode), /oyun modu/);
 assert.equal(engine.rooms.size, count);
});

test('explicit choices retain weights and reject ambiguous or invalid option banks', () => {
 const valid = sample({ choices: [
  { id: 'a', text: 'API', weight: 150 }, { id: 'b', text: 'Adapter', weight: -40 },
 ] });
 assert.deepEqual(validateBank([valid])[0].choices, valid.choices);
 assert.equal(validateBank(questions)[0].choices, undefined);
 for (const choices of [
  null, [], [{ id: 'a', text: 'API' }],
  [...options(), { id: 'five', text: 'A' }, { id: 'six', text: 'B' }, { id: 'seven', text: 'C' }],
  [{ id: 'a', text: 'API' }, { id: 'a', text: 'Adapter' }],
  [{ id: 'a', text: 'API' }, { id: 'b', text: 'api' }],
  [{ id: 'a', text: 'Adapter' }, { id: 'b', text: 'Array' }],
  [{ id: 'a', text: 'API', weight: -1 }, { id: 'b', text: 'Adapter' }],
  [{ id: 'a', text: 'API' }, { id: 'b', text: 'Adapter', weight: 1 }],
  [{ id: 'a', text: 'API', weight: NaN }, { id: 'b', text: 'Adapter' }],
  [{ id: 'a', text: 'API', weight: 1001 }, { id: 'b', text: 'Adapter' }],
  [{ id: 'a', text: 'API' }, { id: 'b', text: 'Adapter', weight: -1001 }],
  [null, { id: 'a', text: 'API' }],
 ]) assert.throws(() => validateBank([sample({ choices })]));
});

test('every built-in question receives four opaque same-letter options', () => {
 const engine = new Engine();
 const room = engine.create(undefined, 'multiple-choice');
 assert.equal(room.pool.length, 264);
 const ids = new Set();
 for (const question of room.pool) {
  assert.equal(question.choices.length, 4);
  assert.equal(question.choices.filter(choice => choice.text === question.answer).length, 1);
  assert.equal(new Set(question.choices.map(choice => choice.text.toLowerCase())).size, 4);
  for (const choice of question.choices) {
   assert.match(choice.id, /^[a-f0-9]{24}$/);
   assert.equal(choice.text[0].toUpperCase(), question.letter);
   ids.add(choice.id);
  }
 }
 assert.equal(ids.size, 264 * 4);
 const custom = engine.create([{ ...questions[0], letter: 'Q', answer: 'Quantum state', text: 'Which custom answer is correct?' }], 'multiple-choice');
 assert.equal(custom.pool[0].choices.length, 4);
 assert.equal(custom.pool[0].choices.filter(choice => choice.text === 'Quantum state').length, 1);
});

test('choices stay stable while open and secrets and individual selections remain private until reveal', () => {
 const { engine, room, ada, open, question, correct } = setup([sample({ choices: [
  { id: 'right', text: 'API', weight: 160 }, { id: 'wrong', text: 'Adapter', weight: -55 },
 ] })]);
 for (const phase of ['lobby', 'countdown']) {
  if (phase === 'countdown') engine.start(room);
  const state = engine.state(room);
  assert.equal(state.question.text, '');
  assert.equal(state.question.choices, undefined);
  assert.equal(state.question.answer, undefined);
  assert.equal(state.question.explanation, undefined);
  assert.deepEqual(state.choiceResults, []);
 }
 open();
 const before = engine.state(room).question.choices;
 assert.deepEqual(engine.state(room).question.choices, before);
 for (const choice of before) assert.deepEqual(Object.keys(choice).sort(), ['id', 'text']);
 engine.submitChoice(room, ada, question().id, correct().id);
 const state = engine.state(room);
 assert.deepEqual(state.submitted, [ada.id]);
 assert.deepEqual(state.choiceResults, []);
 assert.equal(state.players.find(player => player.id === ada.id).score, 0);
 assert.equal(state.question.answer, undefined);
 assert.equal(state.question.explanation, undefined);
 assert.deepEqual(state.question.choices, before);
 assert.equal(JSON.stringify(state).includes(ada.token), false);
 assert.equal(JSON.stringify(state).includes(room.token), false);
 assert.equal(JSON.stringify(state).includes('"weight"'), false);
});

test('submissions reject wrong mode, early, stale, invalid, duplicate and foreign-player answers', () => {
 const { engine, room, ada, open, question, correct } = setup();
 assert.throws(() => engine.submitChoice(room, ada, question().id, correct().id), /cevap gönderilemez/);
 engine.start(room);
 assert.throws(() => engine.submitChoice(room, ada, question().id, correct().id), /cevap gönderilemez/);
 open();
 assert.throws(() => engine.submitChoice(room, ada, 'old-question', correct().id), /aktif değil/);
 assert.throws(() => engine.submitChoice(room, ada, question().id, 'missing-option'), /seçenek/);
 assert.throws(() => engine.submitChoice(room, undefined, question().id, correct().id), /katıl/);
 assert.throws(() => engine.submitChoice(room, { ...ada }, question().id, correct().id), /katıl/);
 const another = engine.create();
 const foreign = engine.join(another, 'Other');
 assert.throws(() => engine.submitChoice(room, foreign, question().id, correct().id), /katıl/);
 assert.equal(room.submissions.size, 0);
 engine.submitChoice(room, ada, question().id, correct().id);
 assert.throws(() => engine.submitChoice(room, ada, question().id, correct().id), /tekrar seçemezsin/);
 const buzzer = engine.create();
 const player = engine.join(buzzer, 'Buzzer');
 assert.throws(() => engine.submitChoice(buzzer, player, buzzer.bank[0].id, 'option'), /çoktan seçmeli/);
 assert.throws(() => engine.revealChoices(buzzer, buzzer.bank[0].id), /çoktan seçmeli/);
});

test('Next reveals and scores all answers once using each question defaults and signed rounding', () => {
 const { engine, room, ada, ece, open, question, correct, wrong } = setup([sample({ points: 120, penalty: 35, multiplier: 2.5 })]);
 const unanswered = engine.join(room, 'No answer');
 open();
 engine.submitChoice(room, ada, question().id, correct().id);
 engine.submitChoice(room, ece, question().id, wrong().id);
 assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 assert.throws(() => engine.revealChoices(room, 'stale'), /aktif değil/);
 assert.equal(engine.revealChoices(room, question().id), true);
 assert.equal(room.phase, 'resolved'); assert.equal(room.index, 0);
 assert.equal(ada.score, 300); assert.equal(ada.correct, 1);
 assert.equal(ece.score, -88); assert.equal(ece.wrong, 1);
 assert.equal(unanswered.score, 0); assert.equal(unanswered.correct, 0); assert.equal(unanswered.wrong, 0);
 const state = engine.state(room);
 assert.equal(state.question.answer, 'API');
 assert.deepEqual(state.choiceResults.find(result => result.id === unanswered.id), { id: unanswered.id, choiceId: null, correct: null, delta: 0 });
 assert.equal(state.choiceResults.find(result => result.id === ada.id).delta, 300);
 assert.equal(state.choiceResults.find(result => result.id === ece.id).delta, -88);
 assert.equal(engine.revealChoices(room, question().id), false);
 assert.equal(ada.score, 300); assert.equal(ece.score, -88);
 assert.throws(() => engine.submitChoice(room, unanswered, question().id, correct().id), /cevap gönderilemez/);
 engine.start(room); assert.equal(room.phase, 'final');
 assert.equal(engine.state(room).choiceResults.length, 3);
});

test('per-option weights override defaults and zero-weight answers still count as correct or wrong', () => {
 const { engine, room, ada, ece, open, question, correct, wrong } = setup([sample({ multiplier: 2.5, choices: [
  { id: 'a', text: 'API', weight: 155 }, { id: 'b', text: 'Adapter', weight: -17 },
 ] })]);
 open(); engine.submitChoice(room, ada, question().id, correct().id); engine.submitChoice(room, ece, question().id, wrong().id);
 engine.revealChoices(room, question().id);
 assert.equal(ada.score, 388); assert.equal(ece.score, -43);
 assert.equal(engine.state(room).question.choices.find(choice => choice.text === 'API').weight, 155);
 const zero = setup([sample({ choices: [{ id: 'a', text: 'API', weight: 0 }, { id: 'b', text: 'Adapter', weight: 0 }] })]);
 zero.open(); zero.engine.submitChoice(zero.room, zero.ada, zero.question().id, zero.correct().id); zero.engine.submitChoice(zero.room, zero.ece, zero.question().id, zero.wrong().id);
 zero.engine.revealChoices(zero.room, zero.question().id);
 assert.equal(zero.ada.score, 0); assert.equal(zero.ece.score, 0);
 assert.equal(zero.ada.correct, 1); assert.equal(zero.ece.wrong, 1);
});

test('MC cannot bypass reveal through buzzer controls and automatically resolves after ten seconds', () => {
 const { engine, room, ada, advance, open, question, correct } = setup();
 open();
 assert.equal(ANSWER_SECONDS, 10);
 assert.equal(room.deadline, room.revealAt + 10000);
 assert.throws(() => engine.buzz(room, ada), /seçenek seç/);
 const count = room.players.size;
 assert.throws(() => engine.hostBuzz(room, 'host'), /seçenek seç/);
 assert.equal(room.players.size, count);
 assert.equal(engine.judge(room, true), false);
 assert.equal(engine.pass(room), false);
 assert.equal(engine.start(room), false);
 engine.submitChoice(room, ada, question().id, correct().id);
 advance(9999);
 assert.equal(room.phase, 'open'); assert.equal(ada.score, 0);
 advance(1);
 assert.equal(room.phase, 'resolved'); assert.equal(room.deadline, null);
 assert.equal(ada.score, 100); assert.equal(room.history.length, 1);
 advance(60000);
 assert.equal(ada.score, 100); assert.equal(room.history.length, 1);
});

test('earlier correct answers earn more and revealing never changes the recorded answer time', () => {
 const { engine, room, ada, ece, advance, open, question, correct } = setup([sample()]);
 open(); advance(2000);
 engine.submitChoice(room, ada, question().id, correct().id);
 advance(3000);
 engine.submitChoice(room, ece, question().id, correct().id);
 assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 assert.deepEqual(engine.state(room).choiceResults, []);
 assert.equal(JSON.stringify(engine.state(room)).includes('elapsedMs'), false);
 advance(5000);
 assert.equal(ada.score, 90); assert.equal(ece.score, 75);
 assert.deepEqual(room.choiceResults.map(({ delta, elapsedMs }) => ({ delta, elapsedMs })), [
  { delta: 90, elapsedMs: 2000 }, { delta: 75, elapsedMs: 5000 },
 ]);
 assert.equal(engine.revealChoices(room, question().id), false);
 assert.equal(ada.score, 90);
});

test('simultaneous correct answers share the weighted speed score on early manual reveal', () => {
 const { engine, room, ada, ece, advance, open, question, correct } = setup([sample({ multiplier: 2.5, choices: [
  { id: 'a', text: 'API', weight: 155 }, { id: 'b', text: 'Adapter', weight: -17 },
 ] })]);
 open(); advance(5000);
 engine.submitChoice(room, ada, question().id, correct().id);
 engine.submitChoice(room, ece, question().id, correct().id);
 advance(1000); engine.revealChoices(room, question().id);
 assert.equal(ada.score, 291); assert.equal(ece.score, 291);
 advance(10000);
 assert.equal(ada.score, 291); assert.equal(ece.score, 291);
});

test('wrong penalties and zero weights do not change with answer speed', () => {
 const { engine, room, ada, ece, advance, open, question, wrong } = setup([sample({ multiplier: 2.5, choices: [
  { id: 'a', text: 'API', weight: 0 }, { id: 'b', text: 'Adapter', weight: -17 },
 ] })]);
 open(); engine.submitChoice(room, ada, question().id, wrong().id);
 advance(9000); engine.submitChoice(room, ece, question().id, wrong().id);
 advance(1000);
 assert.equal(ada.score, -43); assert.equal(ece.score, -43);
 const zero = setup([sample({ choices: [{ id: 'a', text: 'API', weight: 0 }, { id: 'b', text: 'Adapter', weight: 0 }] })]);
 zero.open(); zero.advance(9000);
 zero.engine.submitChoice(zero.room, zero.ada, zero.question().id, zero.correct().id);
 zero.advance(1000);
 assert.equal(zero.ada.score, 0); assert.equal(zero.ada.correct, 1);
});

test('deadline rejects late submissions even before the next timer tick', () => {
 const { engine, room, ada, ece, advance, elapse, open, question, correct } = setup([sample()]);
 open(); elapse(9999);
 engine.submitChoice(room, ada, question().id, correct().id);
 elapse(1);
 assert.equal(room.phase, 'open');
 assert.throws(() => engine.submitChoice(room, ece, question().id, correct().id), /süresi doldu/);
 assert.equal(room.submissions.has(ece.id), false);
 advance(0);
 assert.equal(ada.score, 50); assert.equal(ece.score, 0);
 assert.equal(room.phase, 'resolved');
});

test('delayed ticks keep the original ten-second deadline and unanswered questions resolve without penalties', () => {
 const { engine, room, ada, ece, elapse, advance } = setup([sample()]);
 engine.start(room); elapse(14000); advance(0);
 assert.equal(room.phase, 'resolved');
 assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 assert.equal(room.history[0].status, 'passed');
 assert.equal(room.choiceResults.every(result => result.correct === null && result.delta === 0), true);
});

test('reconnection retains the immutable selection and next question resets only current answers', () => {
 const { engine, room, ada, open, advance, question, correct } = setup();
 open();
 const first = question();
 advance(2000);
 engine.submitChoice(room, ada, first.id, correct().id);
 ada.sockets.clear();
 const resumed = engine.join(room, 'ignored', ada.token); resumed.sockets.add('resumed');
 assert.equal(resumed, ada);
 assert.equal(room.submissions.get(ada.id), correct().id);
 assert.equal(room.submissionTimes.get(ada.id), room.revealAt + 2000);
 assert.throws(() => engine.submitChoice(room, resumed, first.id, correct().id), /tekrar seçemezsin/);
 engine.revealChoices(room, first.id);
 const oldResults = engine.state(room).choiceResults;
 engine.start(room);
 assert.equal(room.index, 1); assert.equal(room.phase, 'countdown');
 assert.equal(room.submissions.size, 0); assert.deepEqual(engine.state(room).choiceResults, []);
 assert.equal(room.submissionTimes.size, 0); assert.equal(room.deadline, null);
 const completed = engine.state(room).completed;
 assert.equal(completed.length, 1); assert.equal(completed[0].answer, 'API');
 assert.deepEqual(completed[0].choiceResults, oldResults);
 assert.equal(completed[0].choices.some(choice => choice.text === 'API'), true);
 assert.equal(JSON.stringify(completed).includes('Binary search'), false);
 advance(3000);
 assert.equal(room.deadline, room.revealAt + ANSWER_SECONDS * 1000);
 assert.throws(() => engine.submitChoice(room, resumed, first.id, first.choices[0].id), /aktif değil/);
 assert.throws(() => engine.revealChoices(room, first.id), /aktif değil/);
 assert.equal(ada.score, 90);
});

test('final reveal persists a completed wheel while incomplete games consume nothing', () => {
 const saved = [];
 const { engine, room, ada, open, advance, question, correct } = setup(undefined, { saveUsedQuestions: used => saved.push(new Set(used)) });
 open(); engine.submitChoice(room, ada, question().id, correct().id); engine.revealChoices(room, question().id);
 assert.equal(saved.length, 0); assert.equal(engine.usedQuestions.size, 0);
 engine.start(room); advance(3000);
 engine.revealChoices(room, question().id);
 assert.equal(saved.length, 1); assert.equal(saved[0].size, 2); assert.equal(engine.usedQuestions.size, 2);
 assert.equal(engine.state(room).completed.length, 2);
 assert.equal(room.history[1].status, 'passed');
 assert.equal(ada.score, 100);
});

test('a persistence failure on final reveal leaves all scores and answers unresolved for safe retry', () => {
 let fail = true;
 const { engine, room, ada, ece, open, question, correct, wrong } = setup([sample()], { saveUsedQuestions: () => { if (fail) throw new Error('disk unavailable'); } });
 open(); engine.submitChoice(room, ada, question().id, correct().id); engine.submitChoice(room, ece, question().id, wrong().id);
 assert.throws(() => engine.revealChoices(room, question().id), /disk unavailable/);
 assert.equal(room.phase, 'open'); assert.equal(room.history.length, 0);
 assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 assert.equal(ada.correct, 0); assert.equal(ece.wrong, 0);
 assert.equal(engine.usedQuestions.size, 0);
 assert.deepEqual(engine.state(room).choiceResults, []);
 fail = false; engine.revealChoices(room, question().id);
 assert.equal(ada.score, 100); assert.equal(ece.score, -25);
 assert.equal(engine.usedQuestions.size, 1);
});

test('automatic reveal retries failed persistence without blocking other rooms or allowing late answers', () => {
 let fail = true;
 let writes = 0;
 const { engine, room, ada, ece, open, advance, question, correct } = setup([sample()], { saveUsedQuestions: () => {
  writes++; if (fail) throw new Error('disk unavailable');
 } });
 const other = engine.create([questions[1], questions[2]], 'multiple-choice');
 engine.start(other); open();
 engine.submitChoice(room, ada, question().id, correct().id);
 advance(10000);
 assert.equal(room.phase, 'open'); assert.equal(ada.score, 0); assert.equal(writes, 1);
 assert.equal(other.phase, 'resolved'); assert.equal(other.history.length, 1);
 assert.throws(() => engine.submitChoice(room, ece, question().id, correct().id), /süresi doldu/);
 advance(999); assert.equal(writes, 1);
 fail = false; advance(1);
 assert.equal(writes, 2); assert.equal(room.phase, 'resolved');
 assert.equal(ada.score, 100); assert.equal(ece.score, 0);
 advance(10000); assert.equal(ada.score, 100); assert.equal(writes, 2);
});
