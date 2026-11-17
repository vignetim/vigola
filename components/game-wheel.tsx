import { ANSWER_SECONDS } from '@/lib/game-rules.mjs';
import { Timer } from 'lucide-react';
import type { GameState } from '@/lib/types';

type Props = {
  letters: string[];
  letter: string;
  history: GameState['history'];
  phase: GameState['phase'];
  seconds: number;
  countdown: number;
  multipleChoice?: boolean;
};

export default function GameWheel({ letters, letter, history, phase, seconds, countdown, multipleChoice = false }: Props) {
  const circumference = 2 * Math.PI * 190;
  const answering = phase === 'answering' || (multipleChoice && phase === 'open');

  return (
    <div className={`game-wheel ${answering ? 'is-answering' : ''} ${answering && seconds <= 3 ? 'is-urgent' : ''}`}>
      <svg viewBox="0 0 400 400" role="img" aria-label={`Harf çarkı. Aktif harf: ${letter}`}>
        <circle className="wheel-timer-track" cx="200" cy="200" r="190" />
        {answering && <circle className="wheel-timer-progress" cx="200" cy="200" r="190" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - seconds / ANSWER_SECONDS)} transform="rotate(-90 200 200)" />}
        {letters.map((item, index) => {
          const multipleRings = letters.length > 32;
          const count = multipleRings ? Math.ceil(letters.length / 2) : letters.length;
          const angle = (index % count) / count * Math.PI * 2 - Math.PI / 2;
          const radius = multipleRings && index >= count ? 128 : 165;
          const x = 200 + radius * Math.cos(angle);
          const y = 200 + radius * Math.sin(angle);
          const status = history.find(entry => entry.letter === item)?.status;
          const active = item === letter;
          return <g key={item} className={`wheel-letter ${active ? 'active' : ''} ${status || ''}`} transform={`translate(${x}, ${y})`} aria-hidden="true">
            {active && <circle className="wheel-letter-halo" r="23" />}
            <circle r={active ? 18 : 16} />
            <text textAnchor="middle" dominantBaseline="central">{status === 'correct' ? '✓' : item}</text>
          </g>;
        })}
      </svg>
      <div className="wheel-center" aria-hidden="true">
        <span>{phase === 'countdown' ? 'HAZIR OL' : answering ? 'CEVAP SÜRESİ' : 'BU HARFLE BAŞLIYOR'}</span>
        <strong key={phase === 'countdown' ? countdown : letter}>{phase === 'countdown' ? countdown : letter}</strong>
        {answering ? <div className="wheel-seconds"><Timer size={18} /><b>{String(seconds).padStart(2, '0')}</b><span>sn</span></div> : <small>{multipleChoice ? phase === 'countdown' ? 'Soruyu okumaya hazırlan' : 'Düşün. Seç. Sonucu gör.' : phase === 'lobby' ? 'Yazılım passaparolası' : phase === 'countdown' ? 'Parmaklar butonlarda' : 'Düşün. Bas. Cevapla.'}</small>}
      </div>
    </div>
  );
}
