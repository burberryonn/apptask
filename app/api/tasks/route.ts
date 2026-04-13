import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany({ include: { subtasks: true, list: true }, take: 200, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(tasks);
}
