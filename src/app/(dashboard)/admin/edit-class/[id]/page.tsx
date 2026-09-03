'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teachers
        const teacherRes = await fetch('/api/users');
        if (teacherRes.ok) {
          const data = await teacherRes.json();
          setTeachers(data.filter((user: any) => user.role === 'TEACHER'));
        }

        // Fetch class data
        const classRes = await fetch(`/api/classes/${id}`);
        if (classRes.ok) {
          const classData = await classRes.json();
          setFormData({
            name: classData.name,
            teacherId: classData.teacherId,
          });
        } else {
          toast.error('Class not found');
          router.push('/admin');
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchData();
  }, [id, router]);

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

      const response = await fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update class.');
      }

      toast.success('Class updated successfully!');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8">Loading class data...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Edit Class</h2>
        <p className="text-muted-foreground">Modify the class details.</p>
      </div>
      
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>Update the name and in-charge teacher for this class.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/')}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
