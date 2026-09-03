import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. If no token and trying to access protected route -> redirect to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If token exists, verify it using 'jose' (jsonwebtoken doesn't work in Edge Runtime)
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key');
      const { payload } = await jwtVerify(token, secret);

      // Extract role from payload
      const role = payload.role as string;
      const isAdmin = role === 'ADMIN';
      const isTeacher = role === 'TEACHER';
      const isStudent = role === 'STUDENT';
      
      const pathname = request.nextUrl.pathname;
      const isAdminRoute = pathname.startsWith('/admin');
      const isTeacherRoute = pathname.startsWith('/teacher');
      const isStudentRoute = pathname.startsWith('/student');

      // If they are not ADMIN, TEACHER, or STUDENT, redirect to login
      if (!isAdmin && !isTeacher && !isStudent && !isLoginPage) {
        return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
      }

      // Ensure TEACHER cannot access /admin
      if (isTeacher && isAdminRoute) {
        return NextResponse.redirect(new URL('/teacher', request.url));
      }

      // Ensure STUDENT cannot access /admin or /teacher
      if (isStudent && (isAdminRoute || isTeacherRoute || pathname === '/')) {
        return NextResponse.redirect(new URL('/student', request.url));
      }

      // If user is already logged in and tries to go to /login, redirect to their Hub
      if (isLoginPage) {
        if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
        if (isTeacher) return NextResponse.redirect(new URL('/teacher', request.url));
        if (isStudent) return NextResponse.redirect(new URL('/student', request.url));
      }
      
      // If Teacher goes to root dashboard (which is currently admin stats), redirect them to /teacher
      if (isTeacher && pathname === '/') {
        return NextResponse.redirect(new URL('/teacher', request.url));
      }

    } catch (error) {
      // Token is invalid/expired. Delete the cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
