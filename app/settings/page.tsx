'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const { voiceEnabled, setVoiceEnabled } = useAppStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="space-y-4 rounded-2xl bg-card p-4 shadow-soft">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <label className="flex items-center justify-between rounded-lg border p-3">
        <span>Theme</span>
        <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')} className="rounded-lg border px-2 py-1">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className="flex items-center justify-between rounded-lg border p-3">
        <span>Voice input</span>
        <input type="checkbox" checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} />
      </label>
      <div className="rounded-lg border p-3 text-sm">
        JSON import/export placeholders for user data.
      </div>
      <div className="rounded-lg border p-3 text-sm">
        Notifications architecture: browser notifications are progressive enhancement; production delivery should use a background worker queue.
      </div>
    </div>
  );
}
