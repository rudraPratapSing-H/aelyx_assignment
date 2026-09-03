import Link from 'next/link';
import { Home, Users, GraduationCap, CalendarCheck, Settings, BookOpen } from 'lucide-react';

export function Sidebar({ role }: { role?: string }) {
  return (
    <aside className="w-64 border-r bg-muted/40 hidden md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span className="">School ERP</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            
            {role === 'ADMIN' && (
              <>
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Settings className="h-4 w-4" />
                  Admin Hub
                </Link>
                <Link
                  href="/classes"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BookOpen className="h-4 w-4" />
                  Classes
                </Link>
                <Link
                  href="/students"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <GraduationCap className="h-4 w-4" />
                  Students
                </Link>
                <Link
                  href="/attendance"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Attendance
                </Link>
                <Link
                  href="/users"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  Staff
                </Link>
              </>
            )}

            {role === 'STUDENT' && (
              <>
                <Link
                  href="/student"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  My Dashboard
                </Link>
              </>
            )}
            {role === 'TEACHER' && (
              <>
                <Link
                  href="/teacher"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Teacher Hub
                </Link>
              </>
            )}

          </nav>
        </div>
      </div>
    </aside>
  );
}
