import { NextRequest, NextResponse } from 'next/server';
import { ClassService } from '../services/class.service';
import { CreateClassPayload, UpdateClassPayload } from '../app/types/types';

export class ClassController {
  private classService: ClassService;

  constructor() {
    this.classService = new ClassService();
  }

  async getAll(req: NextRequest) {
    try {
      const classes = await this.classService.getAllClasses();
      return NextResponse.json(classes, { status: 200 });
    } catch (error: unknown) {
      console.error("Get All Classes Error:", error);
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async getMyClasses(req: NextRequest) {
    try {
      const userId = req.headers.get('x-user-id');
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const classes = await this.classService.getClassesByTeacher(userId);
      return NextResponse.json(classes, { status: 200 });
    } catch (error: unknown) {
      console.error("Get My Classes Error:", error);
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async getById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const classData = await this.classService.getClassById(id);
      
      if (!classData) {
        return NextResponse.json({ error: 'Class not found' }, { status: 404 });
      }
      
      return NextResponse.json(classData, { status: 200 });
    } catch (error: unknown) {
      console.error("Get Class By ID Error:", error);
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async create(req: NextRequest) {
    try {
      const body = await req.json() as CreateClassPayload;
      
      if (!body.name || !body.teacherId) {
        return NextResponse.json({ error: 'Missing required fields: name and teacherId' }, { status: 400 });
      }

      const newClass = await this.classService.createClass(body);
      
      return NextResponse.json(newClass, { status: 201 });
    } catch (error: unknown) {
      console.error("Create Class Error:", error);
      const err = error instanceof Error ? error : new Error('Internal server error');
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json() as UpdateClassPayload;
      
      const updatedClass = await this.classService.updateClass(id, body);
      
      return NextResponse.json(updatedClass, { status: 200 });
    } catch (error: unknown) {
      console.error("Update Class Error:", error);
      const msg = error instanceof Error ? error.message : 'Failed to update class';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async delete(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      await this.classService.deleteClass(id);
      return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
      console.error("Delete Class Error:", error);
      const msg = error instanceof Error ? error.message : 'Failed to delete class';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }
}
