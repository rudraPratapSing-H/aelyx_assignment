import { NextRequest } from 'next/server';
import { ClassController } from '@/controllers/class.controller';
import { withAuth } from '@/lib/withAuth';

const classController = new ClassController();

// Only TEACHER can access this specific route to get their own classes
export const GET = withAuth(async (request: NextRequest) => {
  return classController.getMyClasses(request);
}, ['TEACHER']);
