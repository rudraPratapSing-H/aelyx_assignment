import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class AttendanceRepository {
  async findAll() {
    return prisma.attendance.findMany({
      include: { 
        student: {
          include: { class: true }
        }
      }
    });
  }

  async upsertMany(data: Prisma.AttendanceCreateManyInput[]): Promise<{ count: number }> {
    const operations = data.map((record) => {
      return prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date: record.date as Date,
          },
        },
        update: {
          status: record.status,
        },
        create: {
          studentId: record.studentId,
          date: record.date as Date,
          status: record.status,
        },
      });
    });

    await prisma.$transaction(operations);
    return { count: data.length };
  }

  async findAttendanceByClassAndTeacher(classId: string, userId: string, userRole: string) {
    const whereClause: any = { id: classId };
    if (userRole !== 'ADMIN') {
      whereClause.teacherId = userId;
    }

    return prisma.class.findFirst({
      where: whereClause,
      include: {
        students: {
          include: {
            attendances: {
              orderBy: { date: 'desc' }
            }
          }
        }
      }
    });
  }
}
