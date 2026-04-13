'use client';

import { motion } from 'framer-motion';

type Props = {
  value: number;
  target: number;
  color: string;
  size?: number;
};

export function HabitRing({ value, target, color, size = 72 }: Props) {
  const progress = Math.min(100, Math.round((value / Math.max(target, 1)) * 100));
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="relative" aria-label={`Habit completion ${progress}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="7" className="text-slate-200" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-semibold">{progress}%</span>
    </div>
  );
}
