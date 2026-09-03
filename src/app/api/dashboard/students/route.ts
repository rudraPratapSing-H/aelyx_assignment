import { NextRequest } from 'next/server';
import { DashboardController } from '@/controllers/dashboard.controller';
import { withAuth } from '@/lib/withAuth';

const dashboardController = new DashboardController();

export const GET = withAuth(async (request: NextRequest) => {
  return dashboardController.getAllStudents(request);
}, ['ADMIN']);
