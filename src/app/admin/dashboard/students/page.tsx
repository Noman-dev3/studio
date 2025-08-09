
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, MoreHorizontal, PlusCircle, Settings, Users } from 'lucide-react';
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

// Placeholder student data
const students = [
  { id: 'S001', name: 'Ahmed Ali', grade: 'Grade 5', status: 'Active', registered: '2023-01-15' },
  { id: 'S002', name: 'Fatima Khan', grade: 'Grade 3', status: 'Active', registered: '2023-02-20' },
  { id: 'S003', name: 'Zainab Omar', grade: 'Grade 8', status: 'Inactive', registered: '2022-09-01' },
  { id: 'S004', name: 'Bilal Yusuf', grade: 'Grade 1', status: 'Active', registered: '2024-03-10' },
  { id: 'S005', name: 'Aisha Siddiqui', grade: 'Grade 10', status: 'Graduated', registered: '2020-08-25' },
];

export default function StudentManagementPage() {
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
            <Button variant="secondary" asChild className="w-full justify-start text-lg">
                <Link href="/admin/dashboard/students"><Users className="mr-4" /> Students</Link>
            </Button>
             <Button variant="ghost" asChild className="w-full justify-start text-lg">
              <Link href="/admin/dashboard/admissions"><Users className="mr-4" /> Admissions</Link>
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
                <CardTitle>Students</CardTitle>
                <CardDescription>Manage student records for the entire school.</CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered On</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.registered}</TableCell>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
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
