import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
export async function GET(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)

  const todoItems = await prisma.todoItem.findMany({
    orderBy: {
      done: "asc"
    }
  });

  console.log(`prisma.todoItem.findMany return: ${JSON.stringify(todoItems)}`) 
  
  return NextResponse.json({ todoItems });
}

export async function POST(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)
  
  const {content} = await request.json();
  console.log(`POST content: ${content}`);

  const ret = await prisma.todoItem.create({
    data: { content },
  });
  
  console.log(`prisma.todoItem.create return: ${JSON.stringify(ret)}`) 

  return NextResponse.json({ret});
}

function parseQuery(url: string) {
  const query: {[key: string]: string} = {};
  if (url.indexOf('?') > -1) {
    const queryStr = url.split('?')[1];
    queryStr.split('&').forEach(q => {
      const [key, value] = q.split('=');
      query[key] = value;
    });
  }
  return query;
}

export async function PUT(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)
  
  // const id = getQueryParam(request, 'id') || "";

  const query = parseQuery(request.url);
  const id = query.id;
  const done = query.done;
  console.log(`PUT id: ${id}`);
  console.log(`PUT done: ${done}`);

  // const {content} = await request.json();
  // console.log(`PUT content: ${content}`);

  const ret = await prisma.todoItem.update({
    where: { id },
    data: { done: done == 'false' },
  });
  
  console.log(`prisma.todoItem.update return: ${JSON.stringify(ret)}`) 

  return NextResponse.json({ret});
}