import { getDashboardUsers, getDashboardStudents, getDashboardAttendances, getDashboardClasses } from '@/lib/api/dashboard';
import { DashboardCards } from './DashboardCards';

export default async function DashboardOverview() {
  const [users, students, attendances, classes] = await Promise.all([
    getDashboardUsers(),
    getDashboardStudents(),
    getDashboardAttendances(),
    getDashboardClasses(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here is a summary of the School ERP. Click any card to manage data.
        </p>
      </div>
      
      <DashboardCards 
        users={users} 
        students={students} 
        attendances={attendances} 
        classes={classes} 
      />
    </div>
  );
}
