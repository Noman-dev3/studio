
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Home, LogOut, Settings, Users, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiissLogo } from '@/components/icons/piiss-logo';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  const dashboardItems = [
    { title: 'Total Students', value: '1,200', icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: 'New Applications', value: '52', icon: <FileCheck className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Revenue (Monthly)', value: '$50,000', icon: <BarChart className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Site Visitors', value: '12,345', icon: <Users className="h-6 w-6 text-muted-foreground" /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground p-4 flex flex-col">
        <div className="mb-8">
            <Link href="/">
                <PiissLogo className="h-10 w-auto" />
            </Link>
        </div>
        <nav className="flex-1 space-y-2">
            <Button variant="secondary" asChild className="w-full justify-start text-lg">
                <Link href="/admin/dashboard"><Home className="mr-4" /> Dashboard</Link>
            </Button>
             <Button variant="ghost" asChild className="w-full justify-start text-lg">
                <Link href="/admin/dashboard/students"><Users className="mr-4" /> Students</Link>
            </Button>
             <Button variant="ghost" asChild className="w-full justify-start text-lg">
              <Link href="/admin/dashboard/admissions"><FileCheck className="mr-4" /> Admissions</Link>
            </Button>
             <Button variant="ghost" asChild className="w-full justify-start text-lg">
              <Link href="/admin/dashboard/settings"><Settings className="mr-4" /> Settings</Link>
            </Button>
        </nav>
        <div className="mt-auto">
           <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2"/> Logout
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
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
      </main>
    </div>
  );
}
