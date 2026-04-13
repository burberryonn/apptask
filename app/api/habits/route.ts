import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const habits = await prisma.habit.findMany({ include: { entries: true }, take: 200, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(habits);
}
