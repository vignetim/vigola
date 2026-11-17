import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../server/engine.mjs';
import { questions } from '../lib/questions.mjs';
import { JOKERS, MULTIPLE_CHOICE_SECONDS } from '../lib/game-rules.mjs';

const bank = questions.slice(0, 3).map(q => ({ ...q, choices: [
 { id: 'right', text: q.answer },
 { id: 'wrong-one', text: 'Wrong one', weight: -17 },
 { id: 'wrong-two', text: 'Wrong two', weight: -99 },
 { id: 'wrong-three', text: 'Wrong three' },
] }));
function setup(pool = bank) {
 let now = 100000;
 const engine = new Engine(() => now);
 const room = engine.create(pool, 'multiple-choice');
 const ada = engine.join(room, 'Ada'), ece = engine.join(room, 'Ece');
 const elapse = ms => { now += ms; };
 const advance = ms => { elapse(ms); engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 const use = (joker, player = ada) => engine.useJoker(room, player, room.bank[room.index].id, joker);
 const answer = (choiceId, player = ada) => engine.submitChoice(room, player, room.bank[room.index].id, choiceId);
 const reveal = () => engine.revealChoices(room, room.bank[room.index].id);
 return { engine, room, ada, ece, advance, elapse, open, use, answer, reveal };
}

test('every MC player receives a separate private inventory of five once-per-game jokers', () => {
 const { engine, room, ada, ece } = setup();
 assert.deepEqual(engine.playerAnswer(room, ada).availableJokers, JOKERS);
 const privateState = engine.playerAnswer(room, ada);
 privateState.availableJokers.pop();
 assert.equal(ada.availableJokers.size, 5);
 assert.equal(ece.availableJokers.size, 5);
 assert.equal(engine.playerAnswer(room, ada).choiceId, null);
 assert.deepEqual(engine.playerAnswer(room, ada).choiceIds, []);
 assert.equal(JSON.stringify(engine.state(room)).includes('availableJokers'), false);
 const buzzer = engine.create();
 const player = engine.join(buzzer, 'Buzzer');
 assert.deepEqual(engine.playerAnswer(buzzer, player).availableJokers, []);
 assert.throws(() => engine.useJoker(buzzer, player, buzzer.bank[0].id, 'shield'), /çoktan seçmeli/);
});

test('joker actions reject invalid, early, stale, late, and foreign-player requests without spending inventory', () => {
 const { engine, room, ada, open, elapse, use } = setup();
 assert.throws(() => use('shield'), /cevap gönderilemez/);
 engine.start(room);
 assert.throws(() => use('shield'), /cevap gönderilemez/);
 open();
 assert.throws(() => use('missing'), /Geçerli bir joker/);
 assert.throws(() => engine.useJoker(room, ada, 'old', 'shield'), /aktif değil/);
 assert.throws(() => engine.useJoker(room, undefined, room.bank[0].id, 'shield'), /katıl/);
 assert.throws(() => engine.useJoker(room, { ...ada }, room.bank[0].id, 'shield'), /katıl/);
 const other = engine.create(); const foreign = engine.join(other, 'Foreign');
 assert.throws(() => engine.useJoker(room, foreign, room.bank[0].id, 'shield'), /katıl/);
 elapse(MULTIPLE_CHOICE_SECONDS * 1000);
 assert.throws(() => use('shield'), /süresi doldu/);
 assert.equal(ada.availableJokers.size, 5); assert.equal(room.roundJokers.size, 0);
});

test('one joker per question, only before answering, and spent jokers never return on next question', () => {
 const { engine, room, ada, ece, open, use, answer, reveal } = setup();
 open(); use('shield');
 assert.throws(() => use('double-answer'), /yalnızca bir/);
 assert.throws(() => use('shield'), /yalnızca bir/);
 assert.equal(ada.availableJokers.size, 4);
 answer('wrong-one', ece);
 assert.throws(() => use('double-answer', ece), /cevap vermeden önce/);
 assert.equal(ece.availableJokers.size, 5);
 reveal(); open();
 assert.equal(room.roundJokers.size, 0);
 assert.equal(ada.availableJokers.size, 4);
 assert.throws(() => use('shield'), /zaten kullandın/);
 assert.equal(use('double-answer'), true);
 assert.equal(ada.availableJokers.size, 3);
 assert.equal(engine.playerAnswer(room, ece).joker, null);
});

test('fifty-fifty keeps the correct and one wrong option for banks with three to six options', () => {
 for (const count of [3, 4, 5, 6]) {
  const options = [{ id: 'right', text: 'API' }, ...Array.from({ length: count - 1 }, (_, i) => ({ id: `wrong-${i}`, text: `Wrong ${i}` }))];
  const { engine, room, ada, open, use } = setup([{ ...questions[0], choices: options }]);
  open(); use('fifty-fifty');
  const privateState = engine.playerAnswer(room, ada);
  assert.equal(privateState.eliminatedChoiceIds.length, count - 2);
  assert.equal(new Set(privateState.eliminatedChoiceIds).size, count - 2);
  assert.equal(privateState.eliminatedChoiceIds.includes('right'), false);
  assert.equal(room.bank[0].choices.length, count);
  assert.deepEqual(engine.playerAnswer(room, ada), privateState);
 }
});

test('fifty-fifty affects only its owner, rejects eliminated answers server-side, and leaks no private hints', () => {
 const { engine, room, ada, ece, open, use, answer } = setup();
 open(); const before = engine.state(room).question.choices;
 use('fifty-fifty');
 const own = engine.playerAnswer(room, ada);
 const eliminated = own.eliminatedChoiceIds[0];
 assert.throws(() => answer(eliminated), /Elenen/);
 assert.equal(room.submissions.size, 0);
 answer(eliminated, ece);
 assert.deepEqual(engine.playerAnswer(room, ece).eliminatedChoiceIds, []);
 assert.equal(engine.playerAnswer(room, ece).joker, null);
 assert.deepEqual(engine.state(room).question.choices, before);
 const publicState = JSON.stringify(engine.state(room));
 for (const field of ['eliminatedChoiceIds', 'availableJokers', 'fifty-fifty', 'choiceIds']) assert.equal(publicState.includes(field), false);
 assert.deepEqual(engine.state(room).choiceResults, []);
 assert.equal(ada.score, 0); assert.equal(ece.score, 0);
 own.eliminatedChoiceIds.length = 0;
 assert.equal(engine.playerAnswer(room, ada).eliminatedChoiceIds.length, 2);
});

test('fifty-fifty on two-option questions fails without consuming the joker', () => {
 const { engine, room, ada, open, use } = setup([{ ...bank[0], choices: bank[0].choices.slice(0, 2) }]);
 open();
 assert.throws(() => use('fifty-fifty'), /ikiden fazla/);
 assert.equal(ada.availableJokers.has('fifty-fifty'), true);
 assert.equal(engine.playerAnswer(room, ada).joker, null);
});

test('double-answer supports two different immutable selections and scores a correct second answer at its own time', () => {
 const { engine, room, ada, ece, open, use, answer, advance } = setup();
 open(); use('double-answer');
 advance(3000); answer('wrong-one');
 assert.throws(() => answer('wrong-one'), /tekrar seçemezsin/);
 advance(4500); answer('right');
 assert.throws(() => answer('wrong-two'), /tekrar seçemezsin/);
 answer('wrong-one', ece);
 const privateState = engine.playerAnswer(room, ada);
 assert.deepEqual(privateState.choiceIds, ['wrong-one', 'right']);
 assert.equal(privateState.choiceId, 'wrong-one');
 assert.equal(ada.score, 0);
 advance(7500);
 const result = room.choiceResults.find(result => result.id === ada.id);
 assert.equal(result.delta, 75); assert.equal(result.elapsedMs, 7500);
 assert.equal(result.choiceId, 'right'); assert.equal(result.correct, true);
 assert.equal(result.joker, 'double-answer'); assert.equal(result.soloBonus, false);
 assert.deepEqual(result.choiceIds, ['wrong-one', 'right']);
 assert.equal(ada.correct, 1); assert.equal(ada.wrong, 0);
});

test('double-answer correct-first timing is preserved when the second selection is later and wrong', () => {
 const { room, ada, ece, open, use, answer, advance, reveal } = setup();
 open(); use('double-answer'); advance(3000); answer('right');
 advance(4500); answer('wrong-one'); answer('right', ece); reveal();
 assert.equal(ada.score, 90); assert.equal(ece.score, 75);
 assert.equal(room.choiceResults.find(result => result.id === ada.id).elapsedMs, 3000);
});

test('double-answer with two wrong choices charges only the first option penalty once', () => {
 const { room, ada, open, use, answer, advance, reveal } = setup([{ ...bank[0], multiplier: 2.5 }]);
 open(); use('double-answer'); answer('wrong-one'); advance(5000); answer('wrong-two'); reveal();
 assert.equal(ada.score, -43); assert.equal(ada.wrong, 1); assert.equal(ada.correct, 0);
 assert.equal(room.choiceResults.find(result => result.id === ada.id).choiceId, 'wrong-one');
 assert.equal(reveal(), false); assert.equal(ada.score, -43);
});

test('double-answer still allows only a single selection and never accepts its second answer after the deadline', () => {
 const { room, ada, open, use, answer, advance, elapse } = setup();
 open(); use('double-answer'); answer('right');
 elapse(15000);
 assert.throws(() => answer('wrong-one'), /süresi doldu/);
 advance(0);
 assert.equal(ada.score, 200);
 assert.deepEqual(room.choiceResults.find(result => result.id === ada.id).choiceIds, ['right']);
});

test('shield prevents wrong penalties while correct answers keep speed and solo scoring', () => {
 const { room, ada, open, use, answer, reveal } = setup();
 open(); use('shield'); answer('wrong-one'); reveal();
 assert.equal(ada.score, 0); assert.equal(ada.wrong, 1); assert.equal(ada.correct, 0);
 assert.equal(room.choiceResults.find(result => result.id === ada.id).joker, 'shield');
 const right = setup(); right.open(); right.use('shield'); right.advance(3000); right.answer('right'); right.reveal();
 assert.equal(right.ada.score, 180); assert.equal(right.ada.correct, 1);
});

test('a lone correct player gets exactly twice the rounded weighted speed score', () => {
 const { room, ada, open, answer, advance, reveal } = setup([{ ...bank[0], multiplier: 2.5, choices: bank[0].choices.map(choice => choice.id === 'right' ? { ...choice, weight: 155 } : choice) }]);
 open(); advance(7500); answer('right'); reveal();
 assert.equal(ada.score, 582);
 const result = room.choiceResults.find(result => result.id === ada.id);
 assert.equal(result.soloBonus, true); assert.equal(result.delta, 582);
 assert.equal(reveal(), false); assert.equal(ada.score, 582);
});

test('solo bonus depends on responding players, not the number of correct players or chosen options', () => {
 const { room, ada, ece, open, answer, reveal } = setup();
 open(); answer('right'); answer('wrong-one', ece); reveal();
 assert.equal(ada.score, 100);
 assert.equal(room.choiceResults.find(result => result.id === ada.id).soloBonus, false);
 const double = setup(); double.open(); double.use('double-answer'); double.answer('wrong-one'); double.answer('right'); double.reveal();
 assert.equal(double.ada.score, 200);
 assert.equal(double.room.choiceResults.find(result => result.id === double.ada.id).soloBonus, true);
});

test('using a joker without an answer does not count as responding or change scores', () => {
 const { room, ada, ece, open, use, answer, advance } = setup();
 open(); use('shield', ece); answer('right'); advance(15000);
 assert.equal(ada.score, 200); assert.equal(ece.score, 0); assert.equal(ece.wrong, 0);
 assert.deepEqual(room.choiceResults.find(result => result.id === ece.id), { id: ece.id, choiceId: null, correct: null, delta: 0 });
 assert.equal(ece.availableJokers.has('shield'), false);
 const empty = setup(); empty.open(); empty.use('shield'); empty.advance(15000);
 assert.equal(empty.ada.score, 0); assert.equal(empty.ada.wrong, 0);
 assert.equal(empty.room.history[0].status, 'passed');
});

test('reconnection restores inventory, active joker, selections, hints and original selection times', () => {
 const { engine, room, ada, open, use, answer, advance, reveal } = setup();
 open(); use('double-answer'); advance(3000); answer('wrong-one');
 const before = engine.playerAnswer(room, ada);
 const resumed = engine.join(room, 'Ignored', ada.token);
 assert.equal(resumed, ada); assert.deepEqual(engine.playerAnswer(room, resumed), before);
 advance(4500); answer('right', resumed); reveal();
 assert.equal(ada.score, 150);
 assert.equal(room.choiceResults.find(result => result.id === ada.id).elapsedMs, 7500);
 const fifty = setup(); fifty.open(); fifty.use('fifty-fifty');
 const hint = fifty.engine.playerAnswer(fifty.room, fifty.ada);
 assert.deepEqual(fifty.engine.playerAnswer(fifty.room, fifty.engine.join(fifty.room, '', fifty.ada.token)), hint);
});

test('next question clears current joker and choices but preserves spent inventory and completed results', () => {
 const { engine, room, ada, open, use, answer, reveal } = setup();
 open(); use('double-answer'); answer('wrong-one'); answer('right'); reveal();
 const previous = room.choiceResults;
 open();
 const own = engine.playerAnswer(room, ada);
 assert.deepEqual(own.choiceIds, []); assert.equal(own.joker, null);
 assert.deepEqual(own.eliminatedChoiceIds, []);
 assert.deepEqual(own.availableJokers, ['fifty-fifty', 'shield', 'double-points', 'bomb']);
 assert.deepEqual(engine.state(room).completed[0].choiceResults, previous);
 assert.throws(() => use('double-answer'), /zaten kullandın/);
});

test('zero-weight correct answers stay zero even with solo bonus and a joker', () => {
 const { room, ada, open, use, answer, reveal } = setup([{ ...bank[0], choices: bank[0].choices.map(choice => choice.id === 'right' ? { ...choice, weight: 0 } : choice) }]);
 open(); use('shield'); answer('right'); reveal();
 assert.equal(ada.score, 0); assert.equal(ada.correct, 1);
 assert.equal(room.choiceResults.find(result => result.id === ada.id).soloBonus, true);
});
