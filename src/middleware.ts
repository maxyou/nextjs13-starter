import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { joseVerify } from "./common/tool/calc";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    console.log('middleware.ts, request.url:', request.url)

    const headers = new Headers(request.headers);
    // headers.set('middlewareSet', 'mydata');

    const cookies = headers.get('cookie')
    console.log('middleware.ts, cookies:', cookies)

    const parsedCookies = cookie.parse(cookies || '');

    // Access the specific item you want
    const jwtToken = parsedCookies.jwt;
    console.log('middleware.ts, jwtToken:', jwtToken)

    const secret = process.env.JWT_SECRET as string;

    const decodedToken = await joseVerify(jwtToken, secret);
    console.log('middleware.ts, decodedToken:', JSON.stringify(decodedToken))
    
    const resp = NextResponse.next({
      request: {
        headers
      }
    });

    return resp;
}


// See "Matching Paths" below to learn more
export const config = {
    matcher: '/user/server',
}