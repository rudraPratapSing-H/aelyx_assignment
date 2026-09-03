'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AddTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    subject: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'TEACHER' }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('A user with this email already exists.');
        }
        if (response.status === 400) {
          throw new Error('Please fill in all required fields.');
        }
        throw new Error(data.error || data.message || 'Failed to create teacher.');
      }

      toast.success('Teacher created successfully!');
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
        <h2 className="text-3xl font-bold tracking-tight">Add Teacher</h2>
        <p className="text-muted-foreground">Create a new teacher account.</p>
      </div>
      
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>Fill out the details to enroll a new teacher.</CardDescription>
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
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject Specialty</Label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Mathematics" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/admin')}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Teacher'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
