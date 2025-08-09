'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import { PiissLogo } from '@/components/icons/piiss-logo';
import Link from 'next/link';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    // IMPORTANT: This is a basic, insecure login for demonstration purposes.
    // In a real application, you must use a proper authentication service.
    if (data.username === 'admin' && data.password === 'password') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      toast({
        title: 'Login Successful',
        description: 'Redirecting to the admin dashboard...',
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="mb-8 text-center">
        <Link href="/">
          <PiissLogo className="h-12 w-auto mx-auto" />
        </Link>
      </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        Hint: Use <strong>admin</strong> / <strong>password</strong> to log in.
      </p>
    </div>
  );
}
