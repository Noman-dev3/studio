
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Check, X, Eye } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, type Admission } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { updateAdmissionStatus } from '@/app/actions';

export default function AdmissionManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [admissions, setAdmissions] = React.useState<Admission[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isViewing, setIsViewing] = React.useState(false);
  const [selectedAdmission, setSelectedAdmission] = React.useState<Admission | null>(null);

  const fetchAdmissions = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const admissionData = await db.getAdmissions();
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
  
  const handleViewApplication = (admission: Admission) => {
    setSelectedAdmission(admission);
    setIsViewing(true);
  }

  const handleUpdateStatus = async (admissionId: string, status: 'Approved' | 'Rejected') => {
    const result = await updateAdmissionStatus(admissionId, status);
    if(result.success) {
        toast({ title: 'Success', description: result.message });
        await fetchAdmissions();
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };


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
                        <DropdownMenuItem onClick={() => handleViewApplication(admission)}>
                          <Eye className="mr-2 h-4 w-4"/> View Application
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(admission.id, 'Approved')}>
                           <Check className="mr-2 h-4 w-4"/> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(admission.id, 'Rejected')}>
                           <X className="mr-2 h-4 w-4"/> Reject
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                )))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>

        <Dialog open={isViewing} onOpenChange={setIsViewing}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                    <DialogDescription>
                        Reviewing application for {selectedAdmission?.studentName}
                    </DialogDescription>
                </DialogHeader>
                {selectedAdmission && (
                    <div className="space-y-4 py-4 text-sm">
                        <p><strong>Student:</strong> {selectedAdmission.studentName}</p>
                        <p><strong>Date of Birth:</strong> {format(new Date(selectedAdmission.dob), 'PPP')}</p>
                        <p><strong>Grade:</strong> {selectedAdmission.grade}</p>
                        <p><strong>Parent:</strong> {selectedAdmission.parentName}</p>
                        <p><strong>Email:</strong> {selectedAdmission.parentEmail}</p>
                        <p><strong>Phone:</strong> {selectedAdmission.parentPhone}</p>
                        <p><strong>Previous School:</strong> {selectedAdmission.previousSchool || 'N/A'}</p>
                        <p><strong>Comments:</strong> {selectedAdmission.comments || 'N/A'}</p>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={() => setIsViewing(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </AdminLayout>
  );
}
