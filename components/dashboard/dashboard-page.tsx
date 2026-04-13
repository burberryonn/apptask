'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Mic, MicOff, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { groupTasks, hiddenListExcluded, taskOverdue } from '@/lib/business';
import { HabitRing } from '@/components/habits/habit-ring';
import { TaskDetailDrawer } from '@/components/tasks/task-detail-drawer';

const filters = [
  { value: 'all', label: 'Все' },
  { value: 'work', label: 'Работа' },
  { value: 'personal', label: 'Личное' },
  { value: 'shopping', label: 'Покупки' },
  { value: 'hidden', label: 'Скрытые' },
  { value: 'completed', label: 'Завершённые' }
] as const;

const bucketLabels = {
  today: 'Сегодня',
  tomorrow: 'Завтра',
  week: 'На этой неделе',
  later: 'Позже'
} as const;


const listLabels: Record<string, string> = {
  Work: 'Работа',
  Personal: 'Личное',
  Shopping: 'Покупки',
  'Deep Projects': 'Глубокие проекты'
};

const priorityLabels: Record<string, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
  URGENT: 'Срочный'
};

export function DashboardPage() {
  const { tasks, habits, filter, setFilter, addTask, toggleTask, postponeTask, showHidden, toggleHidden, voiceEnabled } = useAppStore();
  const [newTask, setNewTask] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'n') inputRef.current?.focus();
      if (event.key.toLowerCase() === 'h') toggleHidden();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleHidden]);

  const visibleTasks = tasks.filter((task) => {
    if (hiddenListExcluded(task, showHidden) && filter !== 'hidden') return false;
    if (filter === 'completed') return task.completed;
    if (filter === 'hidden') return task.hidden;
    if (filter === 'all') return !task.completed;
    return task.list.toLowerCase().includes(filter) && !task.completed;
  });

  const buckets = useMemo(() => groupTasks(visibleTasks), [visibleTasks]);

  const startVoiceInput = () => {
    const SpeechRecognition = (window as Window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Голосовой ввод не поддерживается в этом браузере.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript;
      if (text) setNewTask(text);
    };
    recognition.start();
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{format(new Date(), 'EEEE, d MMMM', { locale: ru })}</p>
            <h1 className="text-3xl font-semibold">Фокус на одном экране</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border px-3 py-2 text-sm" onClick={toggleHidden}>Показать/скрыть скрытые списки</button>
            <button className="rounded-xl bg-primary px-3 py-2 text-sm text-white" aria-label="Добавить задачу">
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-3 py-1 text-xs ${item.value === filter ? 'bg-primary text-white' : 'bg-accent'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <section className="overflow-x-auto rounded-2xl bg-card p-4 shadow-soft">
        <div className="flex min-w-max gap-4">
          {habits.map((habit) => (
            <article key={habit.id} className="w-56 rounded-2xl border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{habit.title}</p>
                <HabitRing value={habit.value} target={habit.target} color={habit.color} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {habit.value}/{habit.target} • серия {habit.streak}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-card p-4 shadow-soft">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Быстро добавить задачу"
            aria-label="Быстро добавить задачу"
          />
          <button
            onClick={() => {
              if (newTask.trim()) addTask(newTask.trim());
              setNewTask('');
            }}
            className="rounded-xl bg-primary px-4 py-2 text-white"
          >
            Добавить
          </button>
          <button className="rounded-xl border px-3" title="Голосовой ввод" onClick={startVoiceInput}>
            {voiceEnabled ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
        </div>
      </section>

      {(['today', 'tomorrow', 'week', 'later'] as const).map((bucket) => (
        <section key={bucket} className="rounded-2xl bg-card p-4 shadow-soft">
          <h2 className="mb-3 text-2xl font-semibold">{bucketLabels[bucket]}</h2>
          <div className="space-y-2">
            {buckets[bucket].length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-slate-500">Пока пусто. Добавьте задачу или перенесите её сюда.</p>
            ) : (
              buckets[bucket].map((task) => (
                <article key={task.id} className="flex items-start justify-between rounded-xl border p-3">
                  <button className="text-left" onClick={() => setSelectedTaskId(task.id)}>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      {listLabels[task.list] ?? task.list} · {priorityLabels[task.priority] ?? task.priority} {taskOverdue(task) ? '· просрочено' : ''}
                    </p>
                  </button>
                  <div className="flex gap-1">
                    <button className="rounded-lg border px-2 text-xs" onClick={() => postponeTask(task.id, 1)}>+1 д</button>
                    <button className="rounded-lg border px-2 text-xs" onClick={() => postponeTask(task.id, 7)}>+1 нед</button>
                    <button className="rounded-lg bg-accent px-2 text-xs" onClick={() => toggleTask(task.id)}>
                      {task.completed ? 'Отменить' : 'Готово'}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      ))}
      <TaskDetailDrawer taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}
