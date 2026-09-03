import { UserTable } from '@/components/users/UserTable';
import { getDashboardUsers } from '@/lib/api/dashboard';

import { AddUserButton } from '@/components/users/AddUserButton';

export default async function UsersPage() {
  // Fetch data on the server
  const users = await getDashboardUsers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff</h2>
          <p className="text-muted-foreground">
            Manage system administrators and teachers.
          </p>
        </div>
        <AddUserButton />
      </div>
      <UserTable users={users} />
    </div>
  );
}
