import { addDays, endOfWeek, isBefore, isSameDay, parseISO, startOfDay } from 'date-fns';
import { AppHabit, AppTask, TaskBucket } from '@/types/domain';

export function groupTasks(tasks: AppTask[]): Record<TaskBucket, AppTask[]> {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });

  return tasks.reduce<Record<TaskBucket, AppTask[]>>(
    (acc, task) => {
      if (!task.dueAt) {
        acc.later.push(task);
        return acc;
      }
      const date = startOfDay(parseISO(task.dueAt));
      if (isSameDay(date, today)) acc.today.push(task);
      else if (isSameDay(date, tomorrow)) acc.tomorrow.push(task);
      else if (isBefore(date, thisWeekEnd) || isSameDay(date, thisWeekEnd)) acc.week.push(task);
      else acc.later.push(task);
      return acc;
    },
    { today: [], tomorrow: [], week: [], later: [] }
  );
}

export function taskOverdue(task: AppTask) {
  return Boolean(task.dueAt && !task.completed && isBefore(parseISO(task.dueAt), startOfDay(new Date())));
}

export function hiddenListExcluded(task: AppTask, showHidden: boolean) {
  return !showHidden && task.hidden;
}

export function successRate(habit: AppHabit) {
  if (!habit.entries.length) return 0;
  const hits = habit.entries.filter((entry) => entry.value >= habit.target).length;
  return Math.round((hits / habit.entries.length) * 100);
}

export function streak(entries: Array<{ date: string; value: number }>, target: number) {
  const sorted = [...entries].sort((a, b) => (a.date > b.date ? -1 : 1));
  let current = 0;
  for (const entry of sorted) {
    if (entry.value >= target) current += 1;
    else break;
  }
  return current;
}

export function nextRecurringDate(baseISO: string, recurrence: AppTask['recurrence']) {
  const base = parseISO(baseISO);
  if (recurrence === 'DAILY') return addDays(base, 1).toISOString();
  if (recurrence === 'WEEKLY') return addDays(base, 7).toISOString();
  if (recurrence === 'MONTHLY') return addDays(base, 30).toISOString();
  return baseISO;
}

export function dailyAggregation(tasks: AppTask[], habits: AppHabit[]) {
  return {
    openTasks: tasks.filter((task) => !task.completed && !task.hidden).length,
    completedTasks: tasks.filter((task) => task.completed).length,
    averageHabitRate:
      habits.length === 0 ? 0 : Math.round(habits.reduce((sum, habit) => sum + habit.successRate, 0) / habits.length)
  };
}
