import { Student } from '@prisma/client';
import { StudentRepository } from '../repositories/student.repository';
import { HashService } from './hash.service';
import { CreateStudentPayload, UpdateStudentPayload } from '../app/types/types';

export class StudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async getStudentById(id: string): Promise<Student | null> {
    return this.studentRepository.findById(id);
  }

  async getStudentDashboardData(id: string) {
    return this.studentRepository.getStudentDashboardData(id);
  }

  async createStudent(data: CreateStudentPayload): Promise<Student> {
    // Hash the plain text password using the HashService
    const hashedPassword = await HashService.hashPassword(data.password);
    
    // Check if student with email already exists
    const existingEmail = await this.studentRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Student with this email already exists');
    }

    // Check if student with rollNumber already exists
    const existingRoll = await this.studentRepository.findByRollNumber(data.rollNumber);
    if (existingRoll) {
      throw new Error('Student with this roll number already exists');
    }

    const { password, ...studentData } = data;

    return this.studentRepository.create({
      ...studentData,
      passwordHash: hashedPassword
    });
  }

  async updateStudent(id: string, data: UpdateStudentPayload & { password?: string }): Promise<Student> {
    const { password, ...updateData } = data;
    
    // We cannot pass strict types directly here because we need to optionally add passwordHash
    const payload: any = { ...updateData };

    if (password) {
      payload.passwordHash = await HashService.hashPassword(password);
    }

    return this.studentRepository.update(id, payload);
  }

  async deleteStudent(id: string): Promise<Student> {
    return this.studentRepository.delete(id);
  }
}
