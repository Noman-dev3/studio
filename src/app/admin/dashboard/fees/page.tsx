
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/layout/admin-layout';
import { useToast } from '@/hooks/use-toast';

const fees: any[] = [];

export default function FeeManagementPage() {
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleAction = (action: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} is not yet implemented.`,
    });
  }

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
    <AdminLayout activePage="fees">
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Fees Management</CardTitle>
                    <CardDescription>Create, track, and manage student fee payments.</CardDescription>
                </div>
                 <Button onClick={() => handleAction('Create Fee Slip')}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Create Fee Slip
                </Button>
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
                    No fee records found. Click "Create Fee Slip" to start.
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
                        <DropdownMenuItem onClick={() => handleAction('View Details')}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Mark as Paid')}>Mark as Paid</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Send Reminder')}>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleAction('Delete Fee')}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                )))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </AdminLayout>
  );
}
