import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/app/types/types';
import { ClassService } from '@/services/class.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default async function TeacherHubPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return <div>Unauthorized</div>;
  }

  const secret = process.env.JWT_SECRET || 'your-super-secret-key';
  const decoded = jwt.verify(token, secret) as JwtPayload;
  
  const classService = new ClassService();
  const myClasses = await classService.getClassesByTeacher(decoded.id.toString());

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Teacher Hub</h2>
      </div>
      <p className="text-muted-foreground">
        Welcome back! Here are the classes you are currently managing.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        {myClasses.map((cls) => (
          <Link href={`/teacher/classes/${cls.id}`} key={cls.id} className="block transition-transform hover:scale-105 active:scale-95">
            <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-col items-center text-center pb-2">
                <BookOpen className="h-8 w-8 text-primary mb-4" />
                <CardTitle>{cls.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {cls.students ? cls.students.length : 0} Students
                </div>
                <CardDescription className="text-xs">
                  Click to mark attendance
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}

        {myClasses.length === 0 && (
          <div className="col-span-full p-8 text-center border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">You have not been assigned to any classes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
