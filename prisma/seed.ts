import { addDays, startOfDay } from 'date-fns';
import { PrismaClient, Priority, TaskStatus, HabitType, HabitPeriod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@dayloom.app' },
    update: {},
    create: {
      email: 'demo@dayloom.app',
      name: 'Demo User'
    }
  });

  const [work, personal, hidden] = await Promise.all([
    prisma.list.create({ data: { userId: user.id, name: 'Work', color: '#6366f1' } }),
    prisma.list.create({ data: { userId: user.id, name: 'Personal', color: '#14b8a6' } }),
    prisma.list.create({ data: { userId: user.id, name: 'Deep Projects', color: '#64748b', isHidden: true } })
  ]);

  const today = startOfDay(new Date());

  const tasks = await prisma.task.createMany({
    data: [
      { userId: user.id, listId: work.id, title: 'Review sprint board', dueAt: today, priority: Priority.HIGH },
      { userId: user.id, listId: work.id, title: 'Prepare product metrics memo', dueAt: addDays(today, 1), priority: Priority.MEDIUM },
      { userId: user.id, listId: personal.id, title: 'Gym session', dueAt: addDays(today, 2), priority: Priority.MEDIUM },
      { userId: user.id, listId: hidden.id, title: 'Long-term reading backlog', dueAt: addDays(today, 10), isHidden: true, priority: Priority.LOW },
      { userId: user.id, listId: personal.id, title: 'Buy groceries', dueAt: today, priority: Priority.HIGH, status: TaskStatus.DONE, completedAt: today }
    ]
  });

  const habit = await prisma.habit.create({
    data: {
      userId: user.id,
      title: 'Hydration',
      color: '#0ea5e9',
      type: HabitType.COUNT,
      period: HabitPeriod.DAILY,
      target: 8
    }
  });

  await prisma.habitEntry.createMany({
    data: Array.from({ length: 7 }).map((_, index) => ({
      habitId: habit.id,
      date: addDays(today, -index),
      value: Math.max(3, 8 - index)
    }))
  });

  console.log(`Seeded demo data (tasks: ${tasks.count})`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
