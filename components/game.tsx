'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ArrowRight, AudioLines, Check, CheckCheck, ChevronRight, CircleHelp, Copy, ExternalLink, Gamepad2, LoaderCircle, Plus, ShieldCheck, Sparkles, Trophy, Users, Volume2, VolumeX, X, Zap } from 'lucide-react';
import type { Choice, GameMode, GameState, Joker, Player, PrivateAnswer, Question, QuestionLanguage } from '@/lib/types';
import { ANSWER_SECONDS, MULTIPLE_CHOICE_SECONDS } from '@/lib/game-rules.mjs';
import { bankStorageKeys, savedBankForLanguage } from '@/lib/room-preferences.mjs';
import { questionMatchesSearch } from '@/lib/question-search.mjs';
import GameWheel from './game-wheel';
import ThemeToggle from './theme-toggle';

type Reply = { ok: boolean; error?: string; code?: string; token?: string; id?: string; name?: string; bank?: Question[]; mode?: GameMode; language?: QuestionLanguage; playerToken?: string; now?: number; questionId?: string; choiceId?: string; answer?: PrivateAnswer };
const jokers: { id: Joker; name: string; symbol: string; description: string }[] = [
 { id: 'fifty-fifty', name: 'Yarı yarıya', symbol: '50:50', description: 'İki seçenek kalır: biri doğru.' },
 { id: 'double-answer', name: 'Çift cevap', symbol: 'A+B', description: 'İki farklı seçenek seç. Biri doğruysa kazan.' },
 { id: 'shield', name: 'Kalkan', symbol: '✓', description: 'Yanlış cevaptan ve bombadan korun.' },
 { id: 'double-points', name: '×2 puan', symbol: '×2', description: 'Doğru cevabından iki kat puan kazan.' },
 { id: 'bomb', name: 'Bomba', symbol: '✹', description: 'Bomba kullananlar arasında ilk doğruyu ver; diğerleri ceza alsın.' },
];
const jokerName = (id: Joker) => jokers.find(joker => joker.id === id)?.name || '';
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
const preview = { letter: 'A', category: 'Web development', difficulty: 'Kolay', text: 'A weather app requests forecasts from another service through a documented interface. What three-letter term names that interface?', points: 100, penalty: 25, multiplier: 1 };
const read = (key: string) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
const save = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The game also works without browser storage. */ } };

