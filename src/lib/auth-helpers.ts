import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../app/types/types';

/**
 * Validates a JWT token from a NextRequest and optionally checks the user's role.
 * @param request The Next.js request object
 * @param allowedRoles An optional array of roles that are permitted (e.g. ['ADMIN', 'TEACHER'])
 * @returns An object containing either the decoded `user` or an `error` with a status code
 */
export function checkAuth(request: NextRequest, allowedRoles?: string[]) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided or invalid format', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'your-super-secret-key';

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return { error: 'Forbidden: You do not have the required permissions', status: 403 };
    }

    return { user: decoded };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 403 };
  }
}
