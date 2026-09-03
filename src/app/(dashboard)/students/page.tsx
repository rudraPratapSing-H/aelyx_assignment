import { StudentTable } from '@/components/students/StudentTable';
import { getDashboardStudents, getDashboardClasses } from '@/lib/api/dashboard';
import { AddStudentButton } from '@/components/students/AddStudentButton';

export default async function StudentsPage() {
  // Fetch data on the server
  const [students, classes] = await Promise.all([
    getDashboardStudents(),
    getDashboardClasses()
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage enrolled students across all classes.
          </p>
        </div>
        <AddStudentButton classes={classes} />
      </div>
      <StudentTable students={students} classes={classes} />
    </div>
  );
}
