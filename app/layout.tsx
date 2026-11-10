import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Vigola — Yazılımın passaparolası',
 description: 'Soruyu gör. İlk sen bas. Bildiğini konuştur. Ekibinle canlı yazılım passaparolası.',
 icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="tr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('vigola-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}` }} /></head><body>{children}</body></html>;
}
