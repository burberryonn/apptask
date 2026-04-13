'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function TaskDetailDrawer({ taskId, onClose }: { taskId: string | null; onClose: () => void }) {
  const { tasks, addSubtask } = useAppStore();
  const task = tasks.find((item) => item.id === taskId);
  const [subtask, setSubtask] = useState('');

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-20 bg-black/20 p-4" onClick={onClose}>
      <aside className="ml-auto h-full w-full max-w-xl rounded-2xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-semibold">{task.title}</h3>
        <p className="mt-2 text-sm text-slate-500">Priority {task.priority} · Recurrence {task.recurrence}</p>
        <div className="mt-5 space-y-3">
          <h4 className="font-medium">Subtasks</h4>
          {task.subtasks.map((item) => (
            <p key={item.id} className="rounded-lg border px-3 py-2 text-sm">
              {item.done ? '✓' : '○'} {item.title}
            </p>
          ))}
          <div className="flex gap-2">
            <input value={subtask} onChange={(e) => setSubtask(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
            <button
              className="rounded-lg bg-primary px-3 py-2 text-white"
              onClick={() => {
                if (subtask.trim()) addSubtask(task.id, subtask.trim());
                setSubtask('');
              }}
            >
              Add
            </button>
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-accent p-3 text-sm">
          Share placeholder: <button className="underline">Copy share link</button>
        </div>
      </aside>
    </div>
  );
}
