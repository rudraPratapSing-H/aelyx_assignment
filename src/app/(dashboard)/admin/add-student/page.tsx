'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AddStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    guardianContact: '',
    classId: 'unassigned', // default to unassigned
  });

  useEffect(() => {
    // Fetch classes for the dropdown
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes');
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch (err) {
        console.error('Failed to fetch classes', err);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClassChange = (value: string) => {
    setFormData((prev) => ({ ...prev, classId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        classId: formData.classId === 'unassigned' ? undefined : formData.classId,
      };

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('A student with this email or roll number already exists.');
        }
        if (response.status === 400) {
          throw new Error('Please fill in all required fields.');
        }
        throw new Error(data.error || data.message || 'Failed to create student.');
      }

      toast.success('Student created successfully!');
      router.push('/admin'); // Redirect back to Hub
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Add Student</h2>
        <p className="text-muted-foreground">Enroll a new student.</p>
      </div>
      
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Fill out the details below to enroll a student.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" name="password" required value={formData.password} onChange={handleChange} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input id="rollNumber" name="rollNumber" required value={formData.rollNumber} onChange={handleChange} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="guardianContact">Guardian Contact *</Label>
                <Input id="guardianContact" name="guardianContact" required value={formData.guardianContact} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="class">Assign Class</Label>
              <Select value={formData.classId} onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class">
                    {formData.classId && formData.classId !== 'unassigned' && classes.length > 0 
                      ? classes.find(c => c.id === formData.classId)?.name 
                      : 'Select a class'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/admin')}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Student'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
