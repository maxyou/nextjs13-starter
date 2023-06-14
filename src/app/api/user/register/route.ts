import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Calc } from '@/common';

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
  
  const { name, password } = await request.json();
  console.log(`POST name: ${name}, password: ${password}`);

  try {
    const ret = await prisma.user.create({
      data: {
        name: name,
        password: password,
        // email: '',
      }
    });

    console.log(`prisma.todoItem.create return: ${JSON.stringify(ret)}`) 
    
    // Remove password from the response object
    const { password: _, ...responseData } = ret;

    return NextResponse.json({ code: 0, message: 'success', data: responseData });

  } catch (error) {
    console.error('Error during user registration:', error);
    return NextResponse.json({ code: -1, message: 'Failed to register user.', data: { name } });
  }
}

export async function PUT(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)
  
  // const id = getQueryParam(request, 'id') || "";

  const query = Calc.parseUrlQuery(request.url);
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

export async function DELETE(request: Request) {

  console.log('req.method:', request.method)
  console.log('req.url', request.url)
  
  // const id = getQueryParam(request, 'id') || "";

  const query = Calc.parseUrlQuery(request.url);
  const id = query.id;
  console.log(`DELETE id: ${id}`);

  // const {content} = await request.json();
  // console.log(`PUT content: ${content}`);

  const ret = await prisma.todoItem.delete({
    where: { id }
  });
  
  console.log(`prisma.todoItem.delete return: ${JSON.stringify(ret)}`) 

  return NextResponse.json({ret});
}