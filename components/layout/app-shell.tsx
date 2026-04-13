'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, History, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/history', label: 'Logbook', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 md:px-6 lg:py-8">
      <aside className="hidden w-60 rounded-2xl bg-card p-4 shadow-soft lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/20 text-primary">
            ◇
          </div>
          <div>
            <p className="text-lg font-semibold">Dayloom</p>
            <p className="text-xs text-slate-500">Focus in one flow</p>
          </div>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-accent',
                  pathname === link.href && 'bg-accent text-primary'
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="w-full">{children}</main>
    </div>
  );
}
