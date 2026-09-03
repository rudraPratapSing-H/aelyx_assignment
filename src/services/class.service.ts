import { Class } from '@prisma/client';
import { ClassRepository } from '../repositories/class.repository';
import { CreateClassPayload, UpdateClassPayload } from '../app/types/types';

export class ClassService {
  private classRepository: ClassRepository;

  constructor() {
    this.classRepository = new ClassRepository();
  }

  async getAllClasses(): Promise<Class[]> {
    return this.classRepository.findAll();
  }

  async getClassById(id: string): Promise<Class | null> {
    return this.classRepository.findById(id);
  }

  async getClassesByTeacher(teacherId: string) {
    return this.classRepository.findByTeacherId(teacherId);
  }

  async createClass(data: CreateClassPayload): Promise<Class> {
    return this.classRepository.create({
      name: data.name,
      teacherId: data.teacherId
    });
  }

  async updateClass(id: string, data: UpdateClassPayload): Promise<Class> {
    return this.classRepository.update(id, data);
  }

  async deleteClass(id: string): Promise<Class> {
    return this.classRepository.delete(id);
  }
}
