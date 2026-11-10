'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ArrowRight, AudioLines, Check, CheckCheck, ChevronRight, CircleHelp, Copy, ExternalLink, Gamepad2, LoaderCircle, Plus, ShieldCheck, Sparkles, Trophy, Users, Volume2, VolumeX, X, Zap } from 'lucide-react';
import type { GameState, Player, Question } from '@/lib/types';
import { ANSWER_SECONDS } from '@/lib/game-rules.mjs';
import GameWheel from './game-wheel';
import ThemeToggle from './theme-toggle';

type Reply = { ok: boolean; error?: string; code?: string; token?: string; id?: string; name?: string; bank?: Question[]; playerToken?: string; now?: number };
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
const preview = { letter: 'A', category: 'Web geliştirme', difficulty: 'Kolay', text: 'Farklı yazılımların birbiriyle iletişim kurmasını sağlayan arayüze ne ad verilir?', points: 100, penalty: 25, multiplier: 1 };
const read = (key: string) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
const save = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The game also works without browser storage. */ } };

function Avatar({ player, small = false }: { player: Pick<Player, 'name' | 'id'>; small?: boolean }) {
 const hue = [...player.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 5;
 return <span className={`avatar color-${hue} ${small ? 'small' : ''}`}>{player.name.slice(0, 2).toLocaleUpperCase('tr')}</span>;
}

export default function Game() {
 const socket = useRef<Socket | null>(null);
 const modalElement = useRef<HTMLDivElement | null>(null);
 const [state, setState] = useState<GameState | null>(null);
 const [bank, setBank] = useState<Question[]>([]);
 const [privateQuestion, setPrivateQuestion] = useState<{ code: string; question: Question } | null>(null);
 const [role, setRole] = useState<'host' | 'player' | 'watch'>('watch');
 const [pid, setPid] = useState('');
 const [connected, setConnected] = useState(false);
 const [modal, setModal] = useState<'invite' | 'rules' | 'join' | 'new' | 'questions' | null>(null);
 const [joinCode, setJoinCode] = useState('');
 const [name, setName] = useState('');
 const [toast, setToast] = useState('');
 const [busy, setBusy] = useState(false);
 const [now, setNow] = useState(0);
 const [offset, setOffset] = useState(0);
 const [muted, setMuted] = useState(false);
 const [selected, setSelected] = useState(0);
 const [search, setSearch] = useState('');
 const notify = useCallback((message: string) => setToast(message), []);
 const send = useCallback((event: string, data: unknown = {}): Promise<Reply> => new Promise(resolve => {
  if (!socket.current?.connected) { notify('Bağlantı kuruluyor. Biraz sonra tekrar dene.'); resolve({ ok: false }); return; }
  socket.current.timeout(5000).emit(event, data, (error: Error | null, response: Reply) => {
   if (error) { notify('Sunucuya ulaşılamadı. Tekrar dene.'); resolve({ ok: false }); return; }
   if (!response.ok) notify(response.error || 'İşlem tamamlanamadı.');
   resolve(response);
  });
 }), [notify]);

 const create = useCallback(async () => {
  setBusy(true);
  const bank = read('vigola-use-default-pool') ? undefined : read('vigola-bank') || undefined;
  const result = await send('host:create', { bank });
  if (result.ok) {
   save('vigola-host', { code: result.code, token: result.token }); setBank(result.bank || []);
   setRole('host'); setPid(''); setModal(null);
   history.replaceState(null, '', '/');
  }
  setBusy(false);
 }, [send]);

 useEffect(() => {
  const s = io({ autoConnect: false }); socket.current = s;
  s.on('connect', async () => {
   setConnected(true);
   const t = Date.now(); const clock = await send('clock');
   if (clock.now) setOffset(clock.now + (Date.now() - t) / 2 - Date.now());
   const params = new URLSearchParams(location.search); const code = params.get('room');
   if (code) {
    setJoinCode(code.toUpperCase());
    if (params.get('watch') === '1') { setRole('watch'); await send('watch', { code }); }
    else {
     setRole('player'); const saved = read(`vigola-player-${code}`);
     if (saved) { const r = await send('player:join', { code, ...saved }); if (r.ok) { setPid(r.id!); setName(r.name!); setModal(null); } else setModal('join'); }
     else { await send('watch', { code }); setModal('join'); }
    }
   } else {
    const saved = read('vigola-host');
    if (saved) { const r = await send('host:resume', saved); if (r.ok) { setBank(r.bank || []); setRole('host'); if (r.id) setPid(r.id); } else await create(); }
    else await create();
   }
  });
  s.on('disconnect', () => setConnected(false));
  s.on('host:question', setPrivateQuestion);
  s.on('host:pool', setBank);
  s.on('state', (value: GameState) => setState(value));
  s.connect();
  return () => { s.disconnect(); socket.current = null; };
 }, [send, create]);
 useEffect(() => { const id = setInterval(() => setNow(Date.now() + offset), 80); return () => clearInterval(id); }, [offset]);
 useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 4000); return () => clearTimeout(id); }, [toast]);
 useEffect(() => {
  if (!modal) return;
  const previous = document.activeElement as HTMLElement | null;
  const el = modalElement.current;
  const selector = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]';
  const first = el?.querySelector<HTMLElement>('input') || el?.querySelector<HTMLElement>(selector);
  first?.focus();
  const onKey = (e: KeyboardEvent) => {
   if (e.key === 'Escape') setModal(null);
   if (e.key !== 'Tab' || !el) return;
   const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
   const firstItem = items[0]; const lastItem = items[items.length - 1];
   if (e.shiftKey && document.activeElement === firstItem) { e.preventDefault(); lastItem?.focus(); }
   if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); firstItem?.focus(); }
  };
  document.addEventListener('keydown', onKey);
  return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
 }, [modal]);

 const head = state?.players.find(p => p.id === state.queue[0]?.id);
 const phase = state?.phase || 'lobby';
 const isHost = role === 'host';
 const me = state?.players.find(p => p.id === pid);
 const sorted = [...(state?.players || [])].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'tr'));
 const current = state?.question || preview;
 const hostQuestion = isHost && privateQuestion && privateQuestion.code === state?.code
  && privateQuestion.question.id === state?.question.id ? privateQuestion.question : undefined;
 const questionText = current.text || (isHost ? hostQuestion?.text || preview.text : 'Sunucu soruyu açtığında burada göreceksin.');
 const secs = state?.deadline ? Math.min(ANSWER_SECONDS, Math.max(0, Math.ceil((state.deadline - now) / 1000))) : ANSWER_SECONDS;
 const countdown = state?.revealAt ? Math.max(1, Math.ceil((state.revealAt - now) / 1000)) : 3;
 const canBuzz = connected && !!me && ['open', 'answering'].includes(phase) && !state?.locked.includes(pid) && !state?.queue.some(b => b.id === pid) && !state?.pending;
 const judge = useCallback((correct: boolean) => send('host:judge', { correct, playerId: head?.id, questionId: state?.question.id }), [send, head?.id, state?.question.id]);
 const canPress = connected && (isHost ? me ? canBuzz : ['open', 'answering'].includes(phase) && !state?.pending : me ? canBuzz : !!state);
 const pressBuzzer = useCallback(async () => {
  if (!isHost && !me) { if (state?.code) setJoinCode(state.code); setModal('join'); return; }
  if (isHost) {
   const saved = read('vigola-host');
   const result = await send('host:buzz', { playerToken: saved?.playerToken });
   if (result.ok) { setPid(result.id!); save('vigola-host', { ...saved, playerToken: result.playerToken }); }
  } else await send('buzz');
 }, [isHost, me, state?.code, send]);


 const resultKey = state?.result ? `${state.index}:${state.result.id}:${state.result.correct}` : '';
 useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
   if (modal || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes((e.target as HTMLElement).tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
   if (e.code === 'Space' && canPress) { e.preventDefault(); void pressBuzzer(); }
   if (isHost) {
    if (e.code === 'ArrowRight' && ['lobby', 'resolved'].includes(phase)) void send('host:start');
    if (phase === 'answering' && e.key.toLowerCase() === 'd') void judge(true);
    if (phase === 'answering' && e.key.toLowerCase() === 'y') void judge(false);
   }
  };
  window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
 }, [modal, isHost, canPress, pressBuzzer, send, judge, phase]);

 useEffect(() => {
  if (!state?.result || muted) return;
  try {
   const ac = new AudioContext(); const oscillator = ac.createOscillator(); const gain = ac.createGain();
   oscillator.connect(gain); gain.connect(ac.destination); oscillator.frequency.value = state.result.correct ? 660 : 220;
   gain.gain.setValueAtTime(0.055, ac.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.25);
   oscillator.start(); oscillator.stop(ac.currentTime + 0.25); oscillator.onended = () => { void ac.close(); };
  } catch { /* Audio is optional on browsers requiring interaction. */ }
 // A fresh state broadcast must not play the same result again.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [resultKey, muted]);

 const join = async (event: React.FormEvent) => {
  event.preventDefault(); setBusy(true);
  const code = joinCode.trim().toUpperCase();
  const saved = read(`vigola-player-${code}`);
  const token = saved?.name?.toLocaleLowerCase('tr') === name.trim().toLocaleLowerCase('tr') ? saved.token : undefined;
  const result = await send('player:join', { code, name, token });
  if (result.ok) { save(`vigola-player-${code}`, { token: result.token, name: result.name }); setRole('player'); setPid(result.id!); setModal(null); history.replaceState(null, '', `/?room=${code}`); }
  setBusy(false);
 };
 const invite = async () => {
  try { await navigator.clipboard.writeText(`${location.origin}/?room=${state?.code}`); notify('Davet bağlantısı kopyalandı. Ekibinle paylaş!'); }
  catch { setModal('invite'); notify('Bağlantıyı seçip kopyalayabilirsin.'); }
 };
 const update = (key: keyof Question, value: string | number) => setBank(b => b.map((q, i) => i === selected ? { ...q, [key]: value } : q));
 const storeBank = async () => {
  const r = await send('host:bank', { bank });
  if (r.ok && r.bank) {
   setBank(r.bank);
   save('vigola-bank', r.bank);
   save('vigola-use-default-pool', false);
   notify('Soru havuzu kaydedildi.');
  }
 };
 const restoreDefaultPool = async () => {
  const result = await send('host:bank', { bank: null });
  if (!result.ok || !result.bank) return;
  setBank(result.bank);
  setSelected(0);
  setSearch('');
  save('vigola-use-default-pool', true);
  notify('Hazır soru havuzu seçildi.');
 };
 const liveLetters = state?.letters || letters;

 return <div className={`app-shell ${isHost ? 'host-view' : 'player-view'}`}>
  <div className="workspace" inert={!!modal}>
   <header className="game-header">
    <div className="wordmark">vigola<span>.</span></div>
    <div className="header-room"><span className={`connection-dot ${connected ? 'online' : ''}`} /><span>{connected ? 'Oda' : 'Bağlanıyor'}</span><b>{state?.code || '••••••'}</b></div>
    {me && <span className="header-score">{me.name}<b>{me.score} <small>puan</small></b></span>}
    <div className="header-actions">
     <ThemeToggle />
     {isHost && <button className="icon-button" aria-label="İzleyici ekranını aç" title="İzleyici ekranı" onClick={() => { if (state) window.open(`/?room=${state.code}&watch=1`, '_blank', 'noopener,noreferrer'); }}><ExternalLink size={20} /></button>}
     <button className="icon-button" aria-label={muted ? 'Sesi aç' : 'Sesi kapat'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={21} /> : <Volume2 size={21} />}</button>
     {isHost && <><button className="button secondary header-edit" onClick={() => setModal('questions')}>Soruları düzenle</button><button className="button secondary" onClick={() => setModal('new')} aria-label="Yeni oyun"><Plus size={18} /><span>Yeni oyun</span></button><button className="button primary invite-button" disabled={!state} onClick={() => setModal('invite')}><Users size={18} /><span>Davet et</span></button></>}
     {!isHost && <button className="icon-button" onClick={() => setModal('rules')} aria-label="Oyun kuralları"><CircleHelp size={21} /></button>}
    </div>
   </header>
   <main className="live-board">
    <section className="question-column board-panel" aria-label="Soru ve cevap akışı">
     <div className="column-heading"><h1>Soru akışı</h1><span>{(state?.index || 0) + 1} / {state?.total || 24}</span></div>
     <div className="question-scroll">
      <article className="current-question">
       <div className="question-kicker"><span className="question-letter">{current.letter}</span><div><b>{current.category}</b><span>{phase === 'lobby' ? 'Soru bekleniyor' : phase === 'countdown' ? 'Soru hazırlanıyor' : 'Şu anki soru'}</span></div><span className="difficulty">{current.difficulty}</span></div>
       <h2>{phase === 'lobby' ? 'Ekibin hazır mı?' : phase === 'countdown' ? 'Sıradaki soru geliyor…' : questionText}</h2>
       {phase === 'lobby' && <p className="game-message">{isHost ? 'Oyuncuları davet et, ardından oyunu başlat.' : 'Soruyu gör, ilk sen bas, cevabı sesli söyle.'}</p>}
       {!['lobby', 'countdown'].includes(phase) && <><div className="question-stakes"><span className="green">+{Math.round(current.points * current.multiplier)} doğru</span><span className="red">−{Math.round(current.penalty * current.multiplier)} yanlış</span></div>{state?.question.code && <pre className="code-sample"><code>{state.question.code}</code></pre>}</>}
       {isHost && hostQuestion ? <div className="host-solution"><span><ShieldCheck size={14} />YALNIZCA SUNUCU GÖRÜR</span><strong>{hostQuestion.answer}</strong><p>{hostQuestion.explanation}</p></div> : state?.question.answer && <div className="revealed-solution"><span><Check size={16} />Doğru cevap</span><strong>{state.question.answer}</strong><p>{state.question.explanation}</p></div>}
      </article>
      {!!state?.completed?.filter(entry => entry.index !== state.index).length && <h3 className="past-heading">Önceki sorular</h3>}
      {[...(state?.completed || [])].filter(entry => entry.index !== state?.index).reverse().map(entry => <article className="past-question" key={entry.index}><div><span className="question-letter">{entry.letter}</span><b>{entry.answer}</b><span className={entry.status === 'correct' ? 'green' : 'muted'}>{entry.status === 'correct' ? 'Bilindi' : 'Pas'}</span></div><p>{entry.text}</p></article>)}
     </div>
     {isHost && <div className="host-controls" aria-label="Sunucu oyun kontrolleri">
      <div className="judge-row"><button className="button correct-button" disabled={!connected || phase !== 'answering'} onClick={() => void judge(true)}><Check size={22} />Doğru<kbd>D</kbd></button><button className="button wrong-button" disabled={!connected || phase !== 'answering'} onClick={() => void judge(false)}><X size={22} />Yanlış<kbd>Y</kbd></button></div>
      <div className="advance-row"><button className="button secondary" disabled={!connected || !['open', 'answering'].includes(phase)} onClick={() => void send('host:pass')}>Pas geç<ChevronRight size={18} /></button><button className="button primary" disabled={!connected || !['lobby', 'resolved', 'final'].includes(phase)} onClick={() => phase === 'final' ? setModal('new') : void send('host:start')}>{phase === 'lobby' ? 'Oyunu başlat' : phase === 'final' ? 'Yeni tur' : state?.index === (state?.total || 0) - 1 ? 'Sonuçlar' : 'Sonraki harf'}<ArrowRight size={18} /></button></div>
     </div>}
    </section>

    <section className="wheel-column" aria-label="Oyun alanı">
     <div className="stage-top"><span>YAZILIM PASSAPAROLASI</span><span className={`round-status ${phase}`}><i />{phase === 'lobby' ? 'Lobi' : phase === 'countdown' ? 'Hazır ol' : phase === 'answering' ? 'Cevap zamanı' : phase === 'resolved' ? 'Tamamlandı' : phase === 'final' ? 'Final' : 'Buzzer açık'}</span></div>
     {phase === 'final' ? <div className="final-stage"><Trophy className="final-trophy" size={48} /><h2>{sorted.length ? `${sorted[0].name} kazandı!` : 'Oyun tamamlandı'}</h2><p className="game-message">Her harfte biraz daha öğrendik.</p><div className="podium">{sorted.slice(0, 3).map((p, i) => <div className={`podium-place place-${i}`} key={p.id}><Avatar player={p} /><b>{p.name}</b><span>{p.score} puan</span><div>{i + 1}</div></div>)}</div></div> : <GameWheel letters={liveLetters} letter={current.letter} history={state?.history || []} phase={phase} seconds={secs} countdown={countdown} />}
     <div className="turn-status" role="status" aria-live="polite">
      {phase === 'answering' ? <><AudioLines size={22} /><b>{head?.id === pid ? 'Söz sende!' : `${head?.name || 'Oyuncu'} cevaplıyor`}</b></> : phase === 'countdown' ? 'Parmaklar butonlarda…' : phase === 'lobby' ? 'Herkes hazırsa başlayalım.' : phase === 'resolved' ? state?.result?.correct ? `${state.players.find(p => p.id === state.result?.id)?.name || 'Oyuncu'} doğru bildi!` : 'Bu harfi pas geçtik.' : phase === 'final' ? 'Alkışlar bütün ekibe!' : state?.pending ? 'İlk basan belirleniyor…' : 'Biliyorsan, bas!'}
     </div>
     <div className="buzz-queue"><div className="queue-title"><Zap size={16} /><h2>Basış sırası</h2><span>{state?.queue.length || 0}</span></div>{state?.queue.length ? <div className="queue-entries">{state.queue.map((entry, index) => { const p = state.players.find(p => p.id === entry.id); return p && <div className={index === 0 ? 'on-mic' : ''} key={entry.id}><span>{index + 1}</span><Avatar player={p} small /><b>{p.name}</b><small>{index === 0 ? 'Cevaplıyor' : 'Bekliyor'}</small></div>; })}</div> : <p>{state?.pending ? 'Basışlar alınıyor…' : 'Henüz basan yok.'}</p>}</div>

    </section>

    <aside className="people-column board-panel" aria-label="Puanlar, izleyiciler ve buzzer">
     <section className="leaderboard"><div className="column-heading"><h2><Trophy size={18} />Puan tablosu</h2><span>{sorted.length} oyuncu</span></div><div className="score-list">{sorted.length ? sorted.map((p, index) => <div key={p.id} className={p.id === pid ? 'is-me' : ''}><span className="rank">{index + 1}</span><Avatar player={p} /><b>{p.name}<small><i className={p.connected ? 'online' : ''} />{p.id === pid ? 'Sen' : p.connected ? 'Oyunda' : 'Bağlantısı kesildi'}</small></b><strong>{p.score}</strong></div>) : <p className="empty-copy">İlk oyuncu bekleniyor.</p>}</div></section>
     <section className="viewer-list"><div className="column-heading"><h2><Users size={17} />İzleyiciler</h2><span>{state?.watchers?.length || 0}</span></div><div className="viewer-entries">{state?.watchers?.length ? state.watchers.map(viewer => <span key={viewer.id}><i />{viewer.name}</span>) : <p className="empty-copy">Henüz izleyici yok.</p>}</div></section>
     <div className="buzzer-area">
      <button className={`round-buzzer ${head?.id === pid ? 'has-mic' : ''}`} disabled={!canPress} onClick={() => void pressBuzzer()} aria-label={!isHost && !me ? 'Oyuna katıl ve bas' : 'BAS, söz hakkı al'}><Zap size={28} fill="currentColor" /><strong>BAS</strong><span>{head?.id === pid ? 'Söz sende' : state?.queue.some(entry => entry.id === pid) ? 'Sıradasın' : 'Söz hakkını al'}</span></button>
      <p className="buzzer-caption">{!connected ? 'Bağlantı kuruluyor…' : !isHost && !me ? 'Oynamak için bas ve ismini gir.' : head?.id === pid ? `${secs} saniyede cevabını söyle.` : state?.locked.includes(pid) ? 'Bu sorudaki hakkını kullandın.' : state?.queue.some(entry => entry.id === pid) ? 'Sıran gelince cevaplayacaksın.' : phase === 'lobby' ? 'Oyun başlayınca buton açılır.' : phase === 'countdown' ? 'Soru açılınca basabilirsin.' : ['resolved', 'final'].includes(phase) ? 'Yeni soruyu bekle.' : 'Dokun veya boşluk tuşuna bas.'}</p>
     </div>
    </aside>
   </main>
  </div>

  {modal && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}><div ref={modalElement} className={`modal ${modal === 'questions' ? 'editor-dialog' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close icon-button" onClick={() => setModal(null)} aria-label="Kapat"><X size={21} /></button>{modal !== 'questions' && <span className="modal-symbol">{modal === 'rules' ? <Gamepad2 size={28} /> : modal === 'new' ? <Sparkles size={28} /> : <Users size={28} />}</span>}
   {modal === 'questions' && isHost ? <section className="editor panel">
     <div className="editor-header"><div><h2 id="modal-title">Soru kütüphanesi <span className="badge">{bank.length} soru</span></h2><p>Oyun başladığında her harf için havuzdan bir soru çekilir. Tamamlanan çarkın soruları tekrar gelmez.</p></div><div className="editor-actions"><button className="button secondary" disabled={phase !== 'lobby'} onClick={() => void restoreDefaultPool()}>Hazır havuzu kullan</button><button className="button primary" disabled={phase !== 'lobby'} onClick={() => void storeBank()}><CheckCheck size={17} /> Seti kaydet</button></div></div>
     {phase !== 'lobby' && <div className="notice">Oyun başladı. Değişiklikleri kaydetmek için yeni bir oyun aç.</div>}
     <div className="editor-body"><div className="question-list"><input aria-label="Soru ara" placeholder="Soru veya harf ara…" value={search} onChange={e => setSearch(e.target.value)} />{bank.map((q, i) => (!search || `${q.letter} ${q.text}`.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))) && <button key={q.id} className={selected === i ? 'question-item selected' : 'question-item'} onClick={() => setSelected(i)}><span>{q.letter}</span><div><b>{q.answer}</b><small>{q.category}</small></div><ChevronRight size={15} /></button>)}<button className="button secondary" disabled={phase !== 'lobby' || bank.length >= 300} onClick={() => { const letter = bank[selected]?.letter || 'A'; setBank([...bank, { id: crypto.randomUUID(), letter, text: '', answer: '', explanation: '', category: 'Programlama', difficulty: 'Orta', points: 100, penalty: 25, multiplier: 1 }]); setSelected(bank.length); }}><Plus size={16} /> Soru ekle</button></div>
      {bank[selected] && <fieldset disabled={phase !== 'lobby'} className="question-form"><div className="form-row"><label>Harf<input maxLength={2} value={bank[selected].letter} onChange={e => update('letter', e.target.value.toLocaleUpperCase('tr'))} /></label><label>Kategori<input maxLength={60} value={bank[selected].category} onChange={e => update('category', e.target.value)} /></label><label>Zorluk<select value={bank[selected].difficulty} onChange={e => update('difficulty', e.target.value)}><option>Kolay</option><option>Orta</option><option>Zor</option></select></label></div><label>Soru<textarea rows={3} value={bank[selected].text} maxLength={1200} onChange={e => update('text', e.target.value)} /></label><label>Doğru cevap<input value={bank[selected].answer} maxLength={200} onChange={e => update('answer', e.target.value)} /></label><label>Cevap açıklaması<textarea rows={2} maxLength={1500} value={bank[selected].explanation} onChange={e => update('explanation', e.target.value)} /></label><label>Kod örneği <small>(isteğe bağlı)</small><textarea className="code-input" rows={3} maxLength={2000} value={bank[selected].code || ''} onChange={e => update('code', e.target.value)} /></label><div className="form-row">{([['points', 'Doğru puanı', 1, 1000], ['penalty', 'Yanlış cezası', 0, 1000], ['multiplier', 'Katsayı', 0.5, 5]] as const).map(([key, label, min, max]) => <label key={key}>{label}<input type="number" min={min} max={max} step={key === 'multiplier' ? 0.5 : 1} value={bank[selected][key]} onChange={e => update(key, Number(e.target.value))} /></label>)}</div><div className="editor-footer"><span className="green">+{Math.round(bank[selected].points * bank[selected].multiplier)} doğru</span><span className="red">−{Math.round(bank[selected].penalty * bank[selected].multiplier)} yanlış</span><button className="text-button red" disabled={bank.length === 1} onClick={() => { setBank(bank.filter((_, i) => i !== selected)); setSelected(Math.max(0, selected - 1)); }}>Soruyu sil</button></div></fieldset>}
     </div>
    </section> : modal === 'invite' ? <><span className="eyebrow">HERKES İÇİN BİR YER VAR</span><h2 id="modal-title">Ekibi bir araya getir.</h2><p>Bağlantıyı paylaş. Telefon veya bilgisayardan katılsınlar; kurulum gerekmiyor.</p><div className="invite-code"><span>ODA KODU</span><strong>{state?.code}</strong></div><label>Davet bağlantısı<input readOnly value={typeof location !== 'undefined' ? `${location.origin}/?room=${state?.code}` : ''} onFocus={e => e.target.select()} /></label><button className="button primary wide" onClick={() => void invite()}><Copy size={17} /> Bağlantıyı kopyala</button><button className="text-button modal-alt" onClick={() => { setJoinCode(''); setModal('join'); }}>Başka bir odaya katıl <ArrowRight size={15} /></button></> : modal === 'join' ? <><span className="eyebrow">SIRA SENDE</span><h2 id="modal-title">Sahneye hoş geldin.</h2><p>Oda kodunu ve adını yaz. İlk harfte görüşürüz.</p><form onSubmit={join}><label>Oda kodu<input autoFocus required minLength={6} maxLength={6} value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="ABCDEF" autoComplete="off" /></label><label>Oyundaki adın<input required maxLength={24} value={name} onChange={e => setName(e.target.value)} placeholder="Ekibin seni nasıl tanıyor?" autoComplete="nickname" /></label><button className="button primary wide" disabled={busy || !connected}>{busy ? <LoaderCircle className="spin" size={18} /> : <Zap size={18} />} Oyuna katıl</button></form></> : modal === 'new' ? <><span className="eyebrow">YENİ TUR, YENİ HEYECAN</span><h2 id="modal-title">Yeni bir oyun aç.</h2><p>Yeni oda kodu ve sıfır puanla başlarsınız. Kaydettiğin soru seti kullanılır. Mevcut oda, oyuncular için açık kalır.</p><button className="button primary wide" disabled={busy} onClick={() => void create()}><Plus size={18} /> Yeni oda oluştur</button><button className="button secondary wide" onClick={() => setModal(null)}>Oyuna dön</button></> : <><span className="eyebrow">KÜÇÜK BİR HATIRLATMA</span><h2 id="modal-title">Harf harf, zirveye.</h2><div className="rules"><div><span>1</span><p><b>Soruyu gör.</b> Üç saniyelik hazırlıktan sonra soru herkese açılır. Cevap, ekrandaki harfle başlar.</p></div><div><span>2</span><p><b>İlk sen bas.</b> Buzzer’a dokun veya boşluk tuşuna bas. Sıra, sunucuya ulaşan basışlara göre belirlenir.</p></div><div><span>3</span><p><b>{ANSWER_SECONDS} saniyede cevapla.</b> Cevabını sesli söyle. Sunucu değerlendirir. Doğruysa puan senin; yanlışta veya süre aşımında puan düşer, sıra sonraki oyuncuya geçer.</p></div></div><div className="notice">Her sorunun doğru puanı, yanlış cezası ve katsayısı farklı olabilir. Erken basarsan 1,5 saniye beklersin. Pas geçilen harf o turda tekrar sorulmaz.</div><button className="button primary wide" onClick={() => setModal(null)}>Hazırım, oyuna dön <ArrowRight size={17} /></button></>}
  </div></div>}
  {toast && <div className="toast" role="status"><span><Sparkles size={17} /></span>{toast}<button aria-label="Bildirimi kapat" onClick={() => setToast('')}><X size={15} /></button></div>}
 </div>;
}
