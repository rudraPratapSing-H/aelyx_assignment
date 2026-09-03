export interface JwtPayload {
    id: string;
    role: string;
    [key: string]: unknown;
}

export interface loginPayload {
    email: string;
    password: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TEACHER';
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'TEACHER';
  password?: string;
  phone?: string;
  subject?: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  guardianContact: string;
  classId: string;
}

export interface UpdateStudentPayload {
  name?: string;
  email?: string;
  password?: string;
  rollNumber?: string;
  guardianContact?: string;
  classId?: string;
}

export interface CreateClassPayload {
  name: string;
  teacherId: string;
}

export interface UpdateClassPayload {
  name?: string;
  teacherId?: string;
}

export interface MarkAttendanceRecord {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface BulkAttendancePayload {
  date: string; // ISO Date String
  records: MarkAttendanceRecord[];
}