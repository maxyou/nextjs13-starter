import { NextResponse, NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Calc } from '@/common';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { JwtUser } from '@/common/tool/calc';

const prisma = new PrismaClient();


export async function POST(request: Request) {
  
  console.log(`receiver POST`);

}
