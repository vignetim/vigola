import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import { Engine } from './server/engine.mjs';
import { loadQuestionHistory } from './server/question-history.mjs';
import { quizPoolForLanguage } from './lib/quiz-questions.mjs';
import { quizCategoryCounts } from './lib/quiz-categories.mjs';

const port = Number(process.env.PORT || 3000);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, webpack: true, hostname: '0.0.0.0', port });
await app.prepare();
const handler = app.getRequestHandler();
const server = createServer((req, res) => {
 if (req.url === '/api/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"status":"ok","product":"vigola"}'); return; }
 handler(req, res);
});
const io = new Server(server, { maxHttpBufferSize: 4 * 1024 * 1024 });
const engine = new Engine(Date.now, loadQuestionHistory());
const hostChannel = room => room.code + ':host';
const broadcast = room => {
 io.to(hostChannel(room)).emit('host:question', { code: room.code, question: room.bank[room.index] });
 for (const player of room.players.values()) {
  for (const socketId of player.sockets) io.to(socketId).emit('player:answer', engine.playerAnswer(room, player));
 }
 io.to(room.code).emit('state', engine.state(room));
};
const creationLimits = new Map();
io.on('connection', socket => {
 let room, player, host = false;
 let hits = [];
 const leave = () => {
  if (!room) return;
  socket.leave(room.code);
  if (host) socket.leave(hostChannel(room));
  room.watchers.delete(socket.id);
  if (player) {
   player.sockets.delete(socket.id);
   // A short disconnect does not consume the turn. The existing deadline remains
   // authoritative, so the player can reconnect before their answer deadline.
  }
  broadcast(room); room = null; player = null; host = false;
 };
 const on = (name, fn) => socket.on(name, (data, ack) => {
  if (typeof ack !== 'function') return;
  hits = hits.filter(t => Date.now() - t < 1000);
  if (hits.length >= 30) return ack({ ok: false, error: 'Çok hızlı işlem yapıyorsun. Biraz bekle.' });
  hits.push(Date.now());
  try { const result = fn(data ?? {}); ack({ ok: true, ...result }); if (room) broadcast(room); }
  catch (error) { ack({ ok: false, error: error instanceof Error ? error.message : 'İşlem tamamlanamadı.' }); }
 });
 const hostOnly = fn => data => { if (!host || !room) throw new Error('Bu işlem sunucuya ait.'); return fn(data); };
 on('clock', () => ({ now: Date.now() }));
 on('quiz:categories', ({ language }) => ({ categoryCounts: quizCategoryCounts(quizPoolForLanguage(language)) }));
 on('host:create', data => {
  const key = socket.handshake.address; const recent = (creationLimits.get(key) || []).filter(t => Date.now() - t < 60000);
  if (recent.length >= 12) throw new Error('Yeni oda açmadan önce bir dakika bekle.');
  recent.push(Date.now()); creationLimits.set(key, recent);
  const created = engine.create(data.bank, data.mode, data.language, data.quizCategory); leave(); room = created; host = true; socket.join([room.code, hostChannel(room)]);
  return { code: room.code, token: room.token, bank: room.pool, mode: room.mode, language: room.language, quizCategory: room.quizCategory };
 });
 on('host:resume', ({ code, token, playerToken }) => {
  const r = engine.rooms.get(String(code)); if (!r || r.token !== token) throw new Error('Oda oturumu sona ermiş. Yeni oda oluşturabilirsin.');
  leave(); room = r; host = true; socket.join([r.code, hostChannel(r)]);
  player = playerToken && [...r.players.values()].find(p => p.token === playerToken);
  if (player) player.sockets.add(socket.id);
  return { bank: r.pool, mode: r.mode, language: r.language, quizCategory: r.quizCategory, ...(player ? { id: player.id, playerToken: player.token, name: player.name } : {}) };
 });
 on('host:buzz', hostOnly(({ playerToken }) => {
  const p = engine.hostBuzz(room, socket.id, player?.token || playerToken); player = p;
  return { id: p.id, playerToken: p.token, name: p.name };
 }));
 on('host:start', hostOnly(() => { engine.start(room); }));
 on('host:judge', hostOnly(({ correct, playerId, questionId }) => {
  if (typeof correct !== 'boolean') throw new Error('Geçersiz karar.');
  if (room.queue[0]?.id !== playerId || room.bank[room.index].id !== questionId) return;
  engine.judge(room, correct);
 }));
 on('host:pass', hostOnly(() => { engine.pass(room); }));
 on('host:reveal', hostOnly(({ questionId }) => { engine.revealChoices(room, questionId); }));
 on('host:bank', hostOnly(({ bank }) => {
  if (room.phase !== 'lobby') throw new Error('Sorular yalnızca oyun başlamadan değiştirilebilir.');
  engine.setPool(room, bank ?? undefined);
  io.to(hostChannel(room)).emit('host:pool', room.pool);
  return { bank: room.pool };
 }));
 on('player:join', ({ code, name, token }) => {
  const r = engine.rooms.get(String(code).trim().toUpperCase()); if (!r) throw new Error('Oda bulunamadı. Kodu kontrol et.');
  const p = engine.join(r, name, token); leave(); room = r; player = p; p.sockets.add(socket.id); socket.join(r.code);
  return { id: p.id, token: p.token, name: p.name };
 });
 on('watch', ({ code, name }) => {
  const r = engine.rooms.get(String(code).trim().toUpperCase()); if (!r) throw new Error('Oda bulunamadı.');
  leave(); room = r; socket.join(r.code); engine.watch(r, socket.id, name);
 });
 on('buzz', () => { if (!room || !player) throw new Error('Önce oyuna katıl.'); engine.buzz(room, player); });
 on('answer', ({ questionId, choiceId }) => {
  if (!room || !player) throw new Error('Önce oyuna katıl.');
  engine.submitChoice(room, player, questionId, choiceId);
  return { answer: engine.playerAnswer(room, player) };
 });
 on('joker', ({ questionId, joker }) => {
  if (!room || !player) throw new Error('Önce oyuna katıl.');
  engine.useJoker(room, player, questionId, joker);
  return { answer: engine.playerAnswer(room, player) };
 });
 socket.on('disconnect', leave);
});
const timer = setInterval(() => { for (const room of engine.tick()) broadcast(room); }, 40);
timer.unref();
const cleanup = setInterval(() => { const cutoff = Date.now() - 60000; for (const [key, times] of creationLimits) if (times.every(t => t < cutoff)) creationLimits.delete(key); }, 60000);
cleanup.unref();
server.listen(port, '0.0.0.0', () => console.log(`Vigola → http://localhost:${port}`));
