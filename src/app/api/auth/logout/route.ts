import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  
  // Clear the token cookie by setting its maxAge to 0
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
