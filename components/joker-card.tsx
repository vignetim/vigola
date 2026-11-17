'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Bomb, Coins, CopyCheck, Info, ShieldCheck, Split } from 'lucide-react';
import type { Joker } from '@/lib/types';

const icons = { 'fifty-fifty': Split, 'double-answer': CopyCheck, shield: ShieldCheck, 'double-points': Coins, bomb: Bomb };

type Props = {
 joker: { id: Joker; name: string; description: string };
 label: string;
 active: boolean;
 spent: boolean;
 disabled: boolean;
 onUse: () => void;
};

export default function JokerCard({ joker, label, active, spent, disabled, onUse }: Props) {
 const [infoOpen, setInfoOpen] = useState(false);
 const infoId = useId();
 const info = useRef<HTMLDivElement>(null);
 const Icon = icons[joker.id];

 useEffect(() => {
  if (!infoOpen) return;
  const dismiss = (event: PointerEvent) => {
   if (!info.current?.contains(event.target as Node)) setInfoOpen(false);
  };
  const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setInfoOpen(false); };
  document.addEventListener('pointerdown', dismiss);
  document.addEventListener('keydown', escape);
  return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
 }, [infoOpen]);

 return <div className={`joker-card ${joker.id === 'bomb' ? 'bomb-joker' : ''} ${active ? 'active' : ''} ${spent ? 'spent' : ''}`}>
  <button type="button" className="joker-button" disabled={disabled} aria-pressed={active} aria-label={`${joker.name}: ${label}`} onClick={onUse}>
   <Icon className="joker-icon" size={21} aria-hidden="true" /><b>{joker.name}</b><small>{label}</small>
  </button>
  <div ref={info} className="joker-info-wrap" onMouseEnter={() => setInfoOpen(true)} onMouseLeave={() => { if (!info.current?.contains(document.activeElement)) setInfoOpen(false); }}>
   <button type="button" className="joker-info" aria-label={`${joker.name} hakkında bilgi`} aria-expanded={infoOpen} aria-describedby={infoOpen ? infoId : undefined} onFocus={() => setInfoOpen(true)} onBlur={() => setInfoOpen(false)} onClick={() => setInfoOpen(true)}><Info size={14} aria-hidden="true" /></button>
   {infoOpen && <div id={infoId} role="tooltip" className="joker-tooltip"><b>{joker.name}</b><span>{joker.description}</span><small>Oyun boyunca bir kez; ilk cevabından önce kullan. Birden fazla jokeri birlikte açabilirsin.</small></div>}
  </div>
 </div>;
}
