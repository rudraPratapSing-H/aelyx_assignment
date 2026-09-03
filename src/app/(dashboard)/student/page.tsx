import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/app/types/types';
import { StudentService } from '@/services/student.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarCheck, UserCheck, UserX, Clock } from 'lucide-react';

export default async function StudentDashboardPage() {
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

  if (decoded.role !== 'STUDENT') {
    return <div className="p-8 text-red-500">Forbidden: Student access only.</div>;
  }

  const studentService = new StudentService();
  const studentData = await studentService.getStudentDashboardData(decoded.id.toString());

  if (!studentData) {
    return <div>Student profile not found.</div>;
  }

  const attendances = studentData.attendances || [];
  const total = attendances.length;
  
  let present = 0;
  let absent = 0;
  let late = 0;

  attendances.forEach((record) => {
    if (record.status === 'PRESENT') present++;
    if (record.status === 'ABSENT') absent++;
    if (record.status === 'LATE') late++;
  });

  const attendancePercent = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {studentData.name}</h2>
      </div>
      <p className="text-muted-foreground">
        Class: {studentData.class?.name || 'Unassigned'} | Roll No: {studentData.rollNumber}
      </p>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendancePercent}%</div>
            <p className="text-xs text-muted-foreground">Across {total} recorded days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Present</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{present}</div>
            <p className="text-xs text-muted-foreground">Days attended on time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absent}</div>
            <p className="text-xs text-muted-foreground">Days missed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Late</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{late}</div>
            <p className="text-xs text-muted-foreground">Days arrived late</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Your daily attendance records sorted by date.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            record.status === 'PRESENT' ? 'default' : 
                            record.status === 'ABSENT' ? 'destructive' : 'secondary'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
