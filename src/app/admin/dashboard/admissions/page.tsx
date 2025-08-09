
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, MoreHorizontal, Settings, Users, FileCheck, DollarSign } from 'lucide-react';
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

// Placeholder admission data has been removed.
const admissions: any[] = [];

export default function AdmissionManagementPage() {
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
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
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
             <Button variant="secondary" asChild className="w-full justify-start text-lg">
              <Link href="/admin/dashboard/admissions"><FileCheck className="mr-4" /> Admissions</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start text-lg">
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
                <CardTitle>Admissions</CardTitle>
                <CardDescription>Manage and review new student applications.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App. ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Parent Name</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No new admission applications.
                    </TableCell>
                  </TableRow>
                ) : (
                  admissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell className="font-medium">{admission.id}</TableCell>
                    <TableCell>{admission.studentName}</TableCell>
                    <TableCell>{admission.grade}</TableCell>
                    <TableCell>{admission.parentName}</TableCell>
                    <TableCell>{admission.submitted}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(admission.status) as any}>
                        {admission.status}
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
                          <DropdownMenuItem>View Application</DropdownMenuItem>
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
