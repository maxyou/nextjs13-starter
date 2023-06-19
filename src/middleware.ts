import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log('middleware.ts, request.url:', request.url)

    const headers = new Headers(request.headers);
    headers.set('middlewareSet', 'mydata');
    
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