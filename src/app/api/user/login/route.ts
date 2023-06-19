import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Calc } from '@/common';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const prisma = new PrismaClient();

export async function GET(request: Request) {



  // console.log('req.method:', request.method)
  // console.log('req.url', request.url)

  // const todoItems = await prisma.todoItem.findMany({
  //   orderBy: {
  //     done: "asc"
  //   }
  // });

  // console.log(`prisma.todoItem.findMany return: ${JSON.stringify(todoItems)}`) 

  // return NextResponse.json({ todoItems });
}
export async function POST(request: Request) {

  const { name: nameRequest, password, email } = await request.json();
  console.log(`POST name: ${nameRequest}, password: ${password}, email:${email}`);

  try {
    const userFindFirst = await prisma.user.findFirst({
      where: {
        name: nameRequest,
        password: password,
      },
    });

    if (!userFindFirst) {
      console.log(`login failed, prisma.user.findFirst return: ${JSON.stringify(userFindFirst)}`)
      return NextResponse.json({ code: -1, message: 'Failed to register user.' });
    }
    console.log(`login sucess, prisma.user.findFirst return: ${JSON.stringify(userFindFirst)}`)

    // Set the 'logined' flag to true
    await prisma.user.update({
      where: { id: userFindFirst.id },
      data: { logined: true },
    });

    const { id, name: nameDB } = userFindFirst as { id: string; name: string };
    const responseData = { id, name: nameDB }

    const secret = process.env.JWT_SECRET as string;

    const iat = Math.floor(Date.now() / 1000);
    // const exp = iat + 60 * 60; // one hour
    const exp = iat + 60; // one minute

    const tokenBeforeSign = new SignJWT({ responseData })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat);
    console.log(`using jose, tokenBeforeSign:${JSON.stringify(tokenBeforeSign)}`);
    const token = await tokenBeforeSign.sign(new TextEncoder().encode(secret));
    console.log(`using jose, token:${JSON.stringify(token)}`);

    // const tokenParsed = await jwtVerify(token, new TextEncoder().encode(secret));
    // console.log(`using jose, tokenParsed:${JSON.stringify(tokenParsed)}`);

    const res = NextResponse.json({ code: 0, message: 'success', data: responseData })

    const cookieOptions = {
      httpOnly: true,
      secure: true
    };
    res.cookies.set('jwt', token, cookieOptions);

    return res;

  } catch (error) {
    console.error('Error during user login:', error);
    return NextResponse.json({ code: -1, message: 'Failed to login user.' });
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

  return NextResponse.json({ ret });
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

  return NextResponse.json({ ret });
}