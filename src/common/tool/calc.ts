import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// export async function sign(payload: string, secret: string): Promise<string> {
//     const iat = Math.floor(Date.now() / 1000);
//     const exp = iat + 60 * 60; // one hour

//     return new SignJWT({ payload })
//         .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
//         .setExpirationTime(exp)
//         .setIssuedAt(iat)
//         .setNotBefore(iat)
//         .sign(new TextEncoder().encode(secret));
// }

export interface JWTPayloadWithUser extends JWTPayload {
    jwtUser: JwtUser;
}

export interface JoseJwtParseResult {
    code: number;
    message: string;
    jwtPayloadWithUser?: JWTPayloadWithUser;
}

export async function joseVerify(token: string, secret: string): Promise<JoseJwtParseResult> {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        return {
            code: 0,
            message: "success",
            jwtPayloadWithUser: payload as JWTPayloadWithUser,
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

export interface JwtUser {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    from: string;
    // sub?: string;
}

export async function getJoseJwtToken(jwtUser: JwtUser): Promise<string> {

    const secret = process.env.JWT_SECRET as string;   

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 31 * 12 * 100; // one hundred years
    // const exp = iat + 60 * 60 * 24 * 31 * 12; // one year
    // const exp = iat + 60 * 60 * 24 * 31; // one month
    // const exp = iat + 60 * 60 * 24; // one day
    // const exp = iat + 60 * 60; // one hour
    // const exp = iat + 60; // one minute

    const tokenBeforeSign = new SignJWT({ jwtUser })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat);
    console.log(`using jose, tokenBeforeSign:${JSON.stringify(tokenBeforeSign)}`);
    const token = await tokenBeforeSign.sign(new TextEncoder().encode(secret));
    console.log(`using jose, token:${JSON.stringify(token)}`);

    return token;
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