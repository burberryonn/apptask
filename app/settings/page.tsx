'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const { voiceEnabled, setVoiceEnabled } = useAppStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="space-y-4 rounded-2xl bg-card p-4 shadow-soft">
      <h1 className="text-3xl font-semibold">Настройки</h1>
      <label className="flex items-center justify-between rounded-lg border p-3">
        <span>Тема</span>
        <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')} className="rounded-lg border px-2 py-1">
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </label>
      <label className="flex items-center justify-between rounded-lg border p-3">
        <span>Голосовой ввод</span>
        <input type="checkbox" checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} />
      </label>
      <div className="rounded-lg border p-3 text-sm">Импорт/экспорт JSON в локальный файл (плейсхолдер).</div>
      <div className="rounded-lg border p-3 text-sm">Уведомления: в браузере как progressive enhancement, при запрете — fallback внутри интерфейса.</div>
    </div>
  );
}
