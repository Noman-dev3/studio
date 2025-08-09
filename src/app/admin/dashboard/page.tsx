
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Home, Users, FileCheck, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, Student, Admission, Fee } from '@/lib/db';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';


export default function AdminDashboardPage() {
  const router = useRouter();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [admissions, setAdmissions] = React.useState<Admission[]>([]);
  const [fees, setFees] = React.useState<Fee[]>([]);
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
            const [studentData, admissionData, feeData] = await Promise.all([
                db.getStudents(),
                db.getAdmissions(),
                db.getFees()
            ]);
            setStudents(studentData);
            setAdmissions(admissionData);
            setFees(feeData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();

  }, [router]);

  const stats = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const newApplications = admissions.filter(a => a.status === 'Pending').length;
    
    const monthlyRevenue = fees
        .filter(f => f.status === 'Paid' && f.paymentDate && new Date(f.paymentDate).getMonth() === currentMonth && new Date(f.paymentDate).getFullYear() === currentYear)
        .reduce((acc, f) => acc + f.amount, 0);

    const feesOverdue = fees.filter(f => f.status === 'Overdue' || (f.status === 'Pending' && new Date(f.dueDate) < now)).length;
    
    return {
      totalStudents: students.length,
      newApplications,
      monthlyRevenue,
      feesOverdue
    };
  }, [students, admissions, fees]);
  
  const chartData = React.useMemo(() => {
    const data: { name: string, total: number }[] = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    fees.filter(f => f.status === 'Paid' && f.paymentDate).forEach(fee => {
      const date = new Date(fee.paymentDate!);
      const month = date.getMonth();
      const monthName = months[month];
      const year = date.getFullYear();
      const chartLabel = `${monthName} ${year}`;
      
      const existingEntry = data.find(d => d.name === chartLabel);
      if (existingEntry) {
        existingEntry.total += fee.amount;
      } else {
        data.push({ name: chartLabel, total: fee.amount });
      }
    });
    
    return data.slice(-6); // show last 6 months of revenue
  }, [fees]);


  const dashboardItems = [
    { title: 'Total Students', value: isLoading ? '...' : stats.totalStudents.toString(), icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: 'New Applications', value: isLoading ? '...' : stats.newApplications.toString(), icon: <FileCheck className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Revenue (This Month)', value: isLoading ? '...' : `PKR ${stats.monthlyRevenue.toLocaleString()}`, icon: <BarChart className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Fees Overdue', value: isLoading ? '...' : stats.feesOverdue.toString(), icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
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

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 shadow-lg">
                 <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Last 6 months of fee collection.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    {isLoading ? <p>Loading chart...</p> : 
                    <ResponsiveContainer width="100%" height="100%">
                         <RechartsBarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `PKR ${value / 1000}k`}/>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                formatter={(value) => [`PKR ${Number(value).toLocaleString()}`, 'Revenue']}
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
                    <CardDescription>Latest admissions and payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No recent activity to display.</p>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
  );
}
