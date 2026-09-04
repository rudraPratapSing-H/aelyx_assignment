'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardUser } from '@/lib/api/dashboard';

interface AddClassButtonProps {
  teachers: DashboardUser[];
}

export function AddClassButton({ teachers }: AddClassButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    teacherId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to add class');

      toast.success('Class created successfully');
      setIsOpen(false);
      setForm({ name: '', teacherId: '' });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Class
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>Create a new class and assign a teacher.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name</Label>
                <Input 
                  id="name" 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Grade 10 - Biology"
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label>Assigned Teacher</Label>
                <Select value={form.teacherId || ''} onValueChange={(val: any) => setForm({...form, teacherId: val})} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher">
                      {form.teacherId ? (teachers.find(t => t.id === form.teacherId)?.name ?? 'Select a teacher') : 'Select a teacher'}
                    </SelectValue>
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
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Class'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
