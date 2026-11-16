import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadQuestionHistory } from '../server/question-history.mjs';
import { Engine, validateBank } from '../server/engine.mjs';
import { questionPool, questions } from '../lib/questions.mjs';
import { ANSWER_SECONDS } from '../lib/game-rules.mjs';

function setup(bank = questions) {
 let now = 100000;
 const engine = new Engine(() => now);
 const room = engine.create(bank);
 const ada = engine.join(room, 'Ada'); ada.sockets.add('ada');
 const ece = engine.join(room, 'Ece'); ece.sockets.add('ece');
 const advance = ms => { now += ms; engine.tick(); };
 const open = () => { engine.start(room); advance(3000); };
 return { engine, room, ada, ece, advance, open };
}

test('24 unique letter questions validate; invalid and duplicate banks fail', () => {
 assert.equal(validateBank(questions).length, 24);
 assert.throws(() => validateBank([]));
 assert.throws(() => validateBank([questions[0], questions[0]]));
 assert.throws(() => validateBank([{ ...questions[0], multiplier: NaN }]));
 assert.throws(() => validateBank([{ ...questions[0], penalty: -1 }]));
 assert.throws(() => validateBank([{ ...questions[0], text: '' }]));
});
test('lobby and countdown hide question; answers stay private until resolution', () => {
 const { engine, room, open } = setup();
 assert.equal(engine.state(room).question.text, '');
 assert.equal(engine.state(room).question.answer, undefined);
 engine.start(room); assert.equal(engine.state(room).question.text, '');
 assert.equal(JSON.stringify(engine.state(room)).includes('Application Programming Interface'), false);
 open(); assert.equal(engine.state(room).question.text, questions[0].text);
 assert.equal(engine.state(room).question.answer, undefined);
});
test('first arrival gets mic, duplicate buzz cannot move priority', () => {
 const { engine, room, ada, ece, advance, open } = setup(); open();
 engine.buzz(room, ada); advance(30); engine.buzz(room, ece);
 assert.equal(engine.buzz(room, ada), false);
 assert.equal(engine.state(room).pending, true); assert.deepEqual(engine.state(room).queue, []);
 advance(120); assert.equal(room.phase, 'answering'); assert.equal(room.queue[0].id, ada.id);
 assert.equal(room.queue[1].id, ece.id); assert.equal(room.deadline, 103150 + ANSWER_SECONDS * 1000);
});
test('wrong answer applies penalty once, locks player and starts next full answer time', () => {
 const { engine, room, ada, ece, advance, open } = setup(); open();
 engine.buzz(room, ada); engine.buzz(room, ece); advance(150);
 engine.judge(room, false); assert.equal(ada.score, -25); assert.equal(ada.wrong, 1);
 assert.equal(room.queue[0].id, ece.id); assert.equal(room.phase, 'answering');
 assert.equal(room.deadline, 103150 + ANSWER_SECONDS * 1000);
 assert.throws(() => engine.buzz(room, ada));
 advance(1000); engine.judge(room, true); assert.equal(ece.score, 100);
 assert.equal(room.phase, 'resolved'); assert.equal(engine.judge(room, true), false);
 assert.equal(ece.score, 100); assert.equal(engine.state(room).question.answer, 'API');
});
test('timeout is authoritative, penalizes once and returns to open with no queue', () => {
 const { engine, room, ada, advance, open } = setup(); open(); engine.buzz(room, ada); advance(150);
 advance(ANSWER_SECONDS * 1000 - 1); assert.equal(ada.score, 0); advance(1);
 assert.equal(ada.score, -25); assert.equal(room.phase, 'open'); assert.equal(room.result.timeout, true);
 advance(20000); assert.equal(ada.score, -25); assert.equal(room.deadline, null);
});
test('per-question multiplier applies to both positive and negative scores', () => {
 const { engine, room, ada, ece, advance, open } = setup([{ ...questions[0], points: 120, penalty: 35, multiplier: 2.5 }]);
 open(); engine.buzz(room, ada); engine.buzz(room, ece); advance(150);
 engine.judge(room, false); engine.judge(room, true);
 assert.equal(ada.score, -88); assert.equal(ece.score, 300);
 engine.start(room); assert.equal(room.phase, 'final');
});
test('early buzzing temporarily locks without adding a queue entry', () => {
 const { engine, room, ada, advance } = setup(); engine.start(room); advance(2500);
 assert.throws(() => engine.buzz(room, ada), /Erken/); advance(500);
 assert.throws(() => engine.buzz(room, ada), /bekle/); advance(1000);
 engine.buzz(room, ada); advance(150); assert.equal(room.queue[0].id, ada.id);
});
test('resume token returns same player; duplicate names cannot steal a seat', () => {
 const { engine, room, ada } = setup(); ada.score = 200;
 assert.equal(engine.join(room, 'Başka isim', ada.token).id, ada.id);
 assert.equal(engine.join(room, '', ada.token).score, 200);
 assert.throws(() => engine.join(room, 'ada'), /kullanılıyor/);
 assert.throws(() => engine.join(room, 'Ada', 'invalid-token'), /kullanılıyor/);
 assert.equal(JSON.stringify(engine.state(room)).includes(ada.token), false);
 assert.equal(JSON.stringify(engine.state(room)).includes(room.token), false);
});
test('pass cancels timers, reveals answer and next question resets locks', () => {
 const { engine, room, ada, advance, open } = setup(); open(); engine.buzz(room, ada); advance(150);
 engine.pass(room); advance(20000); assert.equal(ada.score, 0); assert.equal(room.deadline, null);
 assert.equal(engine.state(room).question.answer, 'API');
 engine.start(room); assert.equal(room.index, 1); assert.equal(room.phase, 'countdown');
 assert.deepEqual([...room.locked], []); assert.equal(room.result, null);
 assert.deepEqual(room.history, [{ letter: 'A', status: 'passed' }]);
});
test('offline queued players are skipped when next mic is activated', () => {
 const { engine, room, ada, ece, advance, open } = setup(); open();
 engine.buzz(room, ada); engine.buzz(room, ece); advance(150); ece.sockets.clear();
 engine.judge(room, false); assert.equal(room.phase, 'open'); assert.equal(room.queue.length, 0);
});
test('a late correct decision cannot override the elapsed deadline before a timer tick', () => {
 let now = 100000; const engine = new Engine(() => now); const room = engine.create(questions);
 const player = engine.join(room, 'Ada'); player.sockets.add('ada');
 engine.start(room); now += 3000; engine.tick(); engine.buzz(room, player);
 now += 150; engine.tick(); now += ANSWER_SECONDS * 1000;
 engine.judge(room, true);
 assert.equal(player.score, -25); assert.equal(room.result.timeout, true);
 assert.equal(room.phase, 'open'); assert.equal(player.correct, 0);
});

