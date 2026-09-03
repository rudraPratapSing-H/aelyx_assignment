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
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { DashboardClass, DashboardUser } from '@/lib/api/dashboard';

interface ClassTableProps {
  classes: DashboardClass[];
  teachers: DashboardUser[];
}

export function ClassTable({ classes, teachers }: ClassTableProps) {
  const router = useRouter();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [editingClass, setEditingClass] = useState<DashboardClass | null>(null);
  const [editForm, setEditForm] = useState({ name: '', teacherId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/classes/${deletingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete class');
      
      toast.success('Class deleted successfully');
      setDeletingId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (cls: DashboardClass) => {
    setEditingClass(cls);
    setEditForm({
      name: cls.name,
      teacherId: cls.teacherId,
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (!res.ok) throw new Error('Failed to update class');

      toast.success('Class updated successfully');
      setEditingClass(null);
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
              <TableHead>Class Name</TableHead>
              <TableHead>Assigned Teacher</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No classes found.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium text-primary">{cls.name}</TableCell>
                  <TableCell>{cls.teacher?.name || 'Unassigned'}</TableCell>
                  <TableCell>{cls.students?.length || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'h-8 w-8 p-0' })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(cls)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(cls.id)}>
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
              This will permanently delete the class. Any students assigned to this class will become "Unassigned".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingClass} onOpenChange={(open) => !open && setEditingClass(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Make changes to the class details here.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name</Label>
                <Input 
                  id="name" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label>Assigned Teacher</Label>
                <Select value={editForm.teacherId} onValueChange={(val) => setEditForm({...editForm, teacherId: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingClass(null)} disabled={isSubmitting}>Cancel</Button>
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
