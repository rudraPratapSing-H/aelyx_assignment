import { NextRequest } from 'next/server';
import { StudentController } from '@/controllers/student.controller';
import { withAuth } from '@/lib/withAuth';

const studentController = new StudentController();

// ADMIN and TEACHER can view a student
export const GET = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return studentController.getById(request, { params });
}, ['ADMIN', 'TEACHER']);

// Only ADMIN can update a student
export const PUT = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return studentController.update(request, { params });
}, ['ADMIN']);

// Only ADMIN can delete a student
export const DELETE = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return studentController.delete(request, { params });
}, ['ADMIN']);
