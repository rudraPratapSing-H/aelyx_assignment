import { UserService } from './user.service';
import { StudentService } from './student.service';
import { AttendanceService } from './attendance.service';
import { ClassService } from './class.service';

export class DashboardService {
  private userService: UserService;
  private studentService: StudentService;
  private attendanceService: AttendanceService;
  private classService: ClassService;

  constructor() {
    this.userService = new UserService();
    this.studentService = new StudentService();
    this.attendanceService = new AttendanceService();
    this.classService = new ClassService();
  }

  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  async getAllStudents() {
    return this.studentService.getAllStudents();
  }

  async getAllAttendances() {
    return this.attendanceService.getAllAttendances();
  }

  async getAllClasses() {
    return this.classService.getAllClasses();
  }
}