function Avatar({ player, small = false }: { player: Pick<Player, 'name' | 'id'>; small?: boolean }) {
 const hue = [...player.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 5;
 return <span className={`avatar color-${hue} ${small ? 'small' : ''}`}>{player.name.slice(0, 2).toLocaleUpperCase('tr')}</span>;
}

export default function Game() {
 const socket = useRef<Socket | null>(null);
 const latestQuestion = useRef<{ code: string; questionId: string } | null>(null);
 const actionPending = useRef(false);
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
 const [newMode, setNewMode] = useState<GameMode>('buzzer');
 const [newLanguage, setNewLanguage] = useState<QuestionLanguage>('tr');
 const [savedAnswer, setSavedAnswer] = useState<PrivateAnswer | null>(null);
 const [submitting, setSubmitting] = useState(false);
 const notify = useCallback((message: string) => setToast(message), []);
 const send = useCallback((event: string, data: unknown = {}): Promise<Reply> => new Promise(resolve => {
  if (!socket.current?.connected) { notify('Bağlantı kuruluyor. Biraz sonra tekrar dene.'); resolve({ ok: false }); return; }
  socket.current.timeout(5000).emit(event, data, (error: Error | null, response: Reply) => {
   if (error) { notify('Sunucuya ulaşılamadı. Tekrar dene.'); resolve({ ok: false }); return; }
   if (!response.ok) notify(response.error || 'İşlem tamamlanamadı.');
   resolve(response);
  });
 }), [notify]);

 const create = useCallback(async (mode: GameMode, language: QuestionLanguage) => {
  setBusy(true);
  const bank = savedBankForLanguage(read, language);
  const result = await send('host:create', { bank, mode, language });
  if (result.ok) {
   save('vigola-host', { code: result.code, token: result.token }); setBank(result.bank || []);
   setRole('host'); setPid(''); setSavedAnswer(null); setSelected(0); setSearch(''); setModal(null);
   save('vigola-mode', mode);
   save('vigola-language', language);
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
    const showSetup = () => { setRole('host'); setNewMode(read('vigola-mode') === 'multiple-choice' ? 'multiple-choice' : 'buzzer'); setNewLanguage(read('vigola-language') === 'en' ? 'en' : 'tr'); setModal('new'); };
    if (saved) { const r = await send('host:resume', saved); if (r.ok) { setBank(r.bank || []); setNewMode(r.mode || 'buzzer'); setNewLanguage(r.language || 'en'); setRole('host'); if (r.id) setPid(r.id); } else showSetup(); }
    else showSetup();
   }
  });
  s.on('disconnect', () => setConnected(false));
  s.on('host:question', setPrivateQuestion);
  s.on('host:pool', setBank);
  s.on('player:answer', setSavedAnswer);
  s.on('state', (value: GameState) => { latestQuestion.current = { code: value.code, questionId: value.question.id }; setState(value); });
  s.connect();
  return () => { s.disconnect(); socket.current = null; };
 }, [send]);
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
   if (e.key === 'Escape' && (state || modal !== 'new')) setModal(null);
   if (e.key !== 'Tab' || !el) return;
   const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
   const firstItem = items[0]; const lastItem = items[items.length - 1];
   if (e.shiftKey && document.activeElement === firstItem) { e.preventDefault(); lastItem?.focus(); }
   if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); firstItem?.focus(); }
  };
  document.addEventListener('keydown', onKey);
  return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
 }, [modal, !!state]);

 const head = state?.players.find(p => p.id === state.queue[0]?.id);
 const phase = state?.phase || 'lobby';
 const isHost = role === 'host';
 const multipleChoice = state?.mode === 'multiple-choice';
 const revealed = phase === 'resolved' || phase === 'final';
 const bombResult = revealed ? state?.choiceResults.find(result => result.bombOutcome === 'winner') : undefined;
 const bombWinner = state?.players.find(player => player.id === bombResult?.id);
 const privateAnswer = savedAnswer?.code === state?.code && savedAnswer?.questionId === state?.question.id ? savedAnswer : null;
 const selectedChoices = privateAnswer?.choiceIds || [];
 const activeJoker = privateAnswer?.joker || null;
 const answerLimit = activeJoker === 'double-answer' ? 2 : 1;
 const submitted = !!pid && !!state?.submitted?.includes(pid);
 const me = state?.players.find(p => p.id === pid);
 const sorted = [...(state?.players || [])].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'tr'));
 const current = state?.question || preview;
 const hostQuestion = isHost && privateQuestion && privateQuestion.code === state?.code
  && privateQuestion.question.id === state?.question.id ? privateQuestion.question : undefined;
 const questionText = current.text || (isHost ? hostQuestion?.text || preview.text : 'Sunucu soruyu açtığında burada göreceksin.');
 const answerSeconds = multipleChoice ? MULTIPLE_CHOICE_SECONDS : ANSWER_SECONDS;
 const secs = state?.deadline != null ? Math.min(answerSeconds, Math.max(0, Math.ceil((state.deadline - now) / 1000))) : answerSeconds;
 const choiceExpired = multipleChoice && phase === 'open' && state?.deadline != null && now >= state.deadline;
 const countdown = state?.revealAt ? Math.max(1, Math.ceil((state.revealAt - now) / 1000)) : 3;
 const canBuzz = !multipleChoice && connected && !!me && ['open', 'answering'].includes(phase) && !state?.locked.includes(pid) && !state?.queue.some(b => b.id === pid) && !state?.pending;
 const judge = useCallback((correct: boolean) => send('host:judge', { correct, playerId: head?.id, questionId: state?.question.id }), [send, head?.id, state?.question.id]);
 const canPress = !multipleChoice && connected && (isHost ? me ? canBuzz : ['open', 'answering'].includes(phase) && !state?.pending : me ? canBuzz : !!state);
 const revealAnswers = useCallback(() => send('host:reveal', { questionId: state?.question.id }), [send, state?.question.id]);
 const answerComplete = selectedChoices.length >= answerLimit || (submitted && !privateAnswer);
 const chooseAnswer = async (choiceId: string) => {
  if (isHost || !state || actionPending.current || answerComplete || selectedChoices.includes(choiceId) || privateAnswer?.eliminatedChoiceIds.includes(choiceId) || phase !== 'open' || choiceExpired) return;
  if (!me) { setJoinCode(state.code); setModal('join'); return; }
  if (!privateAnswer) return;
  const { code, question: { id: questionId } } = state;
  actionPending.current = true; setSubmitting(true);
  const result = await send('answer', { questionId, choiceId });
  if (result.ok && result.answer && latestQuestion.current?.code === code && latestQuestion.current?.questionId === questionId) setSavedAnswer(result.answer);
  actionPending.current = false; setSubmitting(false);
 };
 const useJoker = async (joker: Joker) => {
  if (isHost || !state || !me || !privateAnswer || actionPending.current || activeJoker || submitted || selectedChoices.length || phase !== 'open' || choiceExpired || !privateAnswer.availableJokers.includes(joker)) return;
  if (joker === 'fifty-fifty' && (state.question.choices?.length || 0) <= 2) return;
  const { code, question: { id: questionId } } = state;
  actionPending.current = true; setSubmitting(true);
  const result = await send('joker', { questionId, joker });
  if (result.ok && result.answer && latestQuestion.current?.code === code && latestQuestion.current?.questionId === questionId) setSavedAnswer(result.answer);
  actionPending.current = false; setSubmitting(false);
 };
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
    if (e.code === 'ArrowRight' && !e.repeat) {
     if (multipleChoice && phase === 'open') void revealAnswers();
     else if (['lobby', 'resolved'].includes(phase)) void send('host:start');
    }
    if (!multipleChoice && phase === 'answering' && e.key.toLowerCase() === 'd') void judge(true);
    if (!multipleChoice && phase === 'answering' && e.key.toLowerCase() === 'y') void judge(false);
   }
  };
  window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
 }, [modal, isHost, canPress, pressBuzzer, send, judge, phase, multipleChoice, revealAnswers]);

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
 const update = (key: keyof Question, value: string | number) => setBank(b => b.map((q, i) => i === selected ? { ...q, [key]: value, ...(key === 'answer' ? { choices: q.choices?.map(choice => choice.id === q.choices?.find(option => option.text === q.answer)?.id ? { ...choice, text: String(value) } : choice) } : {}) } : q));
 const updateChoice = (id: string, changes: Partial<Choice>) => setBank(b => b.map((q, i) => i === selected ? { ...q, ...(changes.text !== undefined && q.choices?.find(choice => choice.id === id)?.text === q.answer ? { answer: changes.text } : {}), choices: q.choices?.map(choice => choice.id === id ? { ...choice, ...changes } : choice) } : q));
 const setCorrectChoice = (id: string) => setBank(b => b.map((q, i) => {
  const choice = q.choices?.find(option => option.id === id);
  return i === selected && choice ? { ...q, answer: choice.text, choices: q.choices?.map(option => option.id === id || option.text === q.answer ? { ...option, weight: undefined } : option) } : q;
 }));
 const addChoices = () => setBank(b => b.map((q, i) => i === selected ? { ...q, choices: [q.answer, '', '', ''].map(text => ({ id: crypto.randomUUID(), text })) } : q));
 const storeBank = async () => {
  const r = await send('host:bank', { bank });
  if (r.ok && r.bank) {
   setBank(r.bank);
   const keys = bankStorageKeys(state?.language || 'en');
   save(keys.bank, r.bank);
   save(keys.useDefault, false);
   notify('Soru havuzu kaydedildi.');
  }
 };
 const restoreDefaultPool = async () => {
  const result = await send('host:bank', { bank: null });
  if (!result.ok || !result.bank) return;
  setBank(result.bank);
  setSelected(0);
  setSearch('');
  save(bankStorageKeys(state?.language || 'en').useDefault, true);
  notify('Hazır soru havuzu seçildi.');
 };
 const liveLetters = state?.letters || letters;

 return <div className={`app-shell ${isHost ? 'host-view' : 'player-view'} ${multipleChoice ? 'multiple-choice-mode' : ''}`}>
  <div className="workspace" inert={!!modal}>
   <header className="game-header">
    <div className="wordmark">vigola<span>.</span></div>
    <div className="header-room"><span className={`connection-dot ${connected ? 'online' : ''}`} /><span>{connected ? 'Oda' : 'Bağlanıyor'}</span><b>{state?.code || '••••••'}</b>{state && <span className="room-language" title="Soru dili">{state.language === 'tr' ? 'TR' : 'EN'}</span>}</div>
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
       <h2 lang={state?.language || 'tr'}>{phase === 'lobby' ? 'Ekibin hazır mı?' : phase === 'countdown' ? 'Sıradaki soru geliyor…' : questionText}</h2>
       {phase === 'lobby' && <p className="game-message">{isHost ? 'Oyuncuları davet et, ardından oyunu başlat.' : multipleChoice ? `${MULTIPLE_CHOICE_SECONDS} saniyede seçimini yap. Beş jokerin hazır; hızlı doğru cevap daha çok puan.` : 'Soruyu gör, ilk sen bas, cevabı sesli söyle.'}</p>}
       {!['lobby', 'countdown'].includes(phase) && <><div className="question-stakes">{multipleChoice && <span className="muted">En çok:</span>}<span className="green">+{Math.round(current.points * current.multiplier)} doğru{multipleChoice ? ' · hızına göre, tek cevapta ×2' : ''}</span><span className="red">−{Math.round(current.penalty * current.multiplier)} yanlış</span></div>{state?.question.code && <pre className="code-sample"><code>{state.question.code}</code></pre>}</>}
       {multipleChoice && !isHost && me && <section className="joker-tray" aria-label="Kişisel jokerlerin">
        <div className="joker-heading"><h3><Sparkles size={16} />Jokerlerin</h3><span>{privateAnswer ? `${privateAnswer.availableJokers.length} / ${jokers.length} kaldı` : 'Hazırlanıyor…'}</span></div>
        <div className="joker-buttons">{jokers.map(joker => {
         const active = activeJoker === joker.id;
         const available = !!privateAnswer?.availableJokers.includes(joker.id);
         const tooFewChoices = joker.id === 'fifty-fifty' && phase === 'open' && (state?.question.choices?.length || 0) <= 2;
         const disabled = !connected || !privateAnswer || phase !== 'open' || choiceExpired || submitting || !!activeJoker || submitted || !!selectedChoices.length || !available || tooFewChoices;
         const label = !privateAnswer ? 'Hazırlanıyor' : active ? revealed ? 'Bu soruda kullanıldı' : 'Aktif' : !available ? 'Kullanıldı' : tooFewChoices ? 'İki seçenek var' : '1 kullanım';
         return <button key={joker.id} type="button" className={`joker-button ${joker.id === 'bomb' ? 'bomb-joker' : ''} ${active ? 'active' : ''} ${!available && privateAnswer && !active ? 'spent' : ''}`} disabled={disabled} aria-pressed={active} aria-label={`${joker.name}: ${joker.description} ${label}`} onClick={() => void useJoker(joker.id)}><span className="joker-symbol" aria-hidden="true">{joker.symbol}</span><b>{joker.name}</b><small>{label}</small><span className="joker-description">{joker.description}</span></button>;
        })}</div>
        <p>Her joker oyun boyunca bir kez. Cevaplamadan önce, soru başına bir joker seç.</p>
        {activeJoker && phase === 'open' && <p className="active-joker-note" role="status">{choiceExpired ? 'Cevap alımı kapandı. Sonuçlar açılıyor…' : activeJoker === 'fifty-fifty' ? 'Yarı yarıya aktif. Elenen seçenekleri yalnız sen görürsün.' : activeJoker === 'double-answer' ? selectedChoices.length === 2 ? 'İki seçimin de kaydedildi. Sonuçları bekle.' : selectedChoices.length === 1 ? 'İlk seçimin kaydedildi. İstersen ikinci bir seçenek daha seçebilirsin.' : 'Çift cevap aktif. Süre dolmadan iki farklı seçenek seçebilirsin.' : activeJoker === 'double-points' ? '×2 puan aktif. Doğru cevabının puanı ikiye katlanır; tek cevap bonusuyla ×4 olur.' : activeJoker === 'bomb' ? 'Bomba aktif. Bomba kullananlar arasında ilk doğru cevap kazanır; diğer oyuncular soru cezasını alır. Kalkan korur.' : 'Kalkan aktif. Yanlış cevap ve bomba cezasından korunuyorsun; bomba patlarsa bu sorudan 0 puan alırsın.'}</p>}
       </section>}
       {multipleChoice && !['lobby', 'countdown'].includes(phase) && <section className="answer-options" aria-label="Cevap seçenekleri">
        <div className="answer-options-heading"><b>{activeJoker === 'double-answer' ? `İki seçenek seç · ${selectedChoices.length} / 2` : 'Bir seçenek seç'}</b><span>{state?.submitted.length || 0} / {state?.players.length || 0} cevapladı</span></div>
        {state?.question.choices?.map((choice, index) => {
         const correct = revealed && choice.text === state.question.answer;
         const picked = selectedChoices.includes(choice.id);
         const eliminated = !revealed && !!privateAnswer?.eliminatedChoiceIds.includes(choice.id);
         return <button key={choice.id} className={`answer-option ${picked ? 'selected' : ''} ${eliminated ? 'eliminated' : ''} ${correct ? 'is-correct' : revealed && picked ? 'is-wrong' : ''}`} disabled={!connected || isHost || phase !== 'open' || choiceExpired || (!!me && !privateAnswer) || answerComplete || picked || eliminated || submitting} aria-pressed={picked} aria-label={eliminated ? `${String.fromCharCode(65 + index)}: ${choice.text}, jokerle elendi` : undefined} onClick={() => void chooseAnswer(choice.id)}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{choice.text}{eliminated && <small className="eliminated-label">Jokerle elendi</small>}</span>{revealed && <small className="option-score">{(() => { const weight = choice.weight ?? (correct ? state.question.points : -state.question.penalty); const delta = Math.sign(weight) * Math.round(Math.abs(weight) * state.question.multiplier); return `${correct ? 'En çok ' : ''}${delta > 0 ? '+' : ''}${delta}`; })()}</small>}{correct ? <Check size={20} aria-label="Doğru cevap" /> : revealed && picked ? <X size={20} aria-label="Yanlış cevap" /> : picked ? <Check size={18} aria-label="Seçimin" /> : null}</button>;
        })}
        <p role="status">{isHost ? revealed ? 'Sonuçlar açık; sonraki soruya geçebilirsin.' : choiceExpired ? 'Cevap alımı kapandı. Sonuçlar açılıyor…' : `Cevaplar ${MULTIPLE_CHOICE_SECONDS} saniyede, herkes tamamlayınca veya bomba patlayınca açılır; Next ile de açabilirsin.` : revealed ? 'Cevaplar açıldı. Sonuçları aşağıda görebilirsin.' : submitting ? 'İşlemin kaydediliyor…' : choiceExpired ? 'Cevap alımı kapandı. Sonuçlar açılıyor…' : activeJoker === 'double-answer' && selectedChoices.length === 1 ? 'İlk seçimin kaydedildi. Süre dolmadan ikinci bir seçenek seçebilirsin.' : answerComplete ? 'Cevabın ve cevap süren kaydedildi. Sonuçları bekle.' : !me ? 'Bir seçenek seçerek oyuna katıl.' : 'Hızlı doğru cevap daha çok puan kazandırır. Tek cevap veren sen olursan ve doğru bilirsen puanın ×2 olur.'}</p>
       </section>}
       {multipleChoice && revealed && <section className="choice-results" aria-label="Soru sonuçları"><h3>Bu sorunun sonuçları</h3>{bombResult && <p className="bomb-notice" role="status"><b><Zap size={16} />{bombWinner?.name || 'Oyuncu'} bombayı patlattı!</b><span>Kazanan dışındaki oyunculara, cevapları doğru olsa veya cevap vermemiş olsalar bile −{Math.round(current.penalty * current.multiplier)} puan uygulandı. Önceden Kalkan açanlar bu sorudan 0 puan aldı.</span></p>}{state?.choiceResults.map(result => {
        const player = state.players.find(p => p.id === result.id);
        const choiceIds = result.choiceIds || (result.choiceId ? [result.choiceId] : []);
        const choices = choiceIds.map(id => state.question.choices?.find(option => option.id === id)?.text).filter(Boolean);
        const bombHit = result.bombOutcome === 'hit';
        const bombShielded = result.bombOutcome === 'shielded';
        const bombLabel = result.bombOutcome === 'winner' ? 'Bomba kazandı' : bombHit ? 'Bombadan etkilendi' : bombShielded ? 'Kalkan korudu' : '';
        const resultClass = bombHit ? 'is-wrong bomb-hit' : bombShielded ? 'bomb-shielded' : result.correct === null ? 'unanswered' : result.correct ? 'is-correct' : 'is-wrong';
        return <div key={result.id} className={resultClass}><span aria-label={bombLabel || undefined}>{bombHit ? '✹' : bombShielded ? '◇' : result.correct === null ? '—' : result.correct ? '✓' : '✕'}</span><div><b>{player?.name || 'Oyuncu'}{result.id === pid ? ' (Sen)' : ''}</b><small>{choices.join(' / ') || 'Cevap vermedi'}{result.elapsedMs !== undefined && ` · ${(result.elapsedMs / 1000).toFixed(2)} sn`}</small>{(bombHit || bombShielded) && result.correct !== null && <small>{result.correct ? 'Doğru seçim' : 'Yanlış seçim'} · {bombShielded ? 'Kalkan sayesinde 0 puan' : 'normal puan yerine bomba cezası'}</small>}{(result.joker || result.soloBonus || result.bombOutcome) && <div className="result-badges">{result.joker && <span>{jokerName(result.joker)}</span>}{result.soloBonus && <span className="solo-bonus">Tek cevap · ×2</span>}{result.bombOutcome && <span className={`bomb-outcome ${result.bombOutcome}`}>{bombLabel}</span>}</div>}</div><strong>{result.delta > 0 ? '+' : ''}{result.delta}</strong></div>;
       })}{!state?.choiceResults.length && <p className="empty-copy">Bu soruya katılan oyuncu yok.</p>}</section>}
       {isHost && hostQuestion ? <div className="host-solution"><span><ShieldCheck size={14} />YALNIZCA SUNUCU GÖRÜR</span><strong>{hostQuestion.answer}</strong><p lang={state?.language || 'en'}>{hostQuestion.explanation}</p></div> : state?.question.answer && <div className="revealed-solution"><span><Check size={16} />Doğru cevap</span><strong>{state.question.answer}</strong><p lang={state.language}>{state.question.explanation}</p></div>}
      </article>
      {!!state?.completed?.filter(entry => entry.index !== state.index).length && <h3 className="past-heading">Önceki sorular</h3>}
      {[...(state?.completed || [])].filter(entry => entry.index !== state?.index).reverse().map(entry => <article className="past-question" key={entry.index}><div><span className="question-letter">{entry.letter}</span><b>{entry.answer}</b><span className={entry.status === 'correct' ? 'green' : 'muted'}>{entry.status === 'correct' ? 'Bilindi' : multipleChoice ? 'Doğru yok' : 'Pas'}</span></div><p lang={state?.language || 'en'}>{entry.text}</p></article>)}
     </div>
     {isHost && multipleChoice && <div className="host-controls" aria-label="Sunucu oyun kontrolleri"><p className="control-hint">{phase === 'open' ? `${state?.submitted.length || 0} oyuncu cevapladı. Sonuçlar ${MULTIPLE_CHOICE_SECONDS} saniyede, herkes tamamlayınca veya bomba patlayınca açılır; Next ile de açabilirsin.` : revealed ? 'Sonuçlar açık. Hazır olduğunda devam et.' : 'Herkes aynı soruyu cevaplar.'}</p><button className="button primary" disabled={!connected || busy || phase === 'countdown'} onClick={() => phase === 'final' ? setModal('new') : phase === 'open' ? void revealAnswers() : void send('host:start')}>{phase === 'lobby' ? 'Oyunu başlat' : phase === 'open' ? 'Next · Cevapları göster' : phase === 'countdown' ? 'Soru hazırlanıyor…' : phase === 'final' ? 'Yeni tur' : state?.index === (state?.total || 0) - 1 ? 'Sonuçlar' : 'Sonraki soru'}<ArrowRight size={18} /></button></div>}
     {isHost && !multipleChoice && <div className="host-controls" aria-label="Sunucu oyun kontrolleri">
      <div className="judge-row"><button className="button correct-button" disabled={!connected || phase !== 'answering'} onClick={() => void judge(true)}><Check size={22} />Doğru<kbd>D</kbd></button><button className="button wrong-button" disabled={!connected || phase !== 'answering'} onClick={() => void judge(false)}><X size={22} />Yanlış<kbd>Y</kbd></button></div>
      <div className="advance-row"><button className="button secondary" disabled={!connected || !['open', 'answering'].includes(phase)} onClick={() => void send('host:pass')}>Pas geç<ChevronRight size={18} /></button><button className="button primary" disabled={!connected || !['lobby', 'resolved', 'final'].includes(phase)} onClick={() => phase === 'final' ? setModal('new') : void send('host:start')}>{phase === 'lobby' ? 'Oyunu başlat' : phase === 'final' ? 'Yeni tur' : state?.index === (state?.total || 0) - 1 ? 'Sonuçlar' : 'Sonraki harf'}<ArrowRight size={18} /></button></div>
     </div>}
    </section>

    <section className="wheel-column" aria-label="Oyun alanı">
     <div className="stage-top"><span>{multipleChoice ? 'ÇOKTAN SEÇMELİ' : 'YAZILIM PASSAPAROLASI'}</span><span className={`round-status ${phase}`}><i />{phase === 'lobby' ? 'Lobi' : phase === 'countdown' ? 'Hazır ol' : phase === 'answering' ? 'Cevap zamanı' : phase === 'resolved' ? 'Tamamlandı' : phase === 'final' ? 'Final' : multipleChoice ? 'Cevaplar alınıyor' : 'Buzzer açık'}</span></div>
     {phase === 'final' ? <div className="final-stage"><Trophy className="final-trophy" size={48} /><h2>{sorted.length ? `${sorted[0].name} kazandı!` : 'Oyun tamamlandı'}</h2><p className="game-message">Her harfte biraz daha öğrendik.</p><div className="podium">{sorted.slice(0, 3).map((p, i) => <div className={`podium-place place-${i}`} key={p.id}><Avatar player={p} /><b>{p.name}</b><span>{p.score} puan</span><div>{i + 1}</div></div>)}</div></div> : <GameWheel letters={liveLetters} letter={current.letter} history={state?.history || []} phase={phase} seconds={secs} countdown={countdown} multipleChoice={multipleChoice} />}
     <div className="turn-status" role="status" aria-live="polite">
      {multipleChoice ? phase === 'lobby' ? 'Herkes hazırsa başlayalım.' : phase === 'countdown' ? 'Soruyu okumaya hazırlan.' : phase === 'final' ? 'Alkışlar bütün ekibe!' : revealed ? 'Cevaplar ve puanlar açık.' : activeJoker === 'double-answer' && selectedChoices.length === 1 && !choiceExpired ? 'İkinci seçimini yapabilirsin.' : submitted ? 'Cevabın kaydedildi.' : 'Seçimini yap.' : phase === 'answering' ? <><AudioLines size={22} /><b>{head?.id === pid ? 'Söz sende!' : `${head?.name || 'Oyuncu'} cevaplıyor`}</b></> : phase === 'countdown' ? 'Parmaklar butonlarda…' : phase === 'lobby' ? 'Herkes hazırsa başlayalım.' : phase === 'resolved' ? state?.result?.correct ? `${state.players.find(p => p.id === state.result?.id)?.name || 'Oyuncu'} doğru bildi!` : 'Bu harfi pas geçtik.' : phase === 'final' ? 'Alkışlar bütün ekibe!' : state?.pending ? 'İlk basan belirleniyor…' : 'Biliyorsan, bas!'}
     </div>
     {multipleChoice && <div className="buzz-queue submission-summary"><div className="queue-title"><CheckCheck size={16} /><h2>Cevap durumu</h2><span>{state?.submitted.length || 0} / {state?.players.length || 0}</span></div><div className="submission-players">{state?.players.map(player => <span key={player.id} className={state.submitted.includes(player.id) ? 'has-answered' : ''}>{state.submitted.includes(player.id) ? '✓' : '·'} {player.name}</span>)}</div><p>{revealed ? 'Puan tablosu güncellendi.' : 'Seçimler herkes tamamlayınca, süre dolunca, bomba patlayınca veya Next ile görünür.'}</p></div>}
     {!multipleChoice && <div className="buzz-queue"><div className="queue-title"><Zap size={16} /><h2>Basış sırası</h2><span>{state?.queue.length || 0}</span></div>{state?.queue.length ? <div className="queue-entries">{state.queue.map((entry, index) => { const p = state.players.find(p => p.id === entry.id); return p && <div className={index === 0 ? 'on-mic' : ''} key={entry.id}><span>{index + 1}</span><Avatar player={p} small /><b>{p.name}</b><small>{index === 0 ? 'Cevaplıyor' : 'Bekliyor'}</small></div>; })}</div> : <p>{state?.pending ? 'Basışlar alınıyor…' : 'Henüz basan yok.'}</p>}</div>}

    </section>

    <aside className="people-column board-panel" aria-label="Puanlar, izleyiciler ve buzzer">
     <section className="leaderboard"><div className="column-heading"><h2><Trophy size={18} />Puan tablosu</h2><span>{sorted.length} oyuncu</span></div><div className="score-list">{sorted.length ? sorted.map((p, index) => <div key={p.id} className={p.id === pid ? 'is-me' : ''}><span className="rank">{index + 1}</span><Avatar player={p} /><b>{p.name}<small><i className={p.connected ? 'online' : ''} />{p.id === pid ? 'Sen' : p.connected ? 'Oyunda' : 'Bağlantısı kesildi'}</small></b><strong>{p.score}</strong></div>) : <p className="empty-copy">İlk oyuncu bekleniyor.</p>}</div></section>
     <section className="viewer-list"><div className="column-heading"><h2><Users size={17} />İzleyiciler</h2><span>{state?.watchers?.length || 0}</span></div><div className="viewer-entries">{state?.watchers?.length ? state.watchers.map(viewer => <span key={viewer.id}><i />{viewer.name}</span>) : <p className="empty-copy">Henüz izleyici yok.</p>}</div></section>
     {!multipleChoice && <div className="buzzer-area">
      <button className={`round-buzzer ${head?.id === pid ? 'has-mic' : ''}`} disabled={!canPress} onClick={() => void pressBuzzer()} aria-label={!isHost && !me ? 'Oyuna katıl ve bas' : 'BAS, söz hakkı al'}><Zap size={28} fill="currentColor" /><strong>BAS</strong><span>{head?.id === pid ? 'Söz sende' : state?.queue.some(entry => entry.id === pid) ? 'Sıradasın' : 'Söz hakkını al'}</span></button>
      <p className="buzzer-caption">{!connected ? 'Bağlantı kuruluyor…' : !isHost && !me ? 'Oynamak için bas ve ismini gir.' : head?.id === pid ? `${secs} saniyede cevabını söyle.` : state?.locked.includes(pid) ? 'Bu sorudaki hakkını kullandın.' : state?.queue.some(entry => entry.id === pid) ? 'Sıran gelince cevaplayacaksın.' : phase === 'lobby' ? 'Oyun başlayınca buton açılır.' : phase === 'countdown' ? 'Soru açılınca basabilirsin.' : ['resolved', 'final'].includes(phase) ? 'Yeni soruyu bekle.' : 'Dokun veya boşluk tuşuna bas.'}</p>
     </div>}
    </aside>
   </main>
  </div>

  {modal && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget && (state || modal !== 'new')) setModal(null); }}><div ref={modalElement} className={`modal ${modal === 'questions' ? 'editor-dialog' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">{(state || modal !== 'new') && <button className="modal-close icon-button" onClick={() => setModal(null)} aria-label="Kapat"><X size={21} /></button>}{modal !== 'questions' && <span className="modal-symbol">{modal === 'rules' ? <Gamepad2 size={28} /> : modal === 'new' ? <Sparkles size={28} /> : <Users size={28} />}</span>}
   {modal === 'questions' && isHost ? <section className="editor panel">
     <div className="editor-header"><div><h2 id="modal-title">Soru kütüphanesi <span className="badge">{bank.length} soru</span></h2><p>{state?.language === 'tr' ? 'Türkçe' : 'English'} soru seti. Her harften bir soru seçilir. Tamamlanan sorular dil değiştirince de tekrar gelmez.</p></div><div className="editor-actions"><button className="button secondary" disabled={phase !== 'lobby'} onClick={() => void restoreDefaultPool()}>Hazır havuzu kullan</button><button className="button primary" disabled={phase !== 'lobby'} onClick={() => void storeBank()}><CheckCheck size={17} /> Seti kaydet</button></div></div>
     {phase !== 'lobby' && <div className="notice">Oyun başladı. Değişiklikleri kaydetmek için yeni bir oyun aç.</div>}
     <div className="editor-body"><div className="question-list"><input aria-label="Soru ara" placeholder="Soru veya harf ara…" value={search} onChange={e => setSearch(e.target.value)} />{bank.map((q, i) => (!search || questionMatchesSearch(q, search)) && <button key={q.id} className={selected === i ? 'question-item selected' : 'question-item'} onClick={() => setSelected(i)}><span>{q.letter}</span><div><b>{q.answer}</b><small>{q.category}</small></div><ChevronRight size={15} /></button>)}<button className="button secondary" disabled={phase !== 'lobby' || bank.length >= 300} onClick={() => { const letter = bank[selected]?.letter || 'A'; setBank([...bank, { id: crypto.randomUUID(), letter, text: '', answer: '', explanation: '', category: 'Programlama', difficulty: 'Orta', points: 100, penalty: 25, multiplier: 1 }]); setSelected(bank.length); }}><Plus size={16} /> Soru ekle</button></div>
      {bank[selected] && <fieldset disabled={phase !== 'lobby'} className="question-form"><div className="form-row"><label>Harf<input maxLength={2} value={bank[selected].letter} onChange={e => update('letter', e.target.value.toUpperCase())} /></label><label>Kategori<input maxLength={60} value={bank[selected].category} onChange={e => update('category', e.target.value)} /></label><label>Zorluk<select value={bank[selected].difficulty} onChange={e => update('difficulty', e.target.value)}><option>Kolay</option><option>Orta</option><option>Zor</option></select></label></div><label>Soru<textarea rows={3} value={bank[selected].text} maxLength={1200} onChange={e => update('text', e.target.value)} /></label><label>Doğru cevap<input value={bank[selected].answer} maxLength={200} onChange={e => update('answer', e.target.value)} /></label><label>Cevap açıklaması<textarea rows={2} maxLength={1500} value={bank[selected].explanation} onChange={e => update('explanation', e.target.value)} /></label>{(multipleChoice || bank[selected].choices) && <section className="choice-editor"><div className="choice-editor-heading"><h3>Seçenekler ve ağırlıklar</h3>{!bank[selected].choices?.length && <button type="button" className="button secondary" onClick={addChoices}>Dört seçenek ekle</button>}</div><p>Doğru seçeneği işaretle. Boş bırakılan ağırlık doğru puanını veya yanlış cezasını kullanır; her ağırlık katsayıyla çarpılır. Doğru puanı cevap süresine göre %100’den %50’ye azalır.</p>{bank[selected].choices?.map((choice, index) => {
       const correct = choice.text === bank[selected].answer;
       return <div className="choice-editor-row" key={choice.id}><label className="choice-correct"><input type="radio" name={`correct-${bank[selected].id}`} checked={correct} onChange={() => setCorrectChoice(choice.id)} aria-label={`${String.fromCharCode(65 + index)} doğru cevap`} /><span>{String.fromCharCode(65 + index)}</span></label><label>Seçenek<input maxLength={200} value={choice.text} onChange={e => updateChoice(choice.id, { text: e.target.value })} /></label><label>{correct ? 'Doğru ağırlığı' : 'Yanlış ağırlığı'}<input type="number" min={correct ? 0 : -1000} max={correct ? 1000 : 0} placeholder={String(correct ? bank[selected].points : -bank[selected].penalty)} value={choice.weight ?? ''} onChange={e => updateChoice(choice.id, { weight: e.target.value === '' ? undefined : Number(e.target.value) })} /></label></div>;
      })}</section>}<label>Kod örneği <small>(isteğe bağlı)</small><textarea className="code-input" rows={3} maxLength={2000} value={bank[selected].code || ''} onChange={e => update('code', e.target.value)} /></label><div className="form-row">{([['points', 'Doğru puanı', 1, 1000], ['penalty', 'Yanlış cezası', 0, 1000], ['multiplier', 'Katsayı', 0.5, 5]] as const).map(([key, label, min, max]) => <label key={key}>{label}<input type="number" min={min} max={max} step={key === 'multiplier' ? 0.5 : 1} value={bank[selected][key]} onChange={e => update(key, Number(e.target.value))} /></label>)}</div><div className="editor-footer"><span className="green">+{Math.round(bank[selected].points * bank[selected].multiplier)} doğru</span><span className="red">−{Math.round(bank[selected].penalty * bank[selected].multiplier)} yanlış</span><button className="text-button red" disabled={bank.length === 1} onClick={() => { setBank(bank.filter((_, i) => i !== selected)); setSelected(Math.max(0, selected - 1)); }}>Soruyu sil</button></div></fieldset>}
     </div>
    </section> : modal === 'invite' ? <><span className="eyebrow">HERKES İÇİN BİR YER VAR</span><h2 id="modal-title">Ekibi bir araya getir.</h2><p>Bağlantıyı paylaş. Telefon veya bilgisayardan katılsınlar; kurulum gerekmiyor.</p><p className="language-note">Soru dili: {state?.language === 'tr' ? 'Türkçe' : 'English'}</p><div className="invite-code"><span>ODA KODU</span><strong>{state?.code}</strong></div><label>Davet bağlantısı<input readOnly value={typeof location !== 'undefined' ? `${location.origin}/?room=${state?.code}` : ''} onFocus={e => e.target.select()} /></label><button className="button primary wide" onClick={() => void invite()}><Copy size={17} /> Bağlantıyı kopyala</button><button className="text-button modal-alt" onClick={() => { setJoinCode(''); setModal('join'); }}>Başka bir odaya katıl <ArrowRight size={15} /></button></> : modal === 'join' ? <><span className="eyebrow">SIRA SENDE</span><h2 id="modal-title">Sahneye hoş geldin.</h2><p>Oda kodunu ve adını yaz. İlk harfte görüşürüz.</p><form onSubmit={join}><label>Oda kodu<input autoFocus required minLength={6} maxLength={6} value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="ABCDEF" autoComplete="off" /></label><label>Oyundaki adın<input required maxLength={24} value={name} onChange={e => setName(e.target.value)} placeholder="Ekibin seni nasıl tanıyor?" autoComplete="nickname" /></label><button className="button primary wide" disabled={busy || !connected}>{busy ? <LoaderCircle className="spin" size={18} /> : <Zap size={18} />} Oyuna katıl</button></form></> : modal === 'new' ? <><span className="eyebrow">OYUNU SEN KUR</span><h2 id="modal-title">Nasıl oynayalım?</h2><p>Oyun modunu ve soru dilini seç. O dilde kaydettiğin set, yoksa hazır soru havuzu kullanılır.</p><fieldset className="mode-picker"><legend>Oyun modu</legend>{([{ value: 'buzzer', title: 'Buzzer · Sözlü cevap', description: 'İlk basan cevaplar. Sunucu doğru veya yanlış kararını verir.' }, { value: 'multiple-choice', title: 'Çoktan seçmeli', description: `${MULTIPLE_CHOICE_SECONDS} saniye, beş kişisel joker. Hızlı doğru cevap daha çok puan; tek cevap doğruysa ×2.` }] as const).map(mode => <label key={mode.value} className={newMode === mode.value ? 'selected' : ''}><input type="radio" name="game-mode" value={mode.value} checked={newMode === mode.value} onChange={() => setNewMode(mode.value)} /><span><b>{mode.title}</b><small>{mode.description}</small></span></label>)}</fieldset><fieldset className="language-picker"><legend>Soru dili</legend>{([{ value: 'tr', title: 'Türkçe', detail: 'Doğal Türkçe, yerleşik teknik terimler korunur.' }, { value: 'en', title: 'English', detail: 'Questions and explanations in English.' }] as const).map(language => <label key={language.value} className={newLanguage === language.value ? 'selected' : ''} lang={language.value}><input type="radio" name="question-language" value={language.value} checked={newLanguage === language.value} onChange={() => setNewLanguage(language.value)} /><span><b>{language.title}</b><small>{language.detail}</small></span></label>)}</fieldset><p className="language-note">Soru dili iki oyun modunda da geçerlidir. Teknik cevaplar ve seçenekler özgün adlarıyla kalır.</p><button className="button primary wide" disabled={busy || !connected} onClick={() => void create(newMode, newLanguage)}>{busy ? <LoaderCircle className="spin" size={18} /> : <Plus size={18} />} Yeni oda oluştur</button>{state && <button className="button secondary wide" onClick={() => setModal(null)}>Oyuna dön</button>}<button className="text-button modal-alt" onClick={() => setModal('join')}>Oda koduyla katıl <ArrowRight size={15} /></button></> : <><span className="eyebrow">KÜÇÜK BİR HATIRLATMA</span><h2 id="modal-title">Harf harf, zirveye.</h2>{multipleChoice ? <div className="rules"><div><span>1</span><p><b>Soruyu oku.</b> Üç saniyelik hazırlıktan sonra soru ve seçenekler açılır.</p></div><div><span>2</span><p><b>{MULTIPLE_CHOICE_SECONDS} saniyede seç.</b> Herkes aynı anda cevaplayabilir. Kaydedilen cevap değiştirilemez; herkes cevaplarını tamamlayınca veya süre dolunca sonuçlar otomatik açılır.</p></div><div><span>3</span><p><b>Hızlı doğru cevap, daha çok puan.</b> Doğru puanı süre geçtikçe %100’den %50’ye iner. Örneğin 100 puanlık soruda 3 saniyede 90, 7,5 saniyede 75 puan kazanırsın. Soruda yalnız sen cevap verip doğru bilirsen kazandığın puan ×2 olur. Yanlış cezası sabittir. Bomba patlarsa kazanan dışındaki herkese, cevap vermemiş olsa bile soru cezası uygulanır; önceden Kalkan açanlar 0 puan alır.</p></div></div> : <div className="rules"><div><span>1</span><p><b>Soruyu gör.</b> Üç saniyelik hazırlıktan sonra soru herkese açılır. Cevap, ekrandaki harfle başlar.</p></div><div><span>2</span><p><b>İlk sen bas.</b> Buzzer’a dokun veya boşluk tuşuna bas. Sıra, sunucuya ulaşan basışlara göre belirlenir.</p></div><div><span>3</span><p><b>{ANSWER_SECONDS} saniyede cevapla.</b> Cevabını sesli söyle. Sunucu değerlendirir. Doğruysa puan senin; yanlışta veya süre aşımında puan düşer, sıra sonraki oyuncuya geçer.</p></div></div>}{multipleChoice && <div className="joker-rules"><h3>Beş kişisel jokerin var</h3><p><b>Yarı yarıya:</b> İki seçenek kalır. <b>Çift cevap:</b> İki farklı seçenekten biri doğruysa kazanırsın; ikisi de yanlışsa ilk seçiminin cezasını bir kez alırsın. <b>Kalkan:</b> Yanlış cevap ve bomba cezasından korur. Bomba patlarsa bu sorudan 0 puan alırsın. <b>×2 puan:</b> Doğru cevabının puanı ikiye katlanır; tek cevap bonusuyla birleşirse ×4 kazanırsın. Yanlış cezası değişmez. <b>Bomba:</b> Bomba kullananlar arasında ilk doğru cevabı ver. Soru anında kapanır; diğer oyuncuların normal puanı yerine soru cezası uygulanır. Önceden Kalkan açanlar 0 puan alır.</p><p>Her birini oyun boyunca bir kez, cevaplamadan önce kullan. Bir soruda en fazla bir joker seçebilirsin. Çift cevapta doğru seçeneğin seçildiği süre puanlamaya girer; erken kapanış için ikinci seçim de beklenir. Bomba yarışı sunucuya ulaşma sırasına göre belirlenir; ilk yanlış bomba soru akışını durdurmaz. Kaybedenlerin açtığı bombalar da kullanılmış sayılır. Jokerler ve kalan hakların yeniden bağlanınca korunur.</p></div>}<div className="notice">{multipleChoice ? 'Doğru cevap ve kişisel seçimler herkes tamamlayınca, süre dolunca, bomba patlayınca veya sunucu Next dediğinde açılır. Cevap süresi sunucuya ulaşan seçime göre hesaplanır. Sunucu bu modda yönetici olarak izler.' : 'Her sorunun doğru puanı, yanlış cezası ve katsayısı farklı olabilir. Erken basarsan 1,5 saniye beklersin. Pas geçilen harf o turda tekrar sorulmaz.'}</div><button className="button primary wide" onClick={() => setModal(null)}>Hazırım, oyuna dön <ArrowRight size={17} /></button></>}
  </div></div>}
  {toast && <div className="toast" role="status"><span><Sparkles size={17} /></span>{toast}<button aria-label="Bildirimi kapat" onClick={() => setToast('')}><X size={15} /></button></div>}
 </div>;
}
