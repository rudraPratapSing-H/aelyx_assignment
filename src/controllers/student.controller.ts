import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '../services/student.service';
import { CreateStudentPayload, UpdateStudentPayload } from '../app/types/types';

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  async getAll(req: NextRequest) {
    try {
      const students = await this.studentService.getAllStudents();
      // Omit passwordHash before sending to client
      const sanitizedStudents = students.map(({ passwordHash, ...rest }) => rest);
      return NextResponse.json(sanitizedStudents, { status: 200 });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async getById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const student = await this.studentService.getStudentById(id);

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const { passwordHash, ...sanitizedStudent } = student;
      return NextResponse.json(sanitizedStudent, { status: 200 });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async create(req: NextRequest) {
    try {
      const body = await req.json() as CreateStudentPayload;

      if (!body.name || !body.email || !body.password || !body.rollNumber) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const newStudent = await this.studentService.createStudent(body);
      const { passwordHash, ...sanitizedStudent } = newStudent;

      return NextResponse.json(sanitizedStudent, { status: 201 });
    } catch (error: unknown) {
      console.error("Create Student Error:", error);
      const err = error instanceof Error ? error : new Error('Internal server error');
      if (err.message === 'Student with this email already exists' || err.message === 'Student with this roll number already exists') {
        return NextResponse.json({ error: err.message }, { status: 409 });
      }
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json() as UpdateStudentPayload;

      const updatedStudent = await this.studentService.updateStudent(id, body);
      const { passwordHash, ...sanitizedStudent } = updatedStudent;

      return NextResponse.json(sanitizedStudent, { status: 200 });
    } catch (error: unknown) {
      console.error("Update Student Error:", error);
      const msg = error instanceof Error ? error.message : 'Failed to update student';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async delete(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      await this.studentService.deleteStudent(id);
      return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
      console.error("Delete Student Error:", error);
      const msg = error instanceof Error ? error.message : 'Failed to delete student';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }
}
