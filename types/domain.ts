export type ListFilter = 'all' | 'work' | 'personal' | 'shopping' | 'hidden' | 'completed';

export type TaskBucket = 'today' | 'tomorrow' | 'week' | 'later';

export interface AppSubtask {
  id: string;
  title: string;
  done: boolean;
}

export interface AppTask {
  id: string;
  title: string;
  description?: string;
  dueAt?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  list: 'Work' | 'Personal' | 'Shopping' | 'Deep Projects';
  color: string;
  completed: boolean;
  hidden: boolean;
  reminderAt?: string;
  recurrence: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  subtasks: AppSubtask[];
  createdAt: string;
  updatedAt: string;
}

export interface AppHabit {
  id: string;
  title: string;
  type: 'YES_NO' | 'COUNT' | 'AMOUNT';
  period: 'DAILY' | 'WEEKLY';
  target: number;
  value: number;
  color: string;
  note?: string;
  streak: number;
  bestStreak: number;
  successRate: number;
  totalCompletions: number;
  entries: Array<{ date: string; value: number }>;
}

export interface ActivityEvent {
  id: string;
  entity: 'TASK' | 'HABIT';
  entityId: string;
  action: string;
  happenedAt: string;
  note?: string;
}
