
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, type Teacher } from '@/lib/db';
import Image from 'next/image';

export default function TeacherManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTeachers = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const teacherData = await db.getTeachers();
        setTeachers(teacherData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch teachers.' });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
      return;
    }
    fetchTeachers();
  }, [router, fetchTeachers]);

  return (
    <AdminLayout activePage="teachers">
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <div>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Manage teacher records for the school.</CardDescription>
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Teacher ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            Loading teachers...
                        </TableCell>
                    </TableRow>
                ) : teachers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                    No teachers found. Upload the teachers CSV file in settings.
                    </TableCell>
                </TableRow>
                ) : (
                teachers.map((teacher, index) => (
                <TableRow key={`${teacher.Teacher_ID}-${index}`}>
                    <TableCell>
                      <Image 
                        src={teacher.Photo_Path || `https://placehold.co/40x40.png?text=${teacher.Name.charAt(0)}`} 
                        alt={teacher.Name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{teacher.Teacher_ID}</TableCell>
                    <TableCell>{teacher.Name}</TableCell>
                    <TableCell>{teacher.Contact}</TableCell>
                    <TableCell>{teacher.Salary}</TableCell>
                    <TableCell>{format(new Date(teacher.Date_Joined), "PPP")}</TableCell>
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
                        <DropdownMenuItem>Edit Name</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
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
    </AdminLayout>
  );
}
