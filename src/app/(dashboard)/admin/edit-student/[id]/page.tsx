'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    guardianContact: '',
    classId: 'unassigned',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await fetch('/api/classes');
        if (classRes.ok) {
          const data = await classRes.json();
          setClasses(data);
        }

        const studentRes = await fetch(`/api/students/${id}`);
        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setFormData({
            name: studentData.name || '',
            email: studentData.email || '',
            rollNumber: studentData.rollNumber || '',
            guardianContact: studentData.guardianContact || '',
            classId: studentData.classId || 'unassigned',
          });
        } else {
          toast.error('Student not found');
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

  const handleClassChange = (value: string) => {
    setFormData((prev) => ({ ...prev, classId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        classId: formData.classId === 'unassigned' ? null : formData.classId,
      };

      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update student.');
      }

      toast.success('Student updated successfully!');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8">Loading student data...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Edit Student</h2>
        <p className="text-muted-foreground">Modify the student details.</p>
      </div>
      
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Update the student's name, contact, or class assignment.</CardDescription>
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
