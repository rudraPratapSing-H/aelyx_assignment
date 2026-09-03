import { NextRequest } from 'next/server';
import { AttendanceController } from '@/controllers/attendance.controller';
import { withAuth } from '@/lib/withAuth';

const attendanceController = new AttendanceController();

// Both ADMIN and TEACHER can mark attendance
export const POST = withAuth(async (request: NextRequest) => {
  return attendanceController.markBulk(request);
}, ['ADMIN', 'TEACHER']);
