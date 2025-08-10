
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Inbox } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/admin-layout';

export default function AdmissionManagementPage() {
  const router = useRouter();

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <AdminLayout activePage="admissions">
        <Card>
            <CardHeader>
                <CardTitle>Admissions</CardTitle>
                <CardDescription>Review new student applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center h-64 text-center bg-secondary/50 rounded-lg">
                    <Inbox className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold">Applications are Sent via Email</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        All new admission applications are formatted and sent directly to the administrator's email inbox. Please check your email to review new submissions.
                    </p>
                </div>
            </CardContent>
        </Card>
    </AdminLayout>
  );
}