test('host buzzer creates a participant without changing the room authority', () => {
 const { engine, room, advance, open } = setup();
 const hostToken = room.token; open();
 const host = engine.hostBuzz(room, 'host-socket');
 assert.equal(host.name, 'Sunucu'); assert.equal(host.sockets.has('host-socket'), true);
 assert.equal(room.token, hostToken); assert.equal(room.queue[0].id, host.id);
 advance(150); assert.equal(room.phase, 'answering');
 engine.judge(room, true); assert.equal(host.score, 100);
 engine.start(room); advance(3000);
 const resumed = engine.hostBuzz(room, 'reconnected-host', host.token);
 assert.equal(resumed.id, host.id); assert.equal(resumed.score, 100);
 assert.equal(room.players.size, 3);
});

test('host buzzer cannot add players before a question opens', () => {
 const { engine, room } = setup(); const count = room.players.size;
 assert.throws(() => engine.hostBuzz(room, 'host'), /Soru açılınca/);
 assert.equal(room.players.size, count);
 engine.start(room); assert.throws(() => engine.hostBuzz(room, 'host'), /Soru açılınca/);
 assert.equal(room.players.size, count);
});

test('host participation safely handles a player already named Sunucu', () => {
 const { engine, room, open } = setup();
 engine.join(room, 'Sunucu'); open();
 assert.equal(engine.hostBuzz(room, 'host').name, 'Sunucu 2');
});

test('spectators are listed separately and do not gain player credentials', () => {
 const { engine, room } = setup();
 const viewer = engine.watch(room, 'watch-socket');
 const state = engine.state(room);
 assert.equal(viewer.name, 'İzleyici 1');
 assert.equal(state.watchers.length, 1); assert.equal(state.players.length, 2);
 assert.equal(state.watchers[0].token, undefined);
 room.watchers.delete('watch-socket'); assert.deepEqual(engine.state(room).watchers, []);
});

test('completed-question feed reveals only resolved questions', () => {
 const { engine, room, open, advance } = setup();
 assert.deepEqual(engine.state(room).completed, []);
 open(); assert.deepEqual(engine.state(room).completed, []);
 engine.pass(room);
 assert.equal(engine.state(room).completed.length, 1);
 assert.equal(engine.state(room).completed[0].answer, 'API');
 engine.start(room); advance(3000);
 const state = engine.state(room);
 assert.equal(state.completed.length, 1); assert.equal(state.completed[0].letter, 'A');
 assert.equal(state.question.answer, undefined);
 assert.equal(JSON.stringify(state.completed).includes('Binary search'), false);
});

test('the English pool has 11 distinct answers per letter and matching answer initials', () => {
 const pool = validateBank(questionPool);
 assert.equal(pool.length, 264);
 assert.deepEqual(questions.map(question => question.letter), [...'ABCDEFGHIJKLMNOPRSTUVWYZ']);
 for (const { letter } of questions) {
  const group = pool.filter(question => question.letter === letter);
  assert.equal(group.length, 11);
  assert.equal(new Set(group.map(question => question.answer.toLowerCase())).size, 11);
  for (const question of group) {
   assert.equal(question.answer[0].toUpperCase(), letter, question.answer);
   for (const field of ['category', 'text', 'answer', 'explanation']) {
    assert.ok(question[field].length > 0, `${question.answer}: missing ${field}`);
    assert.doesNotMatch(question[field], /[çğıöşüÇĞİÖŞÜ]/u, `${question.answer}: ${field}`);
   }
  }
 }
});

test('finished wheels never repeat and an exhausted pool leaves the room in the lobby', () => {
 let now = 100000;
 let saved = new Set();
 let engine = new Engine(() => now, { saveUsedQuestions: used => { saved = used; } });
 for (let game = 0; game < 11; game++) {
  const room = engine.create();
  const before = saved;
  for (let turn = 0; turn < 24; turn++) {
   engine.start(room);
   now += 3000;
   engine.tick();
   assert.equal(before.has(room.bank[turn].id), false);
   assert.equal(engine.state(room).question.answer, undefined);
   engine.pass(room);
  }
  assert.equal(saved.size, (game + 1) * 24);
  engine = new Engine(() => now, {
   usedQuestions: saved,
   saveUsedQuestions: used => { saved = used; },
  });
 }
 const room = engine.create();
 assert.throws(() => engine.start(room), /A harfi için kullanılmamış soru kalmadı/);
 assert.equal(room.phase, 'lobby');
});

test('an incomplete wheel does not consume questions', () => {
 const { engine, room, advance, open } = setup();
 open();
 engine.pass(room);
 assert.equal(engine.usedQuestions.size, 0);
 const anotherRoom = engine.create(questions);
 engine.start(anotherRoom);
 advance(3000);
 assert.equal(anotherRoom.bank[0].id, room.bank[0].id);
});

test('a saved wheel is excluded after loading its history from disk', t => {
 const path = join(tmpdir(), 'vigola-questions-' + randomUUID() + '.json');
 let now = 100000;
 const engine = new Engine(() => now, loadQuestionHistory(path));
 const room = engine.create([questions[0]]);
 engine.start(room);
 now += 3000;
 engine.tick();
 engine.pass(room);
 t.after(() => unlinkSync(path));

 const restarted = new Engine(() => now, loadQuestionHistory(path));
 const newRoom = restarted.create([questions[0]]);
 assert.throws(() => restarted.start(newRoom), /kullanılmamış soru kalmadı/);
});
