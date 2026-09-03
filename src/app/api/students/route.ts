import { NextRequest } from 'next/server';
import { StudentController } from '@/controllers/student.controller';
import { withAuth } from '@/lib/withAuth';

const studentController = new StudentController();

// ADMIN and TEACHER can view students
export const GET = withAuth(async (request: NextRequest) => {
  return studentController.getAll(request);
}, ['ADMIN', 'TEACHER']);

// Only ADMIN can create students
export const POST = withAuth(async (request: NextRequest) => {
  return studentController.create(request);
}, ['ADMIN']);
