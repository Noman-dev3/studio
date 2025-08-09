
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
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
import { db, type Admission } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export default function AdmissionManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [admissions, setAdmissions] = React.useState<Admission[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAdmissions = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const admissionData = await db.getAdmissions();
        // Sort by most recent first
        admissionData.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
        setAdmissions(admissionData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch admission applications.' });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);
  
  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
    } else {
        fetchAdmissions();
    }
  }, [router, fetchAdmissions]);

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

  const handleAction = (action: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} is not yet implemented.`,
    });
  }

  return (
    <AdminLayout activePage="admissions">
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
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">Loading applications...</TableCell>
                    </TableRow>
                ) : admissions.length === 0 ? (
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
                    <TableCell>{format(new Date(admission.applicationDate), 'PPP')}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleAction('View Application')}>View Application</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Approve')}>Approve</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleAction('Reject')}>Reject</DropdownMenuItem>
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
