import { DashboardService } from '@/services/dashboard.service';
import { User, Student, Attendance, Class } from '@prisma/client';

// We can instantiate the service here since this file will only be used in Server Components
const dashboardService = new DashboardService();

// Define strict return types for our Server Components
export type DashboardUser = Omit<User, 'passwordHash'>;
export type DashboardStudent = Omit<Student, 'passwordHash'> & { class?: Class | null };
export type DashboardAttendance = Attendance & { student?: DashboardStudent | null };
export type DashboardClass = Class & {
  teacher?: { id: string; name: string; email: string };
  students?: any[];
};

export async function getDashboardUsers(): Promise<DashboardUser[]> {
  const users = await dashboardService.getAllUsers();
  return users.map(({ passwordHash, ...rest }) => rest);
}

export async function getDashboardStudents(): Promise<DashboardStudent[]> {
  const students = await dashboardService.getAllStudents();
  return students.map(({ passwordHash, ...rest }) => rest);
}

export async function getDashboardAttendances(): Promise<DashboardAttendance[]> {
  const attendances = await dashboardService.getAllAttendances();
  return attendances;
}

export async function getDashboardClasses(): Promise<DashboardClass[]> {
  const classes = await dashboardService.getAllClasses();
  return classes;
}

export type ClassDaySummary = {
  id: string;
  date: string;
  className: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  records: DashboardAttendance[];
};

export async function getClassDayAttendanceSummary(): Promise<ClassDaySummary[]> {
  const attendances = await getDashboardAttendances();
  
  const grouped = attendances.reduce((acc, curr) => {
    // Group by Date + Class
    const dateStr = new Date(curr.date).toISOString().split('T')[0];
    const className = curr.student?.class?.name || 'Unassigned';
    const compositeKey = `${dateStr}_${className}`;
    
    if (!acc[compositeKey]) {
      acc[compositeKey] = {
        id: compositeKey,
        date: dateStr,
        className,
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        records: []
      };
    }
    
    acc[compositeKey].total += 1;
    acc[compositeKey].records.push(curr);
    
    if (curr.status === 'PRESENT') acc[compositeKey].present += 1;
    if (curr.status === 'ABSENT') acc[compositeKey].absent += 1;
    if (curr.status === 'LATE') acc[compositeKey].late += 1;
    
    return acc;
  }, {} as Record<string, ClassDaySummary>);
  
  // Sort by date descending, then by class name
  return Object.values(grouped).sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.className.localeCompare(b.className);
  });
}
