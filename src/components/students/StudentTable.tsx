'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { DashboardStudent, DashboardClass } from '@/lib/api/dashboard';

interface StudentTableProps {
  students: DashboardStudent[];
  classes: DashboardClass[];
}

export function StudentTable({ students, classes }: StudentTableProps) {
  const router = useRouter();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [editingStudent, setEditingStudent] = useState<DashboardStudent | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', rollNumber: '', guardianContact: '', password: '', classId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/students/${deletingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete student');
      
      toast.success('Student deleted successfully');
      setDeletingId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (student: DashboardStudent) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      guardianContact: student.guardianContact || '',
      classId: student.classId || '',
      password: '' // Keep empty unless they want to change it
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSubmitting(true);

    try {
      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        rollNumber: editForm.rollNumber,
        guardianContact: editForm.guardianContact,
        classId: editForm.classId || null,
      };
      
      if (editForm.password) {
        payload.password = editForm.password;
      }

      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update student');

      toast.success('Student updated successfully');
      setEditingStudent(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Guardian Contact</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.guardianContact || '-'}</TableCell>
                  <TableCell>{student.class?.name || 'Unassigned'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'h-8 w-8 p-0' })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(student)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(student.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the student and their attendance records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Make changes to the student's profile here.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label>Assign Class</Label>
                <Select value={editForm.classId} onValueChange={(val) => setEditForm({...editForm, classId: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input 
                  id="rollNumber" 
                  value={editForm.rollNumber} 
                  onChange={(e) => setEditForm({...editForm, rollNumber: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guardianContact">Guardian Contact</Label>
                <Input 
                  id="guardianContact" 
                  value={editForm.guardianContact} 
                  onChange={(e) => setEditForm({...editForm, guardianContact: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New Password (Optional)</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Leave blank to keep current password"
                  value={editForm.password} 
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingStudent(null)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
