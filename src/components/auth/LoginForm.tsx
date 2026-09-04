'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If redirected here from the proxy due to lack of ADMIN role
    if (searchParams.get('error') === 'unauthorized') {
      toast.error('You are unauthorized. Contact the admin.', {
        duration: 5000,
      });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('You are unauthorized. Contact the admin.');
        }
        throw new Error(data.message || 'Login failed');
      }

      toast.success('Login successful!');
      
      // Navigate based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else if (data.user.role === 'TEACHER') {
        router.push('/teacher');
      } else if (data.user.role === 'STUDENT') {
        router.push('/student');
      } else {
        router.push('/');
      }
      
      router.refresh(); // Force refresh to apply new auth state
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className="w-full rounded-md bg-muted p-3 text-xs">
            <p className="mb-2 font-semibold text-foreground">Demo Accounts (Click to fill):</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li 
                className="flex justify-between cursor-pointer hover:text-foreground transition-colors"
                onClick={() => { setEmail('hr@aelyx.ai'); setPassword('123'); }}
              >
                <span className="font-medium">Admin</span>
                <span>hr@aelyx.ai / 123</span>
              </li>
              <li 
                className="flex justify-between cursor-pointer hover:text-foreground transition-colors"
                onClick={() => { setEmail('teacher3@gmail.com'); setPassword('123'); }}
              >
                <span className="font-medium">Teacher</span>
                <span>teacher3@gmail.com / 123</span>
              </li>
              <li 
                className="flex justify-between cursor-pointer hover:text-foreground transition-colors"
                onClick={() => { setEmail('vaibhav@gmail.com'); setPassword('123'); }}
              >
                <span className="font-medium">Student</span>
                <span>vaibhav@gmail.com / 123</span>
              </li>
            </ul>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
