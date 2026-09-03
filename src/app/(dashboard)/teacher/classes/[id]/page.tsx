import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/app/types/types';
import { ClassService } from '@/services/class.service';
import { AttendanceService } from '@/services/attendance.service';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MarkAttendanceTable } from './MarkAttendanceTable';

export default async function TeacherClassViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return <div>Unauthorized</div>;

  const secret = process.env.JWT_SECRET || 'your-super-secret-key';
  let decoded;
  try {
    decoded = jwt.verify(token, secret) as JwtPayload;
  } catch (e) {
    return <div>Unauthorized</div>;
  }
  
  const attendanceService = new AttendanceService();
  const classData = await attendanceService.getClassAttendance(resolvedParams.id, decoded.id.toString(), decoded.role);

  if (!classData) {
    return <div>Class not found.</div>;
  }

  // Ensure this teacher actually owns this class, or they are an admin
  if (classData.teacherId !== decoded.id && decoded.role !== 'ADMIN') {
    return <div className="p-8 text-red-500">Forbidden: You are not assigned to this class.</div>;
  }

  // Use the students array included in the classData
  const students: any[] = (classData as any).students || [];

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teacher" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{classData.name}</h2>
          <p className="text-muted-foreground">Manage your students and records for this class.</p>
        </div>
      </div>
      
      <MarkAttendanceTable 
        classId={classData.id} 
        className={classData.name} 
        students={students} 
      />
    </div>
  );
}
