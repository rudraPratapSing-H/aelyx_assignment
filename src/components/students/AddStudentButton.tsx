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
import { DashboardClass } from '@/lib/api/dashboard';

interface AddStudentButtonProps {
  classes: DashboardClass[];
}

export function AddStudentButton({ classes }: AddStudentButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    guardianContact: '',
    password: '',
    classId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to add student');

      toast.success('Student added successfully');
      setIsOpen(false);
      setForm({ name: '', email: '', rollNumber: '', guardianContact: '', password: '', classId: '' }); // reset
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
        Add Student
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Create a new student account here.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label>Assign Class</Label>
                <Select value={form.classId || ''} onValueChange={(val: any) => setForm({...form, classId: val})} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class">
                      {form.classId ? (classes.find(c => c.id === form.classId)?.name ?? 'Select a class') : 'Select a class'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
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
                  value={form.rollNumber} 
                  onChange={(e) => setForm({...form, rollNumber: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guardianContact">Guardian Contact</Label>
                <Input 
                  id="guardianContact" 
                  value={form.guardianContact} 
                  onChange={(e) => setForm({...form, guardianContact: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={form.password} 
                  onChange={(e) => setForm({...form, password: e.target.value})} 
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Student'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
