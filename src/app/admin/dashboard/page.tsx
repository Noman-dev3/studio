
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Home, Users, FileCheck, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, Student } from '@/lib/db';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [newApplications, setNewApplications] = React.useState(0);

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
      return;
    }

    async function fetchData() {
        const studentData = await db.getStudents();
        setStudents(studentData);
        // Placeholder for new applications count
        setNewApplications(0); 
    }
    fetchData();

  }, [router]);

  const dashboardItems = [
    { title: 'Total Students', value: students.length.toString(), icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: 'New Applications', value: newApplications.toString(), icon: <FileCheck className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Revenue (Monthly)', value: 'PKR 0', icon: <BarChart className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Fees Overdue', value: '0', icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
  ];

  return (
    <AdminLayout activePage="dashboard">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardItems.map(item => (
            <Card key={item.title} className="shadow-lg hover:shadow-2xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
            </Card>
        ))}
        </div>

        <div className="mt-10">
            <h2 className="text-2xl font-bold text-primary mb-4">Recent Activity</h2>
            <Card className="shadow-lg">
                <CardContent className="p-6">
                    <p className="text-muted-foreground">No recent activity to display.</p>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
  );
}
