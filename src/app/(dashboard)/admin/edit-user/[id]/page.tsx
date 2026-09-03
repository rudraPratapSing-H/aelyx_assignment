'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const user = await res.json();
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            subject: user.subject || '',
          });
        } else {
          toast.error('User not found');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update user.');
      }

      toast.success('User updated successfully!');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8">Loading user data...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Edit Teacher/User</h2>
        <p className="text-muted-foreground">Modify the user details.</p>
      </div>
      
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update the name, email, or subject.</CardDescription>
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject Specialty</Label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} />
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
