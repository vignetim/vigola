import { ANSWER_SECONDS, MULTIPLE_CHOICE_SECONDS, JOKERS } from '../lib/game-rules.mjs';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { questionPool } from '../lib/questions.mjs';
import { canonicalQuestionText, questionPoolForLanguage, validateLanguage } from '../lib/question-locales.mjs';

export const MAX_POOL_QUESTIONS = 300;

export function validateBank(value) {
 if (!Array.isArray(value) || !value.length || value.length > MAX_POOL_QUESTIONS) throw new Error('Havuza 1–300 soru ekleyebilirsin.');
 const text = (v, max, required = true) => {
  if (typeof v !== 'string' || (required && !v.trim()) || v.length > max) throw new Error('Soru alanlarını kontrol et.');
  return v.trim();
 };
 const number = (v, min, max) => { if (!Number.isFinite(v) || v < min || v > max) throw new Error('Puan ve katsayı aralığını kontrol et.'); return v; };
 const bank = value.map(q => {
  const answer = text(q?.answer, 200);
  let choices;
  if (q.choices !== undefined) {
   if (!Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 6) throw new Error('Her soruya 2–6 seçenek ekle.');
   choices = q.choices.map(choice => {
    const option = { id: text(choice?.id, 100), text: text(choice?.text, 200) };
    if (choice.weight !== undefined) {
     option.weight = number(choice.weight, -1000, 1000);
     if ((option.text === answer && option.weight < 0) || (option.text !== answer && option.weight > 0)) throw new Error('Doğru seçeneğin ağırlığı sıfır veya pozitif, yanlışların ağırlığı sıfır veya negatif olmalı.');
    }
    return option;
   });
   if (new Set(choices.map(choice => choice.id)).size !== choices.length || new Set(choices.map(choice => choice.text.normalize('NFC').toLowerCase())).size !== choices.length) throw new Error('Seçeneklerin kimlikleri ve metinleri farklı olmalı.');
   if (choices.filter(choice => choice.text === answer).length !== 1) throw new Error('Doğru cevap seçeneklerden tam biriyle eşleşmeli.');
  }
  return {
  id: createHash('sha256').update(canonicalQuestionText(text(q?.text, 1200), answer).normalize('NFC').replace(/\s+/g, ' ').toLocaleLowerCase('tr')).digest('hex'), letter: text(q.letter, 2).toLocaleUpperCase('tr'), category: text(q.category, 60),
  text: text(q.text, 1200), answer, explanation: text(q.explanation ?? '', 1500, false), code: text(q.code ?? '', 2000, false),
  difficulty: ['Kolay', 'Orta', 'Zor'].includes(q.difficulty) ? q.difficulty : 'Orta',
  points: number(q.points, 1, 1000), penalty: number(q.penalty, 0, 1000), multiplier: number(q.multiplier, 0.5, 5),
  ...(choices ? { choices } : {}),
 }; });
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

function shuffled(items) {
 const copy = [...items];
 for (let index = copy.length - 1; index > 0; index--) {
  const other = randomInt(index + 1);
  [copy[index], copy[other]] = [copy[other], copy[index]];
 }
 return copy;
}

function withChoices(question, pool) {
 if (question.choices) return question;
 const seen = new Set([question.answer.normalize('NFC').toLowerCase()]);
 const answers = [];
 const candidates = [...pool, ...questionPool];
 // Prefer the same initial so the wheel letter never gives away the answer.
 for (const sameLetter of [true, false]) {
  for (const candidate of shuffled(candidates.filter(candidate => (candidate.letter === question.letter) === sameLetter))) {
   const key = candidate.answer.normalize('NFC').toLowerCase();
   if (seen.has(key)) continue;
   seen.add(key); answers.push(candidate.answer);
   if (answers.length === 3) break;
  }
  if (answers.length === 3) break;
 }
 return { ...question, choices: shuffled([question.answer, ...answers]).map(text => ({ id: randomBytes(12).toString('hex'), text })) };
}

export class Engine {
 constructor(now = Date.now, { usedQuestions = new Set(), saveUsedQuestions = () => {} } = {}) {
  this.rooms = new Map();
  this.now = now;
  this.usedQuestions = usedQuestions;
  this.saveUsedQuestions = saveUsedQuestions;
 }
 setPool(room, pool = questionPoolForLanguage(room.language)) {
  const validated = validateBank(pool);
  room.pool = room.mode === 'multiple-choice' ? validated.map(question => withChoices(question, validated)) : validated;
  room.bank = groupByLetter(room.pool).map(([first]) => first);
 }
 recordCompletedWheel(room) {
  if (room.index !== room.bank.length - 1) return;
  const used = new Set(this.usedQuestions);
  for (const question of room.bank) used.add(question.id);
  this.saveUsedQuestions(used);
  this.usedQuestions = used;
 }
 create(pool, mode = 'buzzer', language = 'en') {
  validateLanguage(language);
  if (!['buzzer', 'multiple-choice'].includes(mode)) throw new Error('Geçerli bir oyun modu seç.');
  if (this.rooms.size >= 200) throw new Error('Şu an çok fazla oda var. Biraz sonra tekrar dene.');
  let code; const alphabet = 'ABCDEFGHJKLMNPRSTUVYZ';
  do { code = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join(''); } while (this.rooms.has(code));
  const room = { code, mode, language, token: randomBytes(24).toString('hex'), players: new Map(), watchers: new Map(), viewerSequence: 0, phase: 'lobby', index: 0, queue: [], locked: new Set(), deadline: null, revealAt: null, settleAt: null, result: null, submissions: new Map(), roundJokers: new Map(), choiceResults: [], completedChoices: new Map(), history: [], events: [], updatedAt: this.now() };
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
  const p = { id: randomBytes(8).toString('hex'), token: randomBytes(24).toString('hex'), name, score: 0, correct: 0, wrong: 0, sockets: new Set(), blockedUntil: 0, availableJokers: new Set(r.mode === 'multiple-choice' ? JOKERS : []) };
  r.players.set(p.id, p); this.event(r, `${name} oyuna katıldı.`, 'join'); return p;
 }
 watch(r, socketId, name) {
  const watcher = { id: randomBytes(8).toString('hex'), name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 24) : `İzleyici ${++r.viewerSequence}` };
  r.watchers.set(socketId, watcher); r.updatedAt = this.now(); return watcher;
 }
 hostBuzz(r, socketId, credential) {
  if (r.mode !== 'buzzer') throw new Error('Bu odada cevap vermek için bir seçenek seç.');
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
   r.bank = groups.map(group => {
    const question = group[randomInt(group.length)];
    return r.mode === 'multiple-choice' ? { ...question, choices: shuffled(question.choices) } : question;
   });
  }
  if (r.phase === 'resolved') {
   if (r.index >= r.bank.length - 1) { r.phase = 'final'; this.event(r, 'Oyun bitti. Alkışlar bütün ekibe!', 'correct'); return true; }
   r.index++;
  }
  r.phase = 'countdown'; r.revealAt = this.now() + 3000; r.deadline = null; r.settleAt = null; r.queue = []; r.locked = new Set(); r.result = null; r.submissions = new Map(); r.roundJokers = new Map(); r.choiceResults = []; r.choiceRevealRetryAt = null;
  this.event(r, `${r.bank[r.index].letter} harfi geliyor.`, 'info'); return true;
 }
 buzz(r, p) {
  if (r.mode !== 'buzzer') throw new Error('Bu odada cevap vermek için bir seçenek seç.');
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
  if (r.mode !== 'buzzer') return false;
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
  if (r.mode !== 'buzzer') return false;
  if (!['open', 'answering'].includes(r.phase)) return false;
  this.recordCompletedWheel(r);
  r.history.push({ letter: r.bank[r.index].letter, status: 'passed' });
  r.phase = 'resolved'; r.queue = []; r.deadline = null; r.settleAt = null;
  this.event(r, `${r.bank[r.index].letter} harfi pas geçildi.`, 'info'); return true;
 }
 choiceContext(r, p, questionId) {
  if (r.mode !== 'multiple-choice') throw new Error('Bu oda çoktan seçmeli modda değil.');
  if (!p || r.players.get(p.id) !== p) throw new Error('Önce oyuna katıl.');
  if (r.phase !== 'open') throw new Error('Şu anda cevap gönderilemez.');
  const now = this.now();
  if (now >= r.deadline) throw new Error('Cevap süresi doldu.');
  const question = r.bank[r.index];
  if (questionId !== question.id) throw new Error('Bu soru artık aktif değil.');
  return { question, now };
 }
 playerAnswer(r, p) {
  if (!p || r.players.get(p.id) !== p) throw new Error('Önce oyuna katıl.');
  const selections = r.submissions.get(p.id) || [];
  const active = r.roundJokers.get(p.id);
  return {
   code: r.code, questionId: r.bank[r.index].id,
   choiceId: selections[0]?.choiceId ?? null,
   choiceIds: selections.map(selection => selection.choiceId),
   joker: active?.joker ?? null,
   eliminatedChoiceIds: [...(active?.eliminatedChoiceIds || [])],
   availableJokers: [...p.availableJokers],
  };
 }
 useJoker(r, p, questionId, joker) {
  const { question, now } = this.choiceContext(r, p, questionId);
  if (!JOKERS.includes(joker)) throw new Error('Geçerli bir joker seç.');
  if (r.submissions.has(p.id)) throw new Error('Jokeri cevap vermeden önce kullanmalısın.');
  if (r.roundJokers.has(p.id)) throw new Error('Bir soruda yalnızca bir joker kullanabilirsin.');
  if (!p.availableJokers.has(joker)) throw new Error('Bu jokeri zaten kullandın.');
  if (joker === 'fifty-fifty' && question.choices.length <= 2) throw new Error('Yarı yarıya için ikiden fazla seçenek olmalı.');
  const eliminatedChoiceIds = joker === 'fifty-fifty'
   ? shuffled(question.choices.filter(choice => choice.text !== question.answer)).slice(0, question.choices.length - 2).map(choice => choice.id)
   : [];
  r.roundJokers.set(p.id, { joker, eliminatedChoiceIds });
  p.availableJokers.delete(joker);
  r.updatedAt = now;
  return true;
 }
 submitChoice(r, p, questionId, choiceId) {
  const { question, now } = this.choiceContext(r, p, questionId);
  if (!question.choices.some(choice => choice.id === choiceId)) throw new Error('Geçerli bir seçenek seç.');
  const active = r.roundJokers.get(p.id);
  if (active?.eliminatedChoiceIds.includes(choiceId)) throw new Error('Elenen bir seçeneği seçemezsin.');
  const selections = r.submissions.get(p.id) || [];
  const limit = active?.joker === 'double-answer' ? 2 : 1;
  if (selections.length >= limit || selections.some(selection => selection.choiceId === choiceId)) throw new Error('Cevabın kaydedildi; bu soruda tekrar seçemezsin.');
  selections.push({ choiceId, at: now });
  r.submissions.set(p.id, selections);
  r.updatedAt = now;
  return true;
 }
 allChoicesComplete(r) {
  return r.players.size > 0 && [...r.players.keys()].every(id => {
   const limit = r.roundJokers.get(id)?.joker === 'double-answer' ? 2 : 1;
   return (r.submissions.get(id)?.length || 0) >= limit;
  });
 }
 revealChoices(r, questionId) {
  if (r.mode !== 'multiple-choice') throw new Error('Bu oda çoktan seçmeli modda değil.');
  if (questionId !== r.bank[r.index].id) throw new Error('Bu soru artık aktif değil.');
  if (r.phase !== 'open') return false;
  const question = r.bank[r.index];
  const solo = r.submissions.size === 1;
  const results = [...r.players.values()].map(player => {
   const selections = r.submissions.get(player.id);
   if (!selections?.length) return { id: player.id, choiceId: null, correct: null, delta: 0 };
   const selected = selections.map(selection => ({ ...selection, choice: question.choices.find(option => option.id === selection.choiceId) }));
   const scoring = selected.find(selection => selection.choice.text === question.answer) || selected[0];
   const { choiceId, choice, at } = scoring;
   const correct = choice.text === question.answer;
   const joker = r.roundJokers.get(player.id)?.joker ?? null;
   const weight = choice.weight ?? (correct ? question.points : -question.penalty);
   const elapsedMs = Math.max(0, Math.min(MULTIPLE_CHOICE_SECONDS * 1000, at - r.revealAt));
   // Correct answers earn 100% at opening, decreasing linearly to 50% at expiry.
   // Use server receipt time; revealing early must not change earned points.
   const speedFactor = correct ? 1 - elapsedMs / (2 * MULTIPLE_CHOICE_SECONDS * 1000) : 1;
   let delta = Math.sign(weight) * Math.round(Math.abs(weight) * question.multiplier * speedFactor);
   if (correct && solo) delta *= 2;
   if (correct && joker === 'double-points') delta *= 2;
   if (!correct && joker === 'shield') delta = 0;
   return { id: player.id, choiceId, choiceIds: selections.map(selection => selection.choiceId), correct, delta, elapsedMs, joker, soloBonus: correct && solo };
  });
  // Persist first: a disk failure must not leave a partially scored final round.
  this.recordCompletedWheel(r);
  for (const result of results) {
   if (result.correct === null) continue;
   const player = r.players.get(result.id);
   player.score += result.delta;
   player[result.correct ? 'correct' : 'wrong']++;
  }
  r.choiceResults = results;
  r.completedChoices.set(r.index, results);
  r.history.push({ letter: question.letter, status: results.some(result => result.correct) ? 'correct' : 'passed' });
  r.phase = 'resolved'; r.deadline = null; r.settleAt = null; r.queue = [];
  this.event(r, `${question.letter} harfinin cevapları açıldı.`, 'info');
  return true;
 }
 tick() {
  const changed = [];
  for (const [code, r] of this.rooms) {
   if (this.now() - r.updatedAt > 12 * 3600000) { this.rooms.delete(code); continue; }
   if (r.phase === 'countdown' && this.now() >= r.revealAt) {
    r.phase = 'open';
    if (r.mode === 'multiple-choice') r.deadline = r.revealAt + MULTIPLE_CHOICE_SECONDS * 1000;
    changed.push(r);
   }
   if (r.mode === 'multiple-choice' && r.phase === 'open' && (this.now() >= r.deadline || this.allChoicesComplete(r)) && (!r.choiceRevealRetryAt || this.now() >= r.choiceRevealRetryAt)) {
    // End the answering window even if persisting the results needs a retry.
    r.deadline = Math.min(r.deadline, this.now());
    try { this.revealChoices(r, r.bank[r.index].id); }
    catch {
     // A failed history write leaves scoring untouched. Retry without stopping
     // the timer for every room or accepting answers after the deadline.
     if (!r.choiceRevealRetryAt) this.event(r, 'Sonuçlar kaydedilemedi; tekrar deneniyor.', 'info');
     r.choiceRevealRetryAt = this.now() + 1000;
    }
    changed.push(r);
   }
   if (r.phase === 'open' && r.settleAt && this.now() >= r.settleAt) { this.activate(r); changed.push(r); }
   if (r.phase === 'answering' && this.now() >= r.deadline) { this.judge(r, false, true); changed.push(r); }
  }
  return [...new Set(changed)];
 }
 state(r) {
  const { answer, explanation, choices, ...question } = r.bank[r.index];
  const hidden = ['lobby', 'countdown'].includes(r.phase);
  const revealed = ['resolved', 'final'].includes(r.phase);
  const publicChoices = r.mode === 'multiple-choice' && !hidden ? { choices: choices.map(choice => revealed ? { ...choice } : { id: choice.id, text: choice.text }) } : {};
  return { code: r.code, mode: r.mode, language: r.language, phase: r.phase, index: r.index, total: r.bank.length, letters: r.bank.map(q => q.letter),
   watchers: [...r.watchers.values()],
   completed: r.history.map((entry, index) => ({ ...r.bank[index], index, status: entry.status, ...(r.mode === 'multiple-choice' ? { choiceResults: r.completedChoices.get(index) || [] } : {}) })),
   question: { ...question, ...publicChoices, ...(hidden ? { text: '', code: '' } : {}), ...(revealed ? { answer, explanation } : {}) },
   submitted: [...r.submissions.keys()], choiceResults: revealed ? r.choiceResults : [],
   players: [...r.players.values()].map(({ id, name, score, sockets, correct, wrong }) => ({ id, name, score, correct, wrong, connected: !!sockets.size })),
   queue: r.settleAt ? [] : r.queue, pending: !!r.settleAt, locked: [...r.locked], deadline: r.deadline, revealAt: r.revealAt, result: r.result, history: r.history, events: r.events };
 }
}
