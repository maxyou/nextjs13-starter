import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
export async function GET(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)

  const todoItems = await prisma.todoItem.findMany();

  console.log(`prisma.todoItem.findMany return: ${JSON.stringify(todoItems)}`) 
  
  return NextResponse.json({ todoItems });
}

export async function POST(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)
  
  const {content} = await request.json();
  console.log(`addTodoItem() content: ${content}`);

  const ret = await prisma.todoItem.create({
    data: { content },
  });
  
  console.log(`prisma.todoItem.create return: ${JSON.stringify(ret)}`) 

  return NextResponse.json({ret});
}