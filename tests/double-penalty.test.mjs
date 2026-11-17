import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../server/engine.mjs';
import { questions } from '../lib/questions.mjs';

const bank = questions.slice(0, 2).map(question => ({ ...question, points: 100, penalty: 25, multiplier: 1, choices: [
 { id: 'right', text: question.answer }, { id: 'wrong', text: 'Incorrect', weight: -17 }, { id: 'other', text: 'Other incorrect', weight: -99 },
] }));
function setup({ pool = bank, count = 3, settings } = {}) {
 let now = 100000;
 const engine = new Engine(() => now, settings);
 const room = engine.create(pool, 'multiple-choice');
 const players = Array.from({ length: count }, (_, i) => engine.join(room, `Player ${i}`));
 const advance = ms => { now += ms; engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 const use = (player, joker) => engine.useJoker(room, player, room.bank[room.index].id, joker);
 const answer = (player, choiceId) => engine.submitChoice(room, player, room.bank[room.index].id, choiceId);
 const reveal = () => engine.revealChoices(room, room.bank[room.index].id);
 const result = player => room.choiceResults.find(result => result.id === player.id);
 return { engine, room, players, advance, open, use, answer, reveal, result };
}

test('double-points doubles opponents wrong penalties and keeps later correct rewards unchanged', () => {
 const { players: [ada, ece, can], open, use, answer, advance, result } = setup();
 open(); use(ada, 'double-points'); answer(ada, 'right'); answer(ece, 'wrong'); answer(can, 'right'); advance(0);
 assert.equal(ada.score, 300); assert.equal(ece.score, -34); assert.equal(can.score, 100);
 assert.equal(result(ece).penaltyMultiplier, 2); assert.equal(result(can).penaltyMultiplier, 1);
});

test('own double-points never doubles own wrong penalty, while opponents are affected even if the user is wrong', () => {
 const { players: [ada, ece, can], open, use, answer, reveal, result } = setup();
 open(); use(ada, 'double-points'); answer(ada, 'wrong'); answer(ece, 'wrong'); reveal();
 assert.equal(ada.score, -17); assert.equal(ece.score, -34); assert.equal(can.score, 0);
 assert.equal(result(ada).penaltyMultiplier, 1); assert.equal(result(ece).penaltyMultiplier, 2);
 assert.equal(result(can).correct, null);
});

test('activating double-points without answering still affects opponents while unanswered players remain unpenalized', () => {
 const { players: [ada, ece, can], open, use, answer, advance } = setup();
 open(); use(ada, 'double-points'); answer(ece, 'wrong'); advance(15000);
 assert.equal(ada.score, 0); assert.equal(ece.score, -34); assert.equal(can.score, 0);
});

test('multiple double-points users cap penalties at x2 and can affect each other', () => {
 const { players, open, use, answer, advance, result } = setup();
 open(); for (const player of players) use(player, 'double-points');
 for (const player of players) answer(player, 'wrong'); advance(0);
 for (const player of players) {
  assert.equal(player.score, -34); assert.equal(result(player).penaltyMultiplier, 2);
 }
});

test('shield cancels doubled wrong penalties and private penalty effects stay hidden until reveal', () => {
 const { engine, room, players: [ada, ece], open, use, answer, reveal, result } = setup();
 open(); use(ada, 'double-points'); use(ece, 'shield'); answer(ece, 'wrong');
 assert.equal(JSON.stringify(engine.state(room)).includes('penaltyMultiplier'), false);
 assert.equal(JSON.stringify(engine.state(room)).includes('double-points'), false);
 reveal(); assert.equal(ece.score, 0); assert.equal(ece.wrong, 1); assert.equal(result(ece).penaltyMultiplier, 1);
});

test('wrong penalties round before doubling and double-answer charges only its first wrong selection', () => {
 const { players: [ada, ece], open, use, answer, reveal, result } = setup({ pool: [{ ...bank[0], multiplier: 2.5 }] });
 open(); use(ada, 'double-points'); use(ece, 'double-answer');
 answer(ece, 'wrong'); answer(ece, 'other'); reveal();
 assert.equal(ece.score, -86); assert.equal(result(ece).choiceId, 'wrong'); assert.equal(ece.wrong, 1);
});

test('winning bomb plus double-points doubles question penalties even for correct and unanswered targets', () => {
 const { players: [ada, ece, can, deniz], open, use, answer, advance, result } = setup({ count: 4, pool: [{ ...bank[0], penalty: 35, multiplier: 2.5 }] });
 open(); use(ada, 'bomb'); use(ada, 'double-points'); use(deniz, 'shield');
 answer(ece, 'right'); answer(ada, 'right'); advance(0);
 assert.equal(ece.score, -176); assert.equal(can.score, -176); assert.equal(deniz.score, 0);
 assert.equal(result(ece).correct, true); assert.equal(result(can).correct, null);
 assert.equal(result(ece).penaltyMultiplier, 2); assert.equal(result(can).penaltyMultiplier, 2);
 assert.equal(result(deniz).penaltyMultiplier, 1); assert.equal(result(deniz).bombOutcome, 'shielded');
});

test('losing players double-points never amplifies another players bomb', () => {
 const { players: [ada, ece, can], open, use, answer, advance, result } = setup();
 open(); use(ada, 'bomb'); use(ece, 'double-points'); use(can, 'double-points'); answer(ada, 'right'); advance(0);
 assert.equal(ece.score, -25); assert.equal(can.score, -25);
 assert.equal(result(ece).penaltyMultiplier, 1); assert.equal(result(can).penaltyMultiplier, 1);
});

test('doubled penalties persist atomically and never multiply again on retry or repeated reveal', () => {
 let fail = true;
 const { room, players: [ada, ece], open, use, answer, advance, reveal } = setup({ pool: [bank[0]], count: 2, settings: { saveUsedQuestions: () => { if (fail) throw new Error('disk unavailable'); } } });
 open(); use(ada, 'double-points'); answer(ada, 'right'); answer(ece, 'wrong'); advance(0);
 assert.equal(room.phase, 'open'); assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 fail = false; advance(1000);
 assert.equal(ada.score, 300); assert.equal(ece.score, -34);
 assert.equal(reveal(), false); advance(20000); assert.equal(ece.score, -34);
});

test('zero-penalty bomb targets remain at zero with no doubled-penalty badge', () => {
 const { players: [ada, ece], open, use, answer, advance, result } = setup({ pool: [{ ...bank[0], penalty: 0 }] });
 open(); use(ada, 'bomb'); use(ada, 'double-points'); answer(ada, 'right'); advance(0);
 assert.equal(ece.score, 0); assert.equal(result(ece).delta, 0); assert.equal(result(ece).penaltyMultiplier, 1);
});
