import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/user.service';
import { CreateUserPayload, UpdateUserPayload } from '../app/types/types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAll(req: NextRequest) {
    try {
      const users = await this.userService.getAllUsers();
      // Omit passwordHash before sending to client
      const sanitizedUsers = users.map(({ passwordHash, ...rest }) => rest);
      return NextResponse.json(sanitizedUsers, { status: 200 });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async getById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const { passwordHash, ...sanitizedUser } = user;
      return NextResponse.json(sanitizedUser, { status: 200 });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  async create(req: NextRequest) {
    try {
      const body = await req.json() as CreateUserPayload;
      
      if (!body.name || !body.email || !body.password || !body.role) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const newUser = await this.userService.createUser(body);
      const { passwordHash, ...sanitizedUser } = newUser;
      
      return NextResponse.json(sanitizedUser, { status: 201 });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Internal server error');
      if (err.message === 'User with this email already exists') {
        return NextResponse.json({ error: err.message }, { status: 409 });
      }
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json() as UpdateUserPayload;
      
      const updatedUser = await this.userService.updateUser(id, body);
      const { passwordHash, ...sanitizedUser } = updatedUser;
      
      return NextResponse.json(sanitizedUser, { status: 200 });
    } catch (error: unknown) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }

  async delete(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      await this.userService.deleteUser(id);
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
  }
}
