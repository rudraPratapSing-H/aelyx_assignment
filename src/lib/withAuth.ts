import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../app/types/types';

type NextRouteHandler = (request: NextRequest, props: any) => Promise<NextResponse> | NextResponse;

/**
 * A Higher-Order Function (wrapper) that acts like a middleware for Next.js API Routes.
 * It verifies the JWT and optionally checks for required roles before calling the actual route handler.
 */
export function withAuth(handler: NextRouteHandler, allowedRoles?: string[]) {
  return async (req: NextRequest, props: any) => {
    let token = null;

    // 1. Try to get token from Authorization header (Bearer token)
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // 2. Try to get token from cookies (HttpOnly cookie for the web frontend)
    if (!token) {
      token = req.cookies.get('token')?.value || null;
    }

    if (!token) {
      return NextResponse.json({ message: 'No token provided or invalid format' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'your-super-secret-key';

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ message: 'Forbidden: You do not have the required permissions' }, { status: 403 });
      }

      // Inject user ID and Role into headers so controllers can read it
      req.headers.set('x-user-id', String(decoded.id));
      req.headers.set('x-user-role', String(decoded.role));

      // Token is valid and roles match, proceed to the actual route handler!
      return handler(req, props);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 });
    }
  };
}
