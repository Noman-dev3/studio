
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Home, Users, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, Student, Admission, StudentResult } from '@/lib/db';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';


export default function AdminDashboardPage() {
  const router = useRouter();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [admissions, setAdmissions] = React.useState<Admission[]>([]);
  const [results, setResults] = React.useState<StudentResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
      return;
    }

    async function fetchData() {
        setIsLoading(true);
        try {
            const [studentData, admissionData, resultData] = await Promise.all([
                db.getStudents(),
                db.getAdmissions(),
                db.getResults()
            ]);
            setStudents(studentData);
            setAdmissions(admissionData);
            setResults(resultData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();

  }, [router]);

  const stats = React.useMemo(() => {
    const newApplications = admissions.filter(a => a.status === 'Pending').length;
    
    return {
      totalStudents: students.length,
      newApplications,
      totalResults: results.length,
    };
  }, [students, admissions, results]);
  
  const chartData = React.useMemo(() => {
    const classData: { [key: string]: number } = {};
    students.forEach(student => {
        if (classData[student.Class]) {
            classData[student.Class]++;
        } else {
            classData[student.Class] = 1;
        }
    });

    return Object.keys(classData).map(className => ({
        name: className,
        total: classData[className],
    }));
  }, [students]);


  const dashboardItems = [
    { title: 'Total Students', value: isLoading ? '...' : stats.totalStudents.toString(), icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: 'New Applications', value: isLoading ? '...' : stats.newApplications.toString(), icon: <FileCheck className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Published Results', value: isLoading ? '...' : stats.totalResults.toString(), icon: <BarChart className="h-6 w-6 text-muted-foreground" /> },
  ];

  return (
    <AdminLayout activePage="dashboard">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 shadow-lg">
                 <CardHeader>
                    <CardTitle>Student Distribution</CardTitle>
                    <CardDescription>Number of students in each class.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    {isLoading ? <p>Loading chart...</p> : 
                    <ResponsiveContainer width="100%" height="100%">
                         <RechartsBarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} tickFormatter={(value) => `${value}`}/>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                formatter={(value) => [`${value} students`, 'Total']}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                    }
                </CardContent>
            </Card>
             <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No recent activity to display.</p>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
  );
}
