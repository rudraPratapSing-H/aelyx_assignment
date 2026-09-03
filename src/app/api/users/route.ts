import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/user.controller';
import { withAuth } from '@/lib/withAuth';

const userController = new UserController();

export const GET = withAuth(async (request: NextRequest) => {
  return userController.getAll(request);
}, ['ADMIN', 'TEACHER']);

export const POST = withAuth(async (request: NextRequest) => {
  return userController.create(request);
}, ['ADMIN']);
