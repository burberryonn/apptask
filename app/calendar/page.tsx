'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function CalendarPage() {
  const [mode, setMode] = useState<'month' | 'week'>('month');
  const [day, setDay] = useState(new Date());
  const { tasks, habits } = useAppStore();

  const dayTasks = useMemo(() => tasks.filter((task) => task.dueAt?.slice(0, 10) === day.toISOString().slice(0, 10)), [tasks, day]);

  return (
    <div className="space-y-4 rounded-2xl bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Календарь</h1>
        <div className="space-x-2">
          <button className={`rounded-lg px-3 py-1 ${mode === 'month' ? 'bg-primary text-white' : 'bg-accent'}`} onClick={() => setMode('month')}>Месяц</button>
          <button className={`rounded-lg px-3 py-1 ${mode === 'week' ? 'bg-primary text-white' : 'bg-accent'}`} onClick={() => setMode('week')}>Неделя</button>
        </div>
      </div>
      <p className="text-sm text-slate-500">Выбранный день: {format(day, 'PPPP', { locale: ru })}</p>
      <input type="date" className="rounded-lg border px-3 py-2" value={day.toISOString().slice(0, 10)} onChange={(e) => setDay(new Date(e.target.value))} />
      <section>
        <h2 className="text-xl font-semibold">Задачи ({dayTasks.length})</h2>
        {dayTasks.map((task) => (
          <p key={task.id} className="rounded-lg border p-2 text-sm">{task.title}</p>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-semibold">Привычки</h2>
        {habits.map((habit) => (
          <p key={habit.id} className="rounded-lg border p-2 text-sm">{habit.title}: {habit.value}/{habit.target}</p>
        ))}
      </section>
    </div>
  );
}
