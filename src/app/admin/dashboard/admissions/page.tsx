
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Inbox, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, Admission } from '@/lib/db';
import { updateAdmissionStatus } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdmissionManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [admissions, setAdmissions] = React.useState<Admission[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  const fetchAdmissions = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await db.getAdmissions();
        // Sort by date, newest first, and pending on top
        data.sort((a, b) => {
            if (a.status === 'Pending' && b.status !== 'Pending') return -1;
            if (a.status !== 'Pending' && b.status === 'Pending') return 1;
            return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        });
        setAdmissions(data);
    } catch(err) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch admissions data.' });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
      return;
    }
    fetchAdmissions();
  }, [router, fetchAdmissions]);

  const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
    setIsUpdating(id);
    const result = await updateAdmissionStatus(id, status);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      await fetchAdmissions();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsUpdating(null);
  };
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
        case 'Approved': return 'default';
        case 'Rejected': return 'destructive';
        default: return 'secondary';
    }
  }

  return (
    <AdminLayout activePage="admissions">
        <Card>
            <CardHeader>
                <CardTitle>Admissions</CardTitle>
                <CardDescription>Review new student applications. Approving or rejecting will notify the administrator via email.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : admissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center bg-secondary/50 rounded-lg">
                        <Inbox className="h-16 w-16 text-primary mb-4" />
                        <h3 className="text-xl font-semibold">No Applications Yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            New admission applications submitted through the website will appear here.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Parent Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admissions.map(admission => (
                                <TableRow key={admission.id}>
                                    <TableCell className="font-medium">{admission.studentName}</TableCell>
                                    <TableCell>{admission.grade}</TableCell>
                                    <TableCell>{admission.parentEmail}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(admission.status)}>{admission.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isUpdating === admission.id ? (
                                             <Loader2 className="h-5 w-5 animate-spin ml-auto" />
                                        ) : admission.status === 'Pending' ? (
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(admission.id, 'Approved')}>
                                                    <CheckCircle className="h-4 w-4 mr-2"/> Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(admission.id, 'Rejected')}>
                                                     <XCircle className="h-4 w-4 mr-2"/> Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Action Taken</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    </AdminLayout>
  );
}
