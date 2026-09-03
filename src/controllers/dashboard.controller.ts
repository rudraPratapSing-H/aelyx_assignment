import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getAllUsers(req: NextRequest) {
    try {
      const users = await this.dashboardService.getAllUsers();
      // Omit passwordHash before sending to client
      const sanitizedUsers = users.map(({ passwordHash, ...rest }) => rest);
      return NextResponse.json(sanitizedUsers, { status: 200 });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async getAllStudents(req: NextRequest) {
    try {
      const students = await this.dashboardService.getAllStudents();
      // Omit passwordHash
      const sanitizedStudents = students.map(({ passwordHash, ...rest }) => rest);
      return NextResponse.json(sanitizedStudents, { status: 200 });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async getAllAttendances(req: NextRequest) {
    try {
      const attendances = await this.dashboardService.getAllAttendances();
      return NextResponse.json(attendances, { status: 200 });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }
}
