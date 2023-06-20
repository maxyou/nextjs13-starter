import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Calc } from '@/common';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { JwtUser } from '@/common/tool/calc';

const prisma = new PrismaClient();


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
    const jwtUser:JwtUser = { id, name:nameDB}

    const token = await Calc.getJoseJwtToken(jwtUser);

    const res = NextResponse.json({ code: 0, message: 'success', data: jwtUser })

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
