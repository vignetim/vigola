import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../server/engine.mjs';
import { questions } from '../lib/questions.mjs';
import { JOKERS, FIRST_CORRECT_MULTIPLIER } from '../lib/game-rules.mjs';

const bank = questions.slice(0, 2).map(question => ({ ...question, points: 100, penalty: 25, multiplier: 1, choices: [
 { id: 'right', text: question.answer },
 ...['a', 'b', 'c'].map(id => ({ id, text: `Wrong ${id}` })),
] }));
function setup({ pool = bank, count = 3, settings } = {}) {
 let now = 100000;
 const engine = new Engine(() => now, settings);
 const room = engine.create(pool, 'multiple-choice');
 const players = Array.from({ length: count }, (_, index) => engine.join(room, `Player ${index}`));
 const advance = ms => { now += ms; engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 const use = (player, joker) => engine.useJoker(room, player, room.bank[room.index].id, joker);
 const answer = (player, choiceId) => engine.submitChoice(room, player, room.bank[room.index].id, choiceId);
 const reveal = () => engine.revealChoices(room, room.bank[room.index].id);
 const result = player => room.choiceResults.find(result => result.id === player.id);
 return { engine, room, players, advance, open, use, answer, reveal, result };
}

test('first correct receives 1.5 times its speed score, regardless of player join order', () => {
 const { room, players: [ada, ece], open, answer, advance, reveal, result } = setup();
 assert.equal(FIRST_CORRECT_MULTIPLIER, 1.5);
 open(); advance(3000); answer(ece, 'right'); answer(ada, 'right'); reveal();
 assert.equal(room.firstCorrectId, ece.id);
 assert.equal(ece.score, 135); assert.equal(ada.score, 90);
 assert.equal(result(ece).firstCorrectBonus, true); assert.equal(result(ada).firstCorrectBonus, false);
});

test('wrong and rejected duplicate answers never claim the first-correct bonus', () => {
 const { room, players: [ada, ece, can], open, answer, advance, result } = setup();
 open(); answer(ada, 'a');
 assert.throws(() => answer(ada, 'right'), /tekrar seçemezsin/);
 assert.equal(room.firstCorrectId, null);
 answer(ece, 'right'); answer(can, 'right'); advance(0);
 assert.equal(ece.score, 150); assert.equal(can.score, 100); assert.equal(ada.score, -25);
 assert.equal(room.choiceResults.filter(result => result.firstCorrectBonus).length, 1);
 assert.equal(result(ece).firstCorrectBonus, true);
});

test('double-answer uses its correct selection order and time for first-correct eligibility', () => {
 const { players: [ada, ece], open, use, answer, advance, reveal, result } = setup();
 open(); use(ada, 'double-answer'); answer(ada, 'a');
 advance(3000); answer(ece, 'right'); advance(4500); answer(ada, 'right'); reveal();
 assert.equal(ece.score, 135); assert.equal(ada.score, 75);
 assert.equal(result(ece).firstCorrectBonus, true); assert.equal(result(ada).firstCorrectBonus, false);
 assert.equal(result(ada).elapsedMs, 7500);
});

test('all five jokers combine, with first-correct, solo and double-points multipliers and shielded rivals', () => {
 const { engine, room, players: [ada, ece, can], open, use, answer, advance, result } = setup();
 open(); for (const joker of JOKERS) use(ada, joker);
 use(ece, 'bomb'); use(ece, 'shield'); use(ece, 'double-points');
 const own = engine.playerAnswer(room, ada);
 assert.deepEqual(own.jokers, JOKERS); assert.deepEqual(own.availableJokers, []);
 assert.equal(own.eliminatedChoiceIds.length, 2);
 assert.equal(JSON.stringify(engine.state(room)).includes('jokers'), false);
 assert.deepEqual(engine.playerAnswer(room, can).jokers, []);
 const remainingWrong = bank[0].choices.find(choice => choice.id !== 'right' && !own.eliminatedChoiceIds.includes(choice.id));
 advance(3000); answer(ada, remainingWrong.id); assert.equal(room.bombWinner, null);
 advance(4500); answer(ada, 'right');
 assert.throws(() => answer(ece, 'right'), /Bomba patladı/);
 advance(0);
 assert.equal(ada.score, 450); assert.equal(result(ada).firstCorrectBonus, true);
 assert.equal(result(ada).soloBonus, true); assert.equal(result(ada).bombOutcome, 'winner');
 assert.deepEqual(result(ada).jokers, JOKERS);
 assert.equal(ece.score, 0); assert.equal(result(ece).bombOutcome, 'shielded');
 assert.equal(ece.availableJokers.has('bomb'), false); assert.equal(can.score, -50);
});

test('adding more jokers preserves fifty-fifty hints, immutable inventory and private per-player active arrays', () => {
 const { engine, room, players: [ada, ece], open, use, answer } = setup();
 open(); use(ada, 'fifty-fifty'); const before = engine.playerAnswer(room, ada).eliminatedChoiceIds;
 use(ada, 'shield'); use(ada, 'double-answer');
 assert.deepEqual(engine.playerAnswer(room, ada).eliminatedChoiceIds, before);
 const own = engine.playerAnswer(room, ada); own.jokers.length = 0; own.eliminatedChoiceIds.length = 0;
 assert.deepEqual(engine.playerAnswer(room, ada).jokers, ['fifty-fifty', 'shield', 'double-answer']);
 assert.deepEqual(engine.playerAnswer(room, ece).jokers, []);
 assert.throws(() => use(ada, 'fifty-fifty'), /zaten kullandın/);
 assert.throws(() => answer(ada, before[0]), /Elenen/);
 assert.equal(ada.availableJokers.size, 2);
});

test('shield and double-points combine without penalties on wrong answers or false bonuses', () => {
 const { room, players: [ada, ece], open, use, answer, reveal, result } = setup();
 open(); use(ada, 'shield'); use(ada, 'double-points'); answer(ada, 'a'); answer(ece, 'a'); reveal();
 assert.equal(ada.score, 0); assert.equal(ada.wrong, 1); assert.equal(ece.score, -50);
 assert.equal(room.firstCorrectId, null); assert.equal(result(ada).firstCorrectBonus, false);
});

test('normal first-correct rewards are overridden by a later bomb and do not transfer to the bomb winner', () => {
 const { players: [ada, ece], open, use, answer, advance, result } = setup();
 open(); use(ada, 'shield'); use(ada, 'double-points'); answer(ada, 'right');
 use(ece, 'bomb'); use(ece, 'double-points'); advance(3000); answer(ece, 'right'); advance(0);
 assert.equal(ada.score, 0); assert.equal(result(ada).bombOutcome, 'shielded');
 assert.equal(result(ada).firstCorrectBonus, false);
 assert.equal(ece.score, 180); assert.equal(result(ece).firstCorrectBonus, false);
});

test('joker combinations must activate before the first selection, even when a second choice remains', () => {
 const { players: [ada], open, use, answer } = setup();
 open(); use(ada, 'double-answer'); use(ada, 'shield'); answer(ada, 'a');
 assert.throws(() => use(ada, 'bomb'), /cevap vermeden önce/);
 assert.equal(ada.availableJokers.has('bomb'), true);
});

test('first-correct and combined modifiers round once after the integer base score', () => {
 const pool = [{ ...bank[0], multiplier: 2.5, choices: bank[0].choices.map(choice => choice.id === 'right' ? { ...choice, weight: 155 } : choice) }];
 const multi = setup({ pool }); multi.open(); multi.advance(7500); multi.answer(multi.players[0], 'right'); multi.answer(multi.players[1], 'right'); multi.reveal();
 assert.equal(multi.players[0].score, 437); assert.equal(multi.players[1].score, 291);
 const solo = setup({ pool, count: 1 }); solo.open(); solo.use(solo.players[0], 'double-points'); solo.advance(7500); solo.answer(solo.players[0], 'right'); solo.advance(0);
 assert.equal(solo.players[0].score, 1746);
});

test('reconnection keeps all active jokers and first-correct ownership; the next question resets only round state', () => {
 const { engine, room, players: [ada, ece], open, use, answer, reveal, result } = setup();
 open(); use(ada, 'shield'); use(ada, 'double-points'); answer(ada, 'right');
 const resumed = engine.join(room, '', ada.token);
 assert.deepEqual(engine.playerAnswer(room, resumed).jokers, ['shield', 'double-points']);
 assert.equal(room.firstCorrectId, ada.id); answer(ece, 'right'); reveal();
 assert.equal(result(ada).delta, 300); const previous = room.choiceResults;
 open(); assert.equal(room.firstCorrectId, null);
 assert.deepEqual(engine.playerAnswer(room, ada).jokers, []);
 assert.deepEqual(engine.playerAnswer(room, ada).availableJokers, ['fifty-fifty', 'double-answer', 'bomb']);
 assert.deepEqual(engine.state(room).completed[0].choiceResults, previous);
 answer(ece, 'right'); answer(ada, 'right'); reveal(); assert.equal(result(ece).firstCorrectBonus, true);
});

test('persistence retry keeps first-correct ownership and applies all stacked modifiers just once', () => {
 let fail = true;
 const { room, players: [ada, ece], open, use, answer, advance, result } = setup({ pool: [bank[0]], count: 2, settings: { saveUsedQuestions: () => { if (fail) throw new Error('disk unavailable'); } } });
 open(); use(ada, 'shield'); use(ada, 'double-points'); answer(ada, 'right'); answer(ece, 'right'); advance(0);
 assert.equal(room.phase, 'open'); assert.equal(ada.score, 0); assert.equal(room.firstCorrectId, ada.id);
 fail = false; advance(1000);
 assert.equal(ada.score, 300); assert.equal(ece.score, 100); assert.equal(result(ada).firstCorrectBonus, true);
 advance(20000); assert.equal(ada.score, 300);
});
