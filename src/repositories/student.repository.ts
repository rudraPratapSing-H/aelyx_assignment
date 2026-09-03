import { PrismaClient, Student, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class StudentRepository {
  async findAll(): Promise<Student[]> {
    return prisma.student.findMany({
      include: { class: true }
    });
  }

  async findById(id: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { id },
      include: { class: true }
    });
  }

  async getStudentDashboardData(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: { 
        class: true,
        attendances: {
          orderBy: { date: 'desc' }
        }
      }
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { email },
    });
  }

  async findByRollNumber(rollNumber: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { rollNumber },
    });
  }

  async create(data: Prisma.StudentUncheckedCreateInput): Promise<Student> {
    return prisma.student.create({
      data,
    });
  }

  async update(id: string, data: Prisma.StudentUncheckedUpdateInput): Promise<Student> {
    return prisma.student.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Student> {
    return prisma.student.delete({
      where: { id },
    });
  }
}
