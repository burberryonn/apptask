'use client';

import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function HistoryPage() {
  const { log } = useAppStore();
  const [query, setQuery] = useState('');

  const filtered = log.filter((item) => item.action.toLowerCase().includes(query.toLowerCase()) || item.note?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4 rounded-2xl bg-card p-4 shadow-soft">
      <h1 className="text-3xl font-semibold">История</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg border px-3 py-2" placeholder="Поиск по истории" />
      {filtered.length === 0 && <p className="rounded-lg border border-dashed p-4 text-sm text-slate-500">Пока нет активности.</p>}
      {filtered.map((item) => (
        <article key={item.id} className="rounded-lg border p-3 text-sm">
          <p className="font-medium">{item.action}</p>
          <p className="text-slate-500">{formatDistanceToNow(new Date(item.happenedAt), { addSuffix: true, locale: ru })}</p>
        </article>
      ))}
    </div>
  );
}
