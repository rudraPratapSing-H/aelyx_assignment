import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, UserPlus, Users, GraduationCap } from 'lucide-react';

export default function AdminHubPage() {
  const actions = [
    {
      title: 'View Dashboard',
      description: 'See the overview of system statistics and metrics.',
      icon: <LayoutDashboard className="h-8 w-8 text-primary mb-4" />,
      href: '/',
    },
    {
      title: 'Add Teacher',
      description: 'Create a new teacher account and assign them to classes.',
      icon: <UserPlus className="h-8 w-8 text-blue-500 mb-4" />,
      href: '/admin/add-teacher',
    },
    {
      title: 'Add Students',
      description: 'Enroll new students into the School ERP.',
      icon: <Users className="h-8 w-8 text-green-500 mb-4" />,
      href: '/admin/add-student',
    },
    {
      title: 'Add Class',
      description: 'Create a new class and manage its curriculum.',
      icon: <GraduationCap className="h-8 w-8 text-orange-500 mb-4" />,
      href: '/admin/add-class',
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Hub</h2>
      </div>
      <p className="text-muted-foreground">
        Welcome! Choose an action below to get started.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        {actions.map((action, index) => (
          <Link href={action.href} key={index} className="block transition-transform hover:scale-105 active:scale-95">
            <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-col items-center text-center pb-2">
                {action.icon}
                <CardTitle>{action.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
