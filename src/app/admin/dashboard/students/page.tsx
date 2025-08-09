
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, type Student } from '@/lib/db';

export default function StudentManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = React.useState(false);
  const [newStudentName, setNewStudentName] = React.useState('');
  const [newStudentGrade, setNewStudentGrade] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
      return;
    }
    
    async function fetchStudents() {
        setIsLoading(true);
        const studentData = await db.getStudents();
        setStudents(studentData);
        setIsLoading(false);
    }
    fetchStudents();
    
  }, [router]);

  const handleAddStudent = async () => {
      if (!newStudentName || !newStudentGrade) {
        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please fill out all fields.',
        });
        return;
      }

      try {
        const newStudent = await db.addStudent({ name: newStudentName, grade: newStudentGrade });
        setStudents(prev => [...prev, newStudent]);
        toast({
            title: 'Student Added',
            description: `${newStudent.name} has been successfully added.`,
        });
        
        setNewStudentName('');
        setNewStudentGrade('');
        setIsAddStudentDialogOpen(false);
      } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to add student.',
        });
      }
  }

  return (
    <AdminLayout activePage="students">
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <div>
                <CardTitle>Students</CardTitle>
                <CardDescription>Manage student records for the entire school.</CardDescription>
            </div>
            <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Student
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new student. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="grade" className="text-right">Grade</Label>
                            <Input id="grade" value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddStudent} variant="destructive">Save Student</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Loading students...
                        </TableCell>
                    </TableRow>
                ) : students.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    No students found. Add a new student to get started.
                    </TableCell>
                </TableRow>
                ) : (
                students.map((student) => (
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
                )))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </AdminLayout>
  );
}
