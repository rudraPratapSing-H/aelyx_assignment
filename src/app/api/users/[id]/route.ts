import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/user.controller';
import { withAuth } from '@/lib/withAuth';

const userController = new UserController();

export const GET = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return userController.getById(request, { params });
}, ['ADMIN', 'TEACHER']);

export const PUT = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return userController.update(request, { params });
}, ['ADMIN']);

export const DELETE = withAuth(async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return userController.delete(request, { params });
}, ['ADMIN']);
