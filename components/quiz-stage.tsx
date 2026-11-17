import { Timer } from 'lucide-react';
import { MULTIPLE_CHOICE_SECONDS } from '@/lib/game-rules.mjs';
import type { GameState } from '@/lib/types';

type Props = {
 index: number;
 total: number;
 history: GameState['history'];
 phase: GameState['phase'];
 seconds: number;
 countdown: number;
};

export default function QuizStage({ index, total, history, phase, seconds, countdown }: Props) {
 const open = phase === 'open';
 const completed = history.length;
 const label = phase === 'lobby' ? 'YARIŞMAYA HAZIR MISIN?' : phase === 'countdown' ? 'SORU AÇILIYOR' : phase === 'resolved' ? 'SORU TAMAMLANDI' : 'ŞİMDİKİ SORU';
 return <div className={`quiz-stage ${open && seconds <= 3 ? 'is-urgent' : ''}`}>
  <div className="quiz-stage-heading"><span>HARF İPUCU YOK</span><span>{total} soru · 5 joker</span></div>
  <div className="quiz-stage-number"><span>{label}</span><strong>{phase === 'countdown' ? countdown : String(index + 1).padStart(2, '0')}</strong><small>/{String(total).padStart(2, '0')}</small></div>
  <div className="quiz-clock">
   <div><span><Timer size={17} />{open ? 'Kalan süre' : phase === 'countdown' ? 'Hazırlık' : phase === 'resolved' ? 'Sonuçlar açık' : 'Her soru için'}</span><b aria-label={open ? `${seconds} saniye kaldı` : undefined}>{phase === 'countdown' ? countdown : open ? seconds : MULTIPLE_CHOICE_SECONDS}<small> sn</small></b></div>
   <div className="quiz-clock-track" aria-hidden="true"><span style={{ width: `${open ? seconds / MULTIPLE_CHOICE_SECONDS * 100 : phase === 'resolved' ? 0 : 100}%` }} /></div>
  </div>
  <div className="quiz-progress-heading"><span>Yarışma ilerlemesi</span><b>{completed} / {total}</b></div>
  <ol className="quiz-checkpoints" aria-label="Soruların tamamlanma durumu">{Array.from({ length: total }, (_, number) => {
   const status = history[number]?.status;
   const current = number === index && phase !== 'lobby';
   return <li key={number} className={`${status || ''} ${current ? 'current' : ''}`} aria-current={current ? 'step' : undefined} aria-label={`Soru ${number + 1}: ${status === 'correct' ? 'en az bir doğru cevap' : status === 'passed' ? 'doğru cevap yok' : current ? 'şimdiki soru' : 'bekliyor'}`}>{String(number + 1).padStart(2, '0')}</li>;
  })}</ol>
  <div className="quiz-progress-legend"><span><i className="correct" />En az bir doğru</span><span><i className="passed" />Doğru yok</span></div>
 </div>;
}
