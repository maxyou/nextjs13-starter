import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Calc } from '@/common';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { JwtUser } from '@/common/tool/calc';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

async function verify(token: string) {
  console.log("verify 1");
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID as string,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  console.log("verify 2");
  const payload = ticket.getPayload();
  console.log("verify 3");
  console.log(`token payload: ${JSON.stringify(payload)}`);
  console.log("verify 4");
  if (!payload) {
    return null;
  }
  const sub = payload['sub'];
  const name = payload['name'];
  const email = payload['email'];
  const picture = payload['picture'];

  return { sub, name, email, picture };

  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}


export async function POST(request: Request) {

  try {

    console.log(`login-google-html POST`);

    const body = await request.text();
    console.log('login-google-html, body:', body);

    const credentialStartIndex = body.indexOf('credential=') + 'credential='.length;
    const credentialEndIndex = body.indexOf('&', credentialStartIndex);
    const credential = body.substring(credentialStartIndex, credentialEndIndex);

    console.log('login-google-html, credential:', credential);
    const user = await verify(credential);
    console.log('login-google-html, user:', JSON.stringify(user));

    const jwtUser: JwtUser = {} as JwtUser;

    const userFindFirst = await prisma.user.findFirst({
      where: {
        name: user!.sub
      },
    });

    if (userFindFirst) {

      jwtUser.id = userFindFirst.id;
      jwtUser.name = userFindFirst.name;
      jwtUser.nickname = userFindFirst.nickname as string | undefined;
      jwtUser.email = userFindFirst.email as string | undefined;
      jwtUser.avatar = userFindFirst.avatar as string | undefined;
      jwtUser.from = userFindFirst.from;

    } else {
      const ret = await prisma.user.create({
        data: {
          name: user!.sub,
          nickname: user!.name,
          email: user!.email,
          logined: true,
          from: 'google',
          avatar: user!.picture
        }
      });

      jwtUser.id = ret.id;
      jwtUser.name = ret.name;
      jwtUser.nickname = ret.nickname as string | undefined;
      jwtUser.email = ret.email as string | undefined;
      jwtUser.avatar = ret.avatar as string | undefined;
      jwtUser.from = ret.from;

    }
    console.log(`login sucess, jwtUser: ${JSON.stringify(jwtUser)}`)

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
