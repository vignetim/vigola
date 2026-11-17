import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../server/engine.mjs';
import { questions } from '../lib/questions.mjs';

const bank = questions.slice(0, 2).map(question => ({ ...question, choices: [
 { id: 'right', text: question.answer },
 { id: 'wrong', text: 'Incorrect', weight: -17 },
 { id: 'other', text: 'Other incorrect', weight: -99 },
] }));
function setup({ pool = bank, count = 2, settings } = {}) {
 let now = 100000;
 const engine = new Engine(() => now, settings);
 const room = engine.create(pool, 'multiple-choice');
 const players = Array.from({ length: count }, (_, index) => engine.join(room, `Player ${index}`));
 const advance = ms => { now += ms; engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 const answer = (player, choiceId) => engine.submitChoice(room, player, room.bank[room.index].id, choiceId);
 const use = (player, joker) => engine.useJoker(room, player, room.bank[room.index].id, joker);
 return { engine, room, players, advance, open, answer, use };
}

test('all players completing answers reveals results on the next server tick without waiting for expiry', () => {
 const { engine, room, players: [ada, ece], advance, open, answer } = setup();
 engine.watch(room, 'watcher', 'Spectator');
 open(); const deadline = room.deadline;
 advance(3000); answer(ada, 'right'); advance(1000);
 assert.equal(room.phase, 'open'); assert.equal(room.deadline, deadline);
 assert.equal(ada.score, 0); assert.deepEqual(engine.state(room).choiceResults, []);
 answer(ece, 'right'); advance(0);
 assert.equal(room.phase, 'resolved'); assert.equal(room.deadline, null);
 assert.equal(ada.score, 135); assert.equal(ece.score, 87);
 assert.equal(room.history.length, 1);
 advance(20000);
 assert.equal(ada.score, 135); assert.equal(room.history.length, 1);
});

test('early completion waits for both selections of double-answer even when everyone has submitted once', () => {
 const { room, players: [ada, ece], advance, open, answer, use } = setup();
 open(); use(ada, 'double-answer');
 advance(3000); answer(ada, 'wrong'); answer(ece, 'right'); advance(0);
 assert.equal(room.phase, 'open'); assert.equal(ada.score, 0);
 advance(4500); answer(ada, 'right'); advance(0);
 assert.equal(room.phase, 'resolved'); assert.equal(ada.score, 75); assert.equal(ece.score, 135);
});

test('double-answer with only one selection still closes at the fifteen-second deadline', () => {
 const { room, players: [ada, ece], advance, open, answer, use } = setup();
 open(); use(ada, 'double-answer'); answer(ada, 'right'); answer(ece, 'wrong');
 advance(14999); assert.equal(room.phase, 'open');
 advance(1); assert.equal(room.phase, 'resolved'); assert.equal(ada.score, 150);
});

test('no-player rooms stay open until the deadline, while a single-player response resolves immediately', () => {
 const empty = setup({ count: 0 }); empty.open(); empty.advance(1);
 assert.equal(empty.room.phase, 'open'); empty.advance(14999);
 assert.equal(empty.room.phase, 'resolved');
 const solo = setup({ count: 1 }); solo.open(); solo.answer(solo.players[0], 'right'); solo.advance(0);
 assert.equal(solo.room.phase, 'resolved'); assert.equal(solo.players[0].score, 300);
});

test('players joining during an open question must also answer before early completion', () => {
 const { engine, room, players: [ada, ece], advance, open, answer } = setup();
 open(); answer(ada, 'right');
 const newcomer = engine.join(room, 'New player');
 answer(ece, 'wrong'); advance(0); assert.equal(room.phase, 'open');
 answer(newcomer, 'wrong'); advance(0); assert.equal(room.phase, 'resolved');
 assert.equal(ada.score, 150);
});

test('early reveal persistence failure closes submissions immediately and retries scoring atomically', () => {
 let fail = true, writes = 0;
 const { engine, room, players: [ada, ece], advance, open, answer, use } = setup({ pool: [bank[0]], settings: { saveUsedQuestions: () => {
  writes++; if (fail) throw new Error('disk unavailable');
 } } });
 open(); answer(ada, 'right'); answer(ece, 'wrong'); advance(1000);
 assert.equal(room.phase, 'open'); assert.equal(room.deadline, room.revealAt + 1000);
 assert.equal(ada.score, 0); assert.equal(ece.score, 0); assert.equal(writes, 1);
 assert.throws(() => answer(ada, 'other'), /süresi doldu/);
 assert.throws(() => use(ece, 'double-points'), /süresi doldu/);
 const newcomer = engine.join(room, 'Late arrival');
 assert.throws(() => answer(newcomer, 'right'), /süresi doldu/);
 advance(999); assert.equal(writes, 1);
 fail = false; advance(1);
 assert.equal(room.phase, 'resolved'); assert.equal(ada.score, 150); assert.equal(ece.score, -17);
 assert.equal(writes, 2); advance(20000); assert.equal(writes, 2); assert.equal(ada.score, 150);
});

test('double-points doubles only the rounded correct speed score and remains private until results', () => {
 const { engine, room, players: [ada, ece], advance, open, answer, use } = setup();
 open(); use(ada, 'double-points'); advance(3000); answer(ada, 'right');
 assert.deepEqual(engine.playerAnswer(room, ada).jokers, ['double-points']);
 assert.deepEqual(engine.playerAnswer(room, ece).jokers, []);
 assert.equal(JSON.stringify(engine.state(room)).includes('double-points'), false);
 answer(ece, 'wrong'); advance(0);
 assert.equal(ada.score, 270); assert.equal(ece.score, -34);
 const result = room.choiceResults.find(result => result.id === ada.id);
 assert.deepEqual(result.jokers, ['double-points']); assert.equal(result.soloBonus, false);
 assert.equal(result.delta, 270); advance(20000); assert.equal(ada.score, 270);
});

test('double-points stacks with the solo bonus after weighted rounding and survives reconnection', () => {
 const { engine, room, players: [ada], advance, open, answer, use } = setup({
  count: 1, pool: [{ ...bank[0], multiplier: 2.5, choices: bank[0].choices.map(choice => choice.id === 'right' ? { ...choice, weight: 155 } : choice) }],
 });
 open(); use(ada, 'double-points'); advance(7500);
 const resumed = engine.join(room, '', ada.token);
 assert.deepEqual(engine.playerAnswer(room, resumed).jokers, ['double-points']);
 assert.equal(resumed.availableJokers.has('double-points'), false);
 answer(resumed, 'right'); advance(0);
 assert.equal(ada.score, 1746); assert.equal(ada.correct, 1);
 assert.equal(room.choiceResults[0].soloBonus, true);
});

test('double-points leaves wrong penalties and zero-weight correct answers unchanged', () => {
 const wrong = setup({ count: 1, pool: [{ ...bank[0], multiplier: 2.5 }] });
 wrong.open(); wrong.use(wrong.players[0], 'double-points'); wrong.answer(wrong.players[0], 'wrong'); wrong.advance(0);
 assert.equal(wrong.players[0].score, -43); assert.equal(wrong.players[0].wrong, 1);
 const zero = setup({ count: 1, pool: [{ ...bank[0], choices: bank[0].choices.map(choice => choice.id === 'right' ? { ...choice, weight: 0 } : choice) }] });
 zero.open(); zero.use(zero.players[0], 'double-points'); zero.answer(zero.players[0], 'right'); zero.advance(0);
 assert.equal(zero.players[0].score, 0); assert.equal(zero.players[0].correct, 1);
});

test('double-points is consumed once per game, combines with other jokers, and expires without an answer', () => {
 const { engine, room, players: [ada], advance, open, answer, use } = setup({ count: 1 });
 open(); use(ada, 'double-points');
 assert.equal(use(ada, 'shield'), true);
 advance(15000); assert.equal(ada.score, 0); assert.equal(ada.correct, 0);
 open(); assert.throws(() => use(ada, 'double-points'), /zaten kullandın/);
 answer(ada, 'right'); advance(0); assert.equal(ada.score, 450);
 assert.deepEqual(engine.playerAnswer(room, ada).jokers, []);
});
