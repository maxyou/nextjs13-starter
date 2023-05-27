import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
export async function GET(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)

  const todoItems = await prisma.todoItem.findMany();
  return NextResponse.json({ todoItems });
}