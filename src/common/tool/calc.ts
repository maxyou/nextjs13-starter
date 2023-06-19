import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export async function sign(payload: string, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // one hour

    return new SignJWT({ payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}

export interface JoseJwtParseResult {
    code: number;
    message: string;
    jwtPayload?: JWTPayload;
}

export async function joseVerify(token: string, secret: string): Promise<JoseJwtParseResult> {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        return {
            code: 0,
            message: "success",
            jwtPayload: payload,
        };
    } catch (error) {
        // Return an error response with a code and message
        return {
            code: -1,
            message: "failed or expired",
            // message: JSON.stringify(error),
        };
    }
}

export function isTokenExpired(decodedToken: JWTPayload): boolean {

    const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds

    if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
        // Token has expired
        return true;
    }
    return false;
}


export function parseUrlQuery(url: string) {
    const query: { [key: string]: string } = {};
    if (url.indexOf('?') > -1) {
        const queryStr = url.split('?')[1];
        queryStr.split('&').forEach(q => {
            const [key, value] = q.split('=');
            query[key] = value;
        });
    }
    return query;
}