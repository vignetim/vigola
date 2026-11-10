import { ANSWER_SECONDS } from '../lib/game-rules.mjs';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { questionPool } from '../lib/questions.mjs';

export const MAX_POOL_QUESTIONS = 300;

export function validateBank(value) {
 if (!Array.isArray(value) || !value.length || value.length > MAX_POOL_QUESTIONS) throw new Error('Havuza 1–300 soru ekleyebilirsin.');
 const text = (v, max, required = true) => {
  if (typeof v !== 'string' || (required && !v.trim()) || v.length > max) throw new Error('Soru alanlarını kontrol et.');
  return v.trim();
 };
 const number = (v, min, max) => { if (!Number.isFinite(v) || v < min || v > max) throw new Error('Puan ve katsayı aralığını kontrol et.'); return v; };
 const bank = value.map(q => ({
  id: createHash('sha256').update(text(q?.text, 1200).normalize('NFC').replace(/\s+/g, ' ').toLocaleLowerCase('tr')).digest('hex'), letter: text(q.letter, 2).toLocaleUpperCase('tr'), category: text(q.category, 60),
  text: text(q.text, 1200), answer: text(q.answer, 200), explanation: text(q.explanation ?? '', 1500, false), code: text(q.code ?? '', 2000, false),
  difficulty: ['Kolay', 'Orta', 'Zor'].includes(q.difficulty) ? q.difficulty : 'Orta',
  points: number(q.points, 1, 1000), penalty: number(q.penalty, 0, 1000), multiplier: number(q.multiplier, 0.5, 5),
 }));
 if (new Set(bank.map(q => q.id)).size !== bank.length) throw new Error('Aynı soru havuza birden fazla kez eklenemez.');
 if (new Set(bank.map(q => q.letter)).size > 64) throw new Error('Çarkta en fazla 64 farklı harf olabilir.');
 return bank;
}

function groupByLetter(pool) {
 const groups = new Map();
 for (const question of pool) {
  if (!groups.has(question.letter)) groups.set(question.letter, []);
  groups.get(question.letter).push(question);
 }
 return [...groups.values()];
}

export class Engine {
 constructor(now = Date.now, { usedQuestions = new Set(), saveUsedQuestions = () => {} } = {}) {
  this.rooms = new Map();
  this.now = now;
  this.usedQuestions = usedQuestions;
  this.saveUsedQuestions = saveUsedQuestions;
 }
 setPool(room, pool = questionPool) {
  room.pool = validateBank(pool);
  room.bank = groupByLetter(room.pool).map(([first]) => first);
 }
 recordCompletedWheel(room) {
  if (room.index !== room.bank.length - 1) return;
  const used = new Set(this.usedQuestions);
  for (const question of room.bank) used.add(question.id);
  this.saveUsedQuestions(used);
  this.usedQuestions = used;
 }
 create(pool) {
  if (this.rooms.size >= 200) throw new Error('Şu an çok fazla oda var. Biraz sonra tekrar dene.');
  let code; const alphabet = 'ABCDEFGHJKLMNPRSTUVYZ';
  do { code = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join(''); } while (this.rooms.has(code));
  const room = { code, token: randomBytes(24).toString('hex'), players: new Map(), watchers: new Map(), viewerSequence: 0, phase: 'lobby', index: 0, queue: [], locked: new Set(), deadline: null, revealAt: null, settleAt: null, result: null, history: [], events: [], updatedAt: this.now() };
  this.setPool(room, pool);
  this.rooms.set(code, room); this.event(room, 'Oda hazır. Ekibini davet et!', 'info'); return room;
 }
 event(r, message, kind = 'info') { r.updatedAt = this.now(); r.events.unshift({ id: randomBytes(6).toString('hex'), message, kind }); r.events = r.events.slice(0, 20); }
 join(r, name, credential) {
  if (credential) { const player = [...r.players.values()].find(p => p.token === credential); if (player) return player; }
  if (r.players.size >= 100) throw new Error('Bu oda dolu.');
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 24) throw new Error('1–24 karakter arasında bir isim yaz.');
  name = name.trim();
  if ([...r.players.values()].some(p => p.name.toLocaleLowerCase('tr') === name.toLocaleLowerCase('tr'))) throw new Error('Bu isim kullanılıyor. Başka bir isim seç.');
  const p = { id: randomBytes(8).toString('hex'), token: randomBytes(24).toString('hex'), name, score: 0, correct: 0, wrong: 0, sockets: new Set(), blockedUntil: 0 };
  r.players.set(p.id, p); this.event(r, `${name} oyuna katıldı.`, 'join'); return p;
 }
 watch(r, socketId, name) {
  const watcher = { id: randomBytes(8).toString('hex'), name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 24) : `İzleyici ${++r.viewerSequence}` };
  r.watchers.set(socketId, watcher); r.updatedAt = this.now(); return watcher;
 }
 hostBuzz(r, socketId, credential) {
  if (!['open', 'answering'].includes(r.phase)) throw new Error('Soru açılınca basabilirsin.');
  let p = credential && [...r.players.values()].find(candidate => candidate.token === credential);
  if (!p) {
   let name = 'Sunucu'; let suffix = 1;
   while ([...r.players.values()].some(candidate => candidate.name.toLocaleLowerCase('tr') === name.toLocaleLowerCase('tr'))) name = `Sunucu ${++suffix}`;
   p = this.join(r, name);
  }
  p.sockets.add(socketId); this.buzz(r, p); return p;
 }
 start(r) {
  if (!['lobby', 'resolved'].includes(r.phase)) return false;
  if (r.phase === 'lobby') {
   const groups = groupByLetter(r.pool).map(group => group.filter(q => !this.usedQuestions.has(q.id)));
   const exhausted = groups.findIndex(group => !group.length);
   if (exhausted !== -1) {
    const letter = r.bank[exhausted].letter;
    throw new Error(letter + ' harfi için kullanılmamış soru kalmadı. Soru kütüphanesine yeni bir soru ekle.');
   }
   r.bank = groups.map(group => group[randomInt(group.length)]);
  }
  if (r.phase === 'resolved') {
   if (r.index >= r.bank.length - 1) { r.phase = 'final'; this.event(r, 'Oyun bitti. Alkışlar bütün ekibe!', 'correct'); return true; }
   r.index++;
  }
  r.phase = 'countdown'; r.revealAt = this.now() + 3000; r.deadline = null; r.settleAt = null; r.queue = []; r.locked = new Set(); r.result = null;
  this.event(r, `${r.bank[r.index].letter} harfi geliyor.`, 'info'); return true;
 }
 buzz(r, p) {
  const now = this.now();
  if (r.phase === 'countdown') { p.blockedUntil = now + 1500; throw new Error('Erken bastın. 1,5 saniye bekle.'); }
  if (!['open', 'answering'].includes(r.phase)) throw new Error('Buzzer henüz açık değil.');
  if (p.blockedUntil > now) throw new Error('Erken basma sürenin dolmasını bekle.');
  if (r.locked.has(p.id)) throw new Error('Bu sorudaki hakkını kullandın.');
  if (r.queue.some(b => b.id === p.id)) return false;
  r.queue.push({ id: p.id, at: now });
  if (r.phase === 'open' && !r.settleAt) r.settleAt = now + 150;
  return true;
 }
 activate(r) {
  r.queue = r.queue.filter(b => r.players.get(b.id)?.sockets.size);
  r.settleAt = null;
  if (r.queue.length) {
   r.phase = 'answering'; r.deadline = this.now() + ANSWER_SECONDS * 1000;
   this.event(r, `${r.players.get(r.queue[0].id).name} cevaplıyor.`, 'buzz');
  } else { r.phase = 'open'; r.deadline = null; }
 }
 judge(r, correct, timeout = false) {
  if (r.phase !== 'answering' || !r.queue.length) return false;
  if (!timeout && this.now() >= r.deadline) return this.judge(r, false, true);
  const head = r.queue[0]; const p = r.players.get(head.id); const q = r.bank[r.index];
  if (correct) this.recordCompletedWheel(r);
  const delta = (correct ? 1 : -1) * Math.round((correct ? q.points : q.penalty) * q.multiplier);
  p.score += delta; p[correct ? 'correct' : 'wrong']++;
  r.result = { id: p.id, correct, delta, timeout }; r.deadline = null;
  this.event(r, `${p.name} ${correct ? 'doğru bildi' : timeout ? 'süresini doldurdu' : 'yanlış cevapladı'}. ${delta > 0 ? '+' : ''}${delta} puan`, correct ? 'correct' : 'wrong');
  if (correct) { r.history.push({ letter: q.letter, status: 'correct' }); r.phase = 'resolved'; r.queue = []; }
  else { r.locked.add(p.id); r.queue.shift(); this.activate(r); }
  return true;
 }
 pass(r) {
  if (!['open', 'answering'].includes(r.phase)) return false;
  this.recordCompletedWheel(r);
  r.history.push({ letter: r.bank[r.index].letter, status: 'passed' });
  r.phase = 'resolved'; r.queue = []; r.deadline = null; r.settleAt = null;
  this.event(r, `${r.bank[r.index].letter} harfi pas geçildi.`, 'info'); return true;
 }
 tick() {
  const changed = [];
  for (const [code, r] of this.rooms) {
   if (this.now() - r.updatedAt > 12 * 3600000) { this.rooms.delete(code); continue; }
   if (r.phase === 'countdown' && this.now() >= r.revealAt) { r.phase = 'open'; changed.push(r); }
   if (r.phase === 'open' && r.settleAt && this.now() >= r.settleAt) { this.activate(r); changed.push(r); }
   if (r.phase === 'answering' && this.now() >= r.deadline) { this.judge(r, false, true); changed.push(r); }
  }
  return [...new Set(changed)];
 }
 state(r) {
  const { answer, explanation, ...question } = r.bank[r.index];
  const hidden = ['lobby', 'countdown'].includes(r.phase);
  return { code: r.code, phase: r.phase, index: r.index, total: r.bank.length, letters: r.bank.map(q => q.letter),
   watchers: [...r.watchers.values()],
   completed: r.history.map((entry, index) => ({ ...r.bank[index], index, status: entry.status })),
   question: { ...question, ...(hidden ? { text: '', code: '' } : {}), ...(['resolved', 'final'].includes(r.phase) ? { answer, explanation } : {}) },
   players: [...r.players.values()].map(({ id, name, score, sockets, correct, wrong }) => ({ id, name, score, correct, wrong, connected: !!sockets.size })),
   queue: r.settleAt ? [] : r.queue, pending: !!r.settleAt, locked: [...r.locked], deadline: r.deadline, revealAt: r.revealAt, result: r.result, history: r.history, events: r.events };
 }
}
