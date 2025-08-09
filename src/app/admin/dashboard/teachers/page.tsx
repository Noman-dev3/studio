
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreHorizontal, Edit, Save, X, Trash2 } from 'lucide-react';
import Image from 'next/image';

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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, type Teacher } from '@/lib/db';
import { deleteTeacher } from '@/app/actions';


export default function TeacherManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingTeacherId, setEditingTeacherId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

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

  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacherId(teacher.Teacher_ID);
    setEditingName(teacher.Name);
  };

  const handleCancelEdit = () => {
    setEditingTeacherId(null);
    setEditingName('');
  };

  const handleSaveName = async (teacherId: string) => {
    const updatedTeachers = teachers.map(t => 
        t.Teacher_ID === teacherId ? { ...t, Name: editingName } : t
    );
    try {
        await db.saveTeachers(updatedTeachers);
        setTeachers(updatedTeachers);
        toast({ title: 'Success', description: "Teacher's name updated." });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save name change.' });
    } finally {
        handleCancelEdit();
    }
  };

  const handleDelete = async (teacherId: string) => {
    const result = await deleteTeacher(teacherId);
    if(result.success) {
      toast({ title: 'Success', description: result.message });
      await fetchTeachers();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };


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
                teachers.map((teacher) => (
                <TableRow key={teacher.Teacher_ID}>
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
                    <TableCell>
                      {editingTeacherId === teacher.Teacher_ID ? (
                        <div className="flex items-center gap-2">
                           <Input 
                                value={editingName} 
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-8"
                            />
                            <Button size="icon" className="h-8 w-8" onClick={() => handleSaveName(teacher.Teacher_ID)}><Save className="h-4 w-4"/></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}><X className="h-4 w-4"/></Button>
                        </div>
                      ) : (
                        teacher.Name
                      )}
                    </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditClick(teacher)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the teacher's record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(teacher.Teacher_ID)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

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
