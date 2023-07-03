import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { JwtUser, joseVerify } from "./common/tool/calc";
import { Calc } from '@/common';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    console.log('middleware.ts, request.url:', request.url)
    console.log('middleware.ts, request.nextUrl.pathname:', request.nextUrl.pathname)
    
    // const { pathname } = request.nextUrl;
    // if(pathname.includes('/user/')) {
    //   return NextResponse.next({
    //     // request: {
    //     //   headers
    //     // }
    //   });
    // }

    // const { pathname } = request.nextUrl;
    // if(
    //   pathname === '/user/login' 
    //   || pathname === '/user/register'
    //   || pathname === '/user/logout'
    //   ) {
    //   return NextResponse.next({
    //     // request: {
    //     //   headers
    //     // }
    //   });
    // }


    const headers = new Headers(request.headers);
    // headers.set('middlewareSet', 'mydata');

    const cookies = headers.get('cookie')
    console.log('middleware.ts, cookies:', cookies)

    const parsedCookies = cookie.parse(cookies || '');

    // Access the specific item you want
    const jwtToken = parsedCookies.jwt;
    console.log('middleware.ts, jwtToken:', jwtToken)

    const secret = process.env.JWT_SECRET as string;
    console.log('====middleware.ts, secret:', secret)

    const decodedToken = await joseVerify(jwtToken, secret);
    console.log('middleware.ts, decodedToken:', JSON.stringify(decodedToken))
    
    if(decodedToken.code !== 0) {     

      console.log('middleware.ts, decodedToken.code !== 0, redirect to /user/login')
      return NextResponse.redirect(new URL('/user/login', request.url))
    }

    const jwtUser = decodedToken.jwtPayloadWithUser!.jwtUser;
    headers.set('middlewareSet', JSON.stringify(jwtUser));
    console.log('middleware.ts, user:', jwtUser)

    const resp = NextResponse.next({
      request: {
        headers
      }
    });    

    //refresh jwt
    const refreshJwtToken = await Calc.getJoseJwtToken(jwtUser);

    resp.cookies.set('jwt', refreshJwtToken, {
      httpOnly: true,
      secure: true
    })

    return resp;
}


// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      // '/about',
      // '/user/(.*)',
      // '/api/user/(.*)',
      '/biz/(.*)',     
      '/api/biz/(.*)',
    ],
}