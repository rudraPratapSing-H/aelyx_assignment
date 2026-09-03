import { NextRequest } from 'next/server';
import { ClassController } from '@/controllers/class.controller';
import { withAuth } from '@/lib/withAuth';

const classController = new ClassController();

// ADMIN and TEACHER can view classes
export const GET = withAuth(async (request: NextRequest) => {
  return classController.getAll(request);
}, ['ADMIN', 'TEACHER']);

// Only ADMIN can create classes
export const POST = withAuth(async (request: NextRequest) => {
  return classController.create(request);
}, ['ADMIN']);
