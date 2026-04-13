'use client';

import { notFound, useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { HabitRing } from '@/components/habits/habit-ring';

export default function HabitDetailPage() {
  const params = useParams<{ id: string }>();
  const { habits, addHabitProgress } = useAppStore();
  const habit = habits.find((item) => item.id === params.id);
  if (!habit) return notFound();

  return (
    <div className="space-y-4 rounded-2xl bg-card p-5 shadow-soft">
      <h1 className="text-3xl font-semibold">{habit.title}</h1>
      <div className="flex items-center gap-6">
        <HabitRing value={habit.value} target={habit.target} color={habit.color} size={120} />
        <div className="space-y-2 text-sm">
          <p>Current streak: {habit.streak}</p>
          <p>Best streak: {habit.bestStreak}</p>
          <p>Success rate: {habit.successRate}%</p>
          <p>Total completions: {habit.totalCompletions}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-lg border px-3 py-2" onClick={() => addHabitProgress(habit.id, -1)}>-1</button>
        <button className="rounded-lg bg-primary px-3 py-2 text-white" onClick={() => addHabitProgress(habit.id, 1)}>+1</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {habit.entries.slice(0, 28).map((entry) => (
          <div key={entry.date} className="h-8 rounded" style={{ background: `rgba(14,165,233,${Math.min(1, entry.value / habit.target)})` }} />
        ))}
      </div>
    </div>
  );
}
