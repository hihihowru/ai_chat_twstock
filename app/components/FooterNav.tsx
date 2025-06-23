import { Home, MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';

interface FooterNavProps {
  active: 'threads' | 'chat' | 'watchlist';
}

const navs = [
  { key: 'threads', label: '同學會', icon: Home, href: '/threads' },
  { key: 'chat', label: 'AI 對話', icon: MessageCircle, href: '/' },
  { key: 'watchlist', label: '自選股', icon: Star, href: '/watchlist' },
];

export default function FooterNav({ active }: FooterNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-t flex justify-around py-2">
      {navs.map(({ key, label, icon: Icon, href }) => (
        <Link key={key} href={href} className="flex flex-col items-center gap-1 text-xs">
          <Icon size={24} className={active === key ? 'text-black' : 'text-gray-400'} />
          <span className={active === key ? 'text-black font-bold' : 'text-gray-400'}>{label}</span>
        </Link>
      ))}
    </nav>
  );
} 