
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, MoreHorizontal, Settings, Users, FileCheck, DollarSign, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiissLogo } from '@/components/icons/piiss-logo';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Placeholder fee data
const fees = [
  { id: 'F001', studentName: 'Ahmed Ali', grade: 'Grade 5', amount: 5000, status: 'Paid', dueDate: '2024-05-10' },
  { id: 'F002', studentName: 'Fatima Khan', grade: 'Grade 3', amount: 4500, status: 'Pending', dueDate: '2024-06-10' },
  { id: 'F003', studentName: 'Zainab Omar', grade: 'Grade 8', amount: 6000, status: 'Overdue', dueDate: '2024-04-10' },
  { id: 'F004', studentName: 'Bilal Yusuf', grade: 'Grade 1', amount: 4000, status: 'Paid', dueDate: '2024-05-10' },
];

export default function FeeManagementPage() {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground p-4 flex-col hidden md:flex">
        <div className="mb-8">
            <Link href="/">
                <PiissLogo className="h-10 w-auto" />
            </Link>
        </div>
        <nav className="flex-1 space-y-2">
            <Button variant="ghost" asChild className="w-full justify-start text-lg">
                <Link href="/admin/dashboard"><Home className="mr-4" /> Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start text-lg">
                <Link href="/admin/dashboard/students"><Users className="mr-4" /> Students</Link>
            </Button>
             <Button variant="ghost" asChild className="w-full justify-start text-lg">
              <Link href="/admin/dashboard/admissions"><FileCheck className="mr-4" /> Admissions</Link>
            </Button>
             <Button variant="secondary" asChild className="w-full justify-start text-lg">
              <Link href="/admin/dashboard/fees"><DollarSign className="mr-4" /> Fees</Link>
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fees Management</CardTitle>
                <CardDescription>Track and manage student fee payments.</CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Generate Fee Slips
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-4">
                <Input placeholder="Search by student name or ID..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Amount (PKR)</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{fee.id}</TableCell>
                    <TableCell>{fee.studentName}</TableCell>
                    <TableCell>{fee.grade}</TableCell>
                    <TableCell>{fee.amount.toLocaleString()}</TableCell>
                    <TableCell>{fee.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(fee.status) as any}>
                        {fee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
