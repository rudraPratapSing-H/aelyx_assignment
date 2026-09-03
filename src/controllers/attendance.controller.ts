import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '../services/attendance.service';
import { BulkAttendancePayload } from '../app/types/types';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  async markBulk(req: NextRequest) {
    try {
      const body = await req.json() as BulkAttendancePayload;
      
      if (!body.date || !body.records || !Array.isArray(body.records)) {
        return NextResponse.json({ error: 'Missing or invalid fields. Require date and an array of records.' }, { status: 400 });
      }

      const result = await this.attendanceService.markBulkAttendance(body);
      
      return NextResponse.json({ 
        message: 'Attendance marked successfully', 
        count: result.count 
      }, { status: 201 });
      
    } catch (error: unknown) {
      console.error("Mark Attendance Error:", error);
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async getAttendanceHistory(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const classId = params.id;
      const userId = req.headers.get('x-user-id');
      const userRole = req.headers.get('x-user-role');
      
      if (!userId || !userRole) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const classAttendance = await this.attendanceService.getClassAttendance(classId, userId, userRole);

      if (!classAttendance) {
        return NextResponse.json({ error: 'Class not found or you are not authorized to view this class.' }, { status: 403 });
      }

      return NextResponse.json(classAttendance, { status: 200 });
      
    } catch (error: unknown) {
      console.error("Get Attendance History Error:", error);
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }
}
