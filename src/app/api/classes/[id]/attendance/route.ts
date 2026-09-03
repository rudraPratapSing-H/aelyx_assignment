import { NextRequest } from 'next/server';
import { AttendanceController } from '@/controllers/attendance.controller';
import { withAuth } from '@/lib/withAuth';

const attendanceController = new AttendanceController();

// Only TEACHER (and ADMIN) can view attendance history for a specific class
export const GET = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return attendanceController.getAttendanceHistory(request, { params });
}, ['ADMIN', 'TEACHER']);
