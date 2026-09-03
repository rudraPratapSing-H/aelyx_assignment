'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AddClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
  });

  useEffect(() => {
    // Fetch users and filter by TEACHER role for the dropdown
    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          // Filter to only show teachers
          setTeachers(data.filter((user: any) => user.role === 'TEACHER'));
        }
      } catch (err) {
        console.error('Failed to fetch teachers', err);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTeacherChange = (value: string) => {
    setFormData((prev) => ({ ...prev, teacherId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.teacherId) {
        throw new Error('Please select a teacher in charge.');
      }

      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Please fill in all required fields.');
        }
        if (response.status === 404) {
          throw new Error('Selected teacher not found.');
        }
        throw new Error(data.error || data.message || 'Failed to create class.');
      }

      toast.success('Class created successfully!');
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
        <h2 className="text-3xl font-bold tracking-tight">Add Class</h2>
        <p className="text-muted-foreground">Create a new class section.</p>
      </div>
      
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>Assign a name and an in-charge teacher to the new class.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Grade 10 - A" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher">Teacher In-Charge *</Label>
              <Select value={formData.teacherId || ''} onValueChange={(val: any) => handleTeacherChange(val)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher">
                    {formData.teacherId && teachers.length > 0 
                      ? teachers.find(t => t.id === formData.teacherId)?.name 
                      : 'Select a teacher'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.email})</SelectItem>
                  ))}
                  {teachers.length === 0 && (
                    <SelectItem value="none" disabled>No teachers found. Please add a teacher first.</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/admin')}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Class'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
