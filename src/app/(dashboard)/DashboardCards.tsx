'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, GraduationCap, CalendarCheck, BookOpen, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import type { DashboardUser, DashboardStudent, DashboardAttendance, DashboardClass } from '@/lib/api/dashboard';

type DashboardCardsProps = {
  users: DashboardUser[];
  students: DashboardStudent[];
  attendances: DashboardAttendance[];
  classes: DashboardClass[];
};

type ModalState = 'users' | 'students' | 'classes' | 'attendances' | null;

export function DashboardCards({ users, students, attendances, classes }: DashboardCardsProps) {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    setIsDeleting(true);
    try {
      const endpoint = type === 'users' ? `/api/users/${id}` 
                     : type === 'students' ? `/api/students/${id}`
                     : type === 'classes' ? `/api/classes/${id}`
                     : null;

      if (!endpoint) throw new Error('Invalid delete type');

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete record');
      }
      
      toast.success('Record deleted successfully');
      router.refresh();
      // We don't close the modal, let the refresh update the data (or we could optimistically update)
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderTableContent = () => {
    switch (modalState) {
      case 'users':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/admin/edit-user/${user.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" disabled={isDeleting} onClick={() => handleDelete('users', user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case 'students':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/admin/edit-student/${student.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" disabled={isDeleting} onClick={() => handleDelete('students', student.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case 'classes':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Teacher In-Charge</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map(cls => {
                const teacher = users.find(u => u.id === cls.teacherId);
                return (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{teacher ? teacher.name : 'Unknown Teacher'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => router.push(`/admin/edit-class/${cls.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" disabled={isDeleting} onClick={() => handleDelete('classes', cls.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );
      case 'attendances':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.map(att => (
                <TableRow key={att.id}>
                  <TableCell className="font-medium">{new Date(att.date).toLocaleDateString()}</TableCell>
                  <TableCell>{att.student?.name || att.studentId}</TableCell>
                  <TableCell>{att.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setModalState('students')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mb-4">Enrolled students</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); router.push('/students'); }}>
              Go to Students Page
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setModalState('users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mb-4">Admins and Teachers</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); router.push('/users'); }}>
              Go to Staff Page
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setModalState('classes')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground mb-4">Active class sections</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); router.push('/classes'); }}>
              Go to Classes Page
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setModalState('attendances')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendances.length}</div>
            <p className="text-xs text-muted-foreground mb-4">Total records across classes</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); router.push('/attendance'); }}>
              Go to Attendance Page
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalState !== null} onOpenChange={(open) => !open && setModalState(null)}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">Manage {modalState}</DialogTitle>
            <DialogDescription>
              View, edit, or delete the {modalState} currently in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {renderTableContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
