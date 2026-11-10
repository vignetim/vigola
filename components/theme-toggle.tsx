'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const preference = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      let saved;
      try { saved = localStorage.getItem('vigola-theme'); } catch { /* System preference works without storage. */ }
      const next = saved === 'dark' || saved === 'light' ? saved : preference.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    sync();
    preference.addEventListener('change', sync);
    window.addEventListener('storage', sync);
    return () => { preference.removeEventListener('change', sync); window.removeEventListener('storage', sync); };
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('vigola-theme', next); } catch { /* The current tab can still change its theme. */ }
  };

  return <button className="icon-button" onClick={toggle} aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'} title={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}>{theme === 'dark' ? <Sun size={21} /> : <Moon size={21} />}</button>;
}
