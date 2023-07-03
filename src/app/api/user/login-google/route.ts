import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Calc } from '@/common';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { JwtUser } from '@/common/tool/calc';

const prisma = new PrismaClient();


export async function POST(request: Request) {


  console.log(`login-google-html POST`);

  // const idToken: string = request.body?.credential; // 从请求的主体中获取 ID 令牌
    
  const body = await request.text();

  console.log('login-google-html, body:', body);

  const credentialStartIndex = body.indexOf('credential=') + 'credential='.length;
  const credentialEndIndex = body.indexOf('&', credentialStartIndex);
  const credential = body.substring(credentialStartIndex, credentialEndIndex);

  console.log('login-google-html, credential:', credential);

  const jwtUser:JwtUser = { 
    id:"user-id", 
    name:"user-name", 
    email: "user-email",
    picture: "user-picture",
    from:"google",    
  }

  const token = await Calc.getJoseJwtToken(jwtUser);  

  // console.log('login-google-html, token:', token);
  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: true,    
  //   maxAge: 365 * 24 * 60 * 60, // 1 year (in seconds)
  //   path: "/",
  // };

  // const res = NextResponse.redirect(new URL(request.url).origin + '/home', { status: 302 })
  // res.cookies.set('jwt', token, cookieOptions);
  // return res;

  try {
    const userFindFirst = await prisma.user.findFirst({
      where: {
        name: jwtUser.id
      },
    });

    if (!userFindFirst) {
      const ret = await prisma.user.create({
        data: {
          name: jwtUser.id,
          nickname: jwtUser.name,
          email: jwtUser.email,
          logined: true,          
          from: 'google',
          avatar: jwtUser.picture
        }
      });
    }
    console.log(`login sucess, prisma.user.findFirst return: ${JSON.stringify(userFindFirst)}`)

    // Set the 'logined' flag to true
    // await prisma.user.update({
    //   where: { id: userFindFirst.id },
    //   data: { logined: true },
    // });

    // const { id, name: nameDB } = userFindFirst as { id: string; name: string };
    // const jwtUser:JwtUser = { id, name:nameDB}

    const token = await Calc.getJoseJwtToken(jwtUser);

    console.log('login-google-html, token:', token);
    const cookieOptions = {
      httpOnly: true,
      secure: true,    
      maxAge: 365 * 24 * 60 * 60, // 1 year (in seconds)
      path: "/",
    };
  
    const res = NextResponse.redirect(new URL(request.url).origin + '/biz/todolist', { status: 302 })
    res.cookies.set('jwt', token, cookieOptions);
    return res;

  } catch (error) {
    console.error('Error during user login:', error);
    return NextResponse.json({ code: -1, message: 'Failed to login user.' });
  }
}
