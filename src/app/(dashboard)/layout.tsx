import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/app/types/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let role = 'UNKNOWN';

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'your-super-secret-key';
      const decoded = jwt.verify(token, secret) as JwtPayload;
      role = decoded.role;
    } catch (e) {
      // invalid token
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar role={role} />
      <div className="flex flex-col">
        <TopNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
