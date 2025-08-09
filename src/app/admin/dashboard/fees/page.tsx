
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
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const fees: any[] = [];

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
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
         <Sidebar>
            <div className="p-4 mb-4">
                 <Link href="/">
                    <PiissLogo className="h-10 w-auto" />
                </Link>
            </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard"><Home /> Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard/students"><Users /> Students</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard/admissions"><FileCheck /> Admissions</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/admin/dashboard/fees"><DollarSign /> Fees</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard/settings"><Settings /> Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-auto p-4">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut /> Logout
            </Button>
          </div>
        </Sidebar>
        
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
                  {fees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No fee records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    fees.map((fee) => (
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
                  )))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
