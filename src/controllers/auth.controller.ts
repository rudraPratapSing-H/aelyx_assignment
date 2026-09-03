import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User, Student } from '@prisma/client';
import { HashService } from '../services/hash.service';
import jwt from 'jsonwebtoken';
import { loginPayload, JwtPayload } from '../app/types/types';

const prisma = new PrismaClient();

export class AuthController {
  async login(req: NextRequest) {
    try {
      const { email, password } = await req.json() as loginPayload;

      if (!email || !password) {
        return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
      }

      let account: User | Student | null = null;
      let role = '';

      // 1. Search in the User table (Admins & Teachers)
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        account = user;
        role = user.role; // e.g. ADMIN or TEACHER
      } else {
        // 2. If no user found, search in the Student table
        const student = await prisma.student.findUnique({
          where: { email },
        });

        if (student) {
          account = student;
          role = 'STUDENT';
        }
      }

      // 3. If neither is found, return 401
      if (!account) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      // 4. Verify password using our new HashService
      const isPasswordValid = await HashService.comparePassword(password, account.passwordHash);

      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      // 5. Generate JWT
      const secret = process.env.JWT_SECRET || 'your-super-secret-key';
      
      const payload: JwtPayload = { 
        id: account.id, 
        role: role 
      };

      const token = jwt.sign(payload, secret, { expiresIn: '1d' });

      const response = NextResponse.json({
        message: 'Login successful',
        token,
        user: {
          id: account.id,
          email: account.email,
          role: role,
        }
      }, { status: 200 });

      // Set HTTP-Only cookie for the frontend
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;

    } catch (error: any) {
      console.error('Login error:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
}
