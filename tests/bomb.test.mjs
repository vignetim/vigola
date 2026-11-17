import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../server/engine.mjs';
import { questions } from '../lib/questions.mjs';

const bank = questions.slice(0, 2).map(question => ({ ...question, points: 100, penalty: 25, multiplier: 1, choices: [
 { id: 'right', text: question.answer },
 { id: 'wrong', text: 'Incorrect', weight: -17 },
 { id: 'other', text: 'Other incorrect', weight: -99 },
] }));
function setup({ count = 3, pool = bank, settings } = {}) {
 let now = 100000;
 const engine = new Engine(() => now, settings);
 const room = engine.create(pool, 'multiple-choice');
 const players = Array.from({ length: count }, (_, i) => engine.join(room, `Player ${i}`));
 const elapse = ms => { now += ms; };
 const advance = ms => { elapse(ms); engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 const use = (player, joker = 'bomb') => engine.useJoker(room, player, room.bank[room.index].id, joker);
 const answer = (player, choiceId) => engine.submitChoice(room, player, room.bank[room.index].id, choiceId);
 const reveal = () => engine.revealChoices(room, room.bank[room.index].id);
 const result = player => room.choiceResults.find(result => result.id === player.id);
 return { engine, room, players, elapse, advance, open, use, answer, reveal, result };
}

test('a correct bomb locks all answers and jokers immediately, before the timer tick reveals results', () => {
 const { engine, room, players: [ada, ece, can], open, use, answer, advance, result } = setup();
 engine.watch(room, 'watch', 'Spectator');
 open(); use(ada); advance(3000); answer(ada, 'right');
 assert.equal(room.bombWinner, ada.id);
 assert.equal(room.deadline, room.revealAt + 3000);
 assert.throws(() => answer(ece, 'right'), /Bomba patladı/);
 assert.throws(() => use(can, 'shield'), /Bomba patladı/);
 assert.equal(can.availableJokers.has('shield'), true);
 assert.deepEqual(engine.state(room).choiceResults, []);
 assert.equal(JSON.stringify(engine.state(room)).includes('bombOutcome'), false);
 assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 advance(0);
 assert.equal(room.phase, 'resolved'); assert.equal(ada.score, 270);
 assert.equal(result(ada).bombOutcome, 'winner');
 assert.equal(ece.score, -25); assert.equal(can.score, -25);
 assert.equal(result(ece).correct, null); assert.equal(result(ece).bombOutcome, 'hit');
 assert.equal(ece.wrong, 0); assert.equal(ece.correct, 0);
 assert.equal(engine.state(room).watchers.length, 1);
 advance(20000); assert.equal(ece.score, -25); assert.equal(room.history.length, 1);
});

test('bomb activation alone or an incorrect bomb answer never blocks others or applies bomb penalties', () => {
 const { room, players: [ada, ece, can], open, use, answer, advance, result } = setup();
 open(); use(ada); advance(3000);
 assert.equal(room.bombWinner, null); assert.equal(room.phase, 'open');
 answer(ada, 'wrong'); answer(ece, 'right'); advance(0);
 assert.equal(room.phase, 'open'); assert.equal(room.bombWinner, null);
 advance(12000);
 assert.equal(room.phase, 'resolved'); assert.equal(ada.score, -17); assert.equal(ece.score, 135); assert.equal(can.score, 0);
 assert.equal(result(ada).bombOutcome, undefined);
 assert.equal(ada.availableJokers.has('bomb'), false);
});

test('the first correct bomb arrival wins same-millisecond races regardless of activation order', () => {
 const { engine, room, players: [ada, ece], open, use, answer, advance, result } = setup({ count: 2 });
 open(); use(ece); use(ada);
 answer(ada, 'right');
 assert.throws(() => answer(ece, 'right'), /Bomba patladı/);
 assert.equal(room.bombWinner, ada.id);
 assert.equal(ada.availableJokers.has('bomb'), false); assert.equal(ece.availableJokers.has('bomb'), false);
 advance(0);
 assert.equal(result(ada).bombOutcome, 'winner'); assert.equal(result(ece).bombOutcome, 'hit');
 assert.deepEqual(result(ece).jokers, ['bomb']); assert.equal(ece.score, -25);
 open(); assert.equal(room.bombWinner, null); assert.equal(room.bombTargets.size, 0);
 assert.throws(() => use(ece), /zaten kullandın/);
 assert.deepEqual(engine.playerAnswer(room, ece).jokers, []);
});

test('an earlier incorrect bomb does not beat a later correct bomb', () => {
 const { players: [ada, ece], room, open, use, answer, advance, result } = setup({ count: 2 });
 open(); use(ada); use(ece); answer(ada, 'wrong'); advance(1000);
 assert.equal(room.phase, 'open'); answer(ece, 'right'); advance(0);
 assert.equal(room.bombWinner, ece.id); assert.equal(result(ece).bombOutcome, 'winner');
 assert.equal(ada.score, -25); assert.equal(ada.wrong, 1);
 assert.equal(ece.score, 146); assert.equal(ece.correct, 1);
});

test('bomb replaces earlier correct rewards and per-option penalties with the question penalty', () => {
 const { players: [ada, ece, can], open, use, answer, advance, result } = setup({ pool: [{ ...bank[0], penalty: 35, multiplier: 2.5 }] });
 open(); use(ece, 'double-points'); answer(ece, 'right'); answer(can, 'other');
 use(ada); answer(ada, 'right'); advance(0);
 assert.equal(ece.score, -88); assert.equal(can.score, -88); assert.equal(ada.score, 250);
 assert.equal(result(ece).correct, true); assert.equal(result(ece).bombOutcome, 'hit');
 assert.equal(ece.correct, 1); assert.equal(can.wrong, 1);
});

test('preactivated shields protect unanswered, wrong and correct players from the bomb and yield zero', () => {
 const { players: [ada, ece, can, deniz], open, use, answer, advance, result } = setup({ count: 4 });
 open(); use(ada); use(ece, 'shield'); use(can, 'shield'); use(deniz, 'shield');
 answer(can, 'wrong'); answer(deniz, 'right'); answer(ada, 'right'); advance(0);
 for (const player of [ece, can, deniz]) {
  assert.equal(player.score, 0); assert.equal(result(player).delta, 0);
  assert.equal(result(player).bombOutcome, 'shielded'); assert.deepEqual(result(player).jokers, ['shield']);
 }
 assert.equal(ece.wrong, 0); assert.equal(can.wrong, 1); assert.equal(deniz.correct, 1);
});

test('bomb cuts short a double-answer turn, preventing a second choice after detonation', () => {
 const { room, players: [ada, ece], open, use, answer, advance, result } = setup({ count: 2 });
 open(); use(ece, 'double-answer'); answer(ece, 'right');
 use(ada); answer(ada, 'right');
 assert.throws(() => answer(ece, 'wrong'), /Bomba patladı/);
 advance(0); assert.equal(room.phase, 'resolved'); assert.equal(ece.score, -25);
 assert.deepEqual(result(ece).choiceIds, ['right']); assert.equal(result(ece).correct, true);
});

test('bomb preserves the winner speed score and solo bonus and applies no extra multiplier', () => {
 const { players: [ada, ece], open, use, answer, advance, result } = setup();
 open(); use(ada); advance(7500); answer(ada, 'right'); advance(0);
 assert.equal(ada.score, 225); assert.equal(result(ada).elapsedMs, 7500);
 assert.equal(result(ada).soloBonus, true); assert.equal(ece.score, -25);
 const solo = setup({ count: 1 }); solo.open(); solo.use(solo.players[0]); solo.answer(solo.players[0], 'right'); solo.advance(0);
 assert.equal(solo.players[0].score, 300); assert.equal(solo.room.choiceResults.length, 1);
});

test('zero-penalty bombs still block the question but leave opponents at zero points', () => {
 const { players: [ada, ece], open, use, answer, advance, result } = setup({ count: 2, pool: [{ ...bank[0], penalty: 0 }] });
 open(); use(ada); answer(ada, 'right'); advance(0);
 assert.equal(ece.score, 0); assert.equal(result(ece).delta, 0); assert.equal(result(ece).bombOutcome, 'hit');
});

test('bomb and shield state survives reconnection without restoring consumed inventory', () => {
 const { engine, room, players: [ada, ece], open, use, answer, advance, result } = setup();
 open(); use(ada); use(ece, 'shield');
 const resumed = engine.join(room, '', ada.token), shielded = engine.join(room, '', ece.token);
 assert.deepEqual(engine.playerAnswer(room, resumed).jokers, ['bomb']);
 assert.deepEqual(engine.playerAnswer(room, shielded).jokers, ['shield']);
 answer(resumed, 'right'); assert.equal(engine.join(room, '', ada.token), ada);
 advance(0); assert.equal(result(ece).bombOutcome, 'shielded');
 assert.equal(ada.availableJokers.has('bomb'), false); assert.equal(ece.availableJokers.has('shield'), false);
});

test('bomb can combine with other jokers but cannot activate after answering or submit after the deadline', () => {
 const { players: [ada, ece], open, use, answer, elapse, room } = setup();
 open(); use(ada); assert.equal(use(ada, 'double-points'), true);
 answer(ece, 'right'); assert.throws(() => use(ece), /cevap vermeden önce/);
 elapse(15000); assert.throws(() => answer(ada, 'right'), /süresi doldu/);
 assert.equal(room.bombWinner, null);
});

test('manual reveal immediately after bomb acceptance uses the latched winner and does not double-score', () => {
 const { players: [ada, ece], open, use, answer, reveal, advance, result } = setup();
 open(); use(ada); answer(ada, 'right'); assert.equal(reveal(), true);
 assert.equal(result(ada).bombOutcome, 'winner'); assert.equal(ece.score, -25);
 assert.equal(reveal(), false); advance(15000); assert.equal(ece.score, -25);
});

test('bomb scoring retries persistence atomically, retains the winner and ignores players joining after the blast', () => {
 let fail = true, writes = 0;
 const { engine, room, players: [ada, ece, can], open, use, answer, advance, result } = setup({ pool: [bank[0]], settings: { saveUsedQuestions: () => {
  writes++; if (fail) throw new Error('disk unavailable');
 } } });
 open(); use(ada); use(ece); use(can, 'shield'); answer(ada, 'right'); advance(0);
 assert.equal(room.phase, 'open'); assert.equal(room.bombWinner, ada.id);
 assert.equal(writes, 1); assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 assert.throws(() => answer(ece, 'right'), /Bomba patladı/);
 assert.throws(() => use(ece, 'shield'), /Bomba patladı/);
 const newcomer = engine.join(room, 'After blast');
 advance(999); assert.equal(writes, 1);
 fail = false; advance(1);
 assert.equal(room.phase, 'resolved'); assert.equal(writes, 2);
 assert.equal(ada.score, 300); assert.equal(ece.score, -25); assert.equal(can.score, 0); assert.equal(newcomer.score, 0);
 assert.equal(result(ada).bombOutcome, 'winner'); assert.equal(result(ece).bombOutcome, 'hit');
 assert.equal(result(can).bombOutcome, 'shielded'); assert.equal(result(newcomer).bombOutcome, undefined);
 advance(20000); assert.equal(writes, 2); assert.equal(ece.score, -25);
 assert.equal(engine.state(room).completed[0].choiceResults.find(result => result.id === ada.id).bombOutcome, 'winner');
});
