import { ClassTable } from '@/components/classes/ClassTable';
import { AddClassButton } from '@/components/classes/AddClassButton';
import { getDashboardClasses, getDashboardUsers } from '@/lib/api/dashboard';

export default async function ClassesPage() {
  // Fetch data on the server
  const [classes, users] = await Promise.all([
    getDashboardClasses(),
    getDashboardUsers()
  ]);

  // Filter users to only get teachers for the dropdown
  const teachers = users.filter(user => user.role === 'TEACHER');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage school classes and assign teachers.
          </p>
        </div>
        <AddClassButton teachers={teachers} />
      </div>
      <ClassTable classes={classes} teachers={teachers} />
    </div>
  );
}
