import { NextRequest } from 'next/server';
import { ClassController } from '@/controllers/class.controller';
import { withAuth } from '@/lib/withAuth';

const classController = new ClassController();

// ADMIN and TEACHER can view a specific class
export const GET = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return classController.getById(request, { params });
}, ['ADMIN', 'TEACHER']);

// Only ADMIN can update a class
export const PUT = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return classController.update(request, { params });
}, ['ADMIN']);

// Only ADMIN can delete a class
export const DELETE = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return classController.delete(request, { params });
}, ['ADMIN']);
