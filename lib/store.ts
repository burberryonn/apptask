'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays } from 'date-fns';
import { AppHabit, AppTask, ActivityEvent, ListFilter } from '@/types/domain';
import { nextRecurringDate, successRate, streak } from '@/lib/business';

type AppState = {
  tasks: AppTask[];
  habits: AppHabit[];
  log: ActivityEvent[];
  filter: ListFilter;
  showHidden: boolean;
  voiceEnabled: boolean;
  setFilter: (filter: ListFilter) => void;
  toggleHidden: () => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  postponeTask: (id: string, offsetDays: number) => void;
  addSubtask: (taskId: string, title: string) => void;
  addHabitProgress: (habitId: string, delta: number) => void;
  addHabit: (title: string) => void;
  setVoiceEnabled: (enabled: boolean) => void;
};

const now = new Date();

const demoTasks: AppTask[] = [
  {
    id: 't1',
    title: 'Plan release notes',
    priority: 'HIGH',
    list: 'Work',
    color: '#6366f1',
    dueAt: now.toISOString(),
    completed: false,
    hidden: false,
    recurrence: 'NONE',
    subtasks: [{ id: 's1', title: 'Capture key shipped features', done: true }],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 't2',
    title: 'Morning walk',
    priority: 'MEDIUM',
    list: 'Personal',
    color: '#14b8a6',
    dueAt: addDays(now, 1).toISOString(),
    completed: false,
    hidden: false,
    recurrence: 'DAILY',
    subtasks: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 't3',
    title: 'Archive deep-research links',
    priority: 'LOW',
    list: 'Deep Projects',
    color: '#64748b',
    dueAt: addDays(now, 9).toISOString(),
    completed: false,
    hidden: true,
    recurrence: 'NONE',
    subtasks: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }
];

const demoHabits: AppHabit[] = [
  {
    id: 'h1',
    title: 'Hydration',
    type: 'COUNT',
    period: 'DAILY',
    target: 8,
    value: 5,
    color: '#0ea5e9',
    streak: 4,
    bestStreak: 11,
    successRate: 82,
    totalCompletions: 49,
    note: 'Drink water before coffee.',
    entries: Array.from({ length: 7 }).map((_, idx) => ({
      date: addDays(now, -idx).toISOString(),
      value: Math.max(2, 8 - idx)
    }))
  }
];

const makeEvent = (partial: Omit<ActivityEvent, 'id' | 'happenedAt'>): ActivityEvent => ({
  ...partial,
  id: crypto.randomUUID(),
  happenedAt: new Date().toISOString()
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: demoTasks,
      habits: demoHabits,
      log: [],
      filter: 'all',
      showHidden: false,
      voiceEnabled: true,
      setFilter: (filter) => set({ filter }),
      toggleHidden: () => set((state) => ({ showHidden: !state.showHidden })),
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      addTask: (title) =>
        set((state) => {
          const task: AppTask = {
            id: crypto.randomUUID(),
            title,
            priority: 'MEDIUM',
            list: 'Work',
            color: '#6366f1',
            completed: false,
            hidden: false,
            recurrence: 'NONE',
            dueAt: new Date().toISOString(),
            subtasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return {
            tasks: [task, ...state.tasks],
            log: [makeEvent({ entity: 'TASK', entityId: task.id, action: 'TASK_CREATED', note: task.title }), ...state.log]
          };
        }),
      toggleTask: (id) =>
        set((state) => {
          const task = state.tasks.find((item) => item.id === id);
          if (!task) return state;
          const completed = !task.completed;
          return {
            tasks: state.tasks.map((item) =>
              item.id === id
                ? {
                    ...item,
                    completed,
                    dueAt: completed && item.recurrence !== 'NONE' && item.dueAt ? nextRecurringDate(item.dueAt, item.recurrence) : item.dueAt,
                    updatedAt: new Date().toISOString()
                  }
                : item
            ),
            log: [
              makeEvent({ entity: 'TASK', entityId: id, action: completed ? 'TASK_COMPLETED' : 'TASK_REOPENED', note: task.title }),
              ...state.log
            ]
          };
        }),
      postponeTask: (id, offsetDays) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id && task.dueAt ? { ...task, dueAt: addDays(new Date(task.dueAt), offsetDays).toISOString() } : task
          )
        })),
      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, subtasks: [...task.subtasks, { id: crypto.randomUUID(), title, done: false }] } : task
          )
        })),
      addHabitProgress: (habitId, delta) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== habitId) return habit;
            const nextValue = Math.max(0, habit.value + delta);
            const entries = [{ date: new Date().toISOString(), value: nextValue }, ...habit.entries.slice(0, 59)];
            return {
              ...habit,
              value: nextValue,
              entries,
              successRate: successRate({ ...habit, entries }),
              streak: streak(entries, habit.target)
            };
          }),
          log: [makeEvent({ entity: 'HABIT', entityId: habitId, action: 'HABIT_TRACKED' }), ...state.log]
        })),
      addHabit: (title) =>
        set((state) => {
          const habit: AppHabit = {
            id: crypto.randomUUID(),
            title,
            type: 'COUNT',
            period: 'DAILY',
            target: 1,
            value: 0,
            color: '#f97316',
            streak: 0,
            bestStreak: 0,
            successRate: 0,
            totalCompletions: 0,
            entries: []
          };
          return { habits: [habit, ...state.habits] };
        })
    }),
    { name: 'dayloom-store' }
  )
);
