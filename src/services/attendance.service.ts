import { AttendanceRepository } from '../repositories/attendance.repository';
import { BulkAttendancePayload } from '../app/types/types';
import { Prisma } from '@prisma/client';

export class AttendanceService {
  private attendanceRepository: AttendanceRepository;

  constructor() {
    this.attendanceRepository = new AttendanceRepository();
  }

  async getAllAttendances() {
    return this.attendanceRepository.findAll();
  }

  async markBulkAttendance(payload: BulkAttendancePayload) {
    const attendanceDate = new Date(payload.date);
    
    // Ensure date is valid
    if (isNaN(attendanceDate.getTime())) {
      throw new Error('Invalid date format');
    }

    // Map the payload to Prisma's expected format
    const createManyData: Prisma.AttendanceCreateManyInput[] = payload.records.map(record => ({
      date: attendanceDate,
      studentId: record.studentId,
      status: record.status
    }));

    return this.attendanceRepository.upsertMany(createManyData);
  }

  async getClassAttendance(classId: string, userId: string, userRole: string) {
    return this.attendanceRepository.findAttendanceByClassAndTeacher(classId, userId, userRole);
  }
}
