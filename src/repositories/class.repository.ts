import { PrismaClient, Class, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ClassRepository {
  async findAll(): Promise<Class[]> {
    return prisma.class.findMany({
      include: {
        teacher: {
          select: { id: true, name: true, email: true, role: true }
        },
        students: true
      }
    });
  }

  async findById(id: string): Promise<Class | null> {
    return prisma.class.findUnique({
      where: { id },
      include: {
        teacher: {
          select: { id: true, name: true, email: true, role: true }
        },
        students: true
      }
    });
  }

  async findByTeacherId(teacherId: string): Promise<Class[]> {
    return prisma.class.findMany({
      where: { teacherId },
      include: {
        students: true
      }
    });
  }

  async create(data: Prisma.ClassUncheckedCreateInput): Promise<Class> {
    return prisma.class.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ClassUncheckedUpdateInput): Promise<Class> {
    return prisma.class.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Class> {
    return prisma.class.delete({
      where: { id },
    });
  }
}
