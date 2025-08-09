
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const studentFormSchema = z.object({
  name: z.string().min(2, "Student's name is required."),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  grade: z.string({ required_error: 'Please select a grade.' }),
  parentName: z.string().min(2, "Parent's name is required."),
  parentEmail: z.string().email('Please enter a valid email.'),
  parentPhone: z.string().min(10, 'Please enter a valid phone number.'),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

export default function StudentManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      grade: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
    },
  });

  const fetchStudents = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const studentData = await db.getStudents();
        setStudents(studentData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch students.' });
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
    fetchStudents();
  }, [router, fetchStudents]);

  const handleAddStudent = async (data: StudentFormValues) => {
    try {
      await db.addStudent(data);
      toast({
        title: 'Student Added',
        description: `${data.name} has been successfully added.`,
      });
      fetchStudents(); // Re-fetch students to update the list
      setIsAddStudentDialogOpen(false);
      form.reset();
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
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new student. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddStudent)} className="space-y-4 py-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Student's Full Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="dob" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel>
                                    <Popover><PopoverTrigger asChild><FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus/>
                                    </PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="grade" render={({ field }) => (
                                <FormItem><FormLabel>Grade</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="playgroup">Playgroup</SelectItem><SelectItem value="nursery">Nursery</SelectItem>
                                            <SelectItem value="kg1">KG-1</SelectItem><SelectItem value="kg2">KG-2</SelectItem>
                                            {[...Array(10)].map((_, i) => (<SelectItem key={i+1} value={`grade${i+1}`}>Grade {i+1}</SelectItem>))}
                                        </SelectContent>
                                    </Select><FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="parentName" render={({ field }) => (
                                <FormItem><FormLabel>Parent/Guardian's Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="parentEmail" render={({ field }) => (
                                <FormItem><FormLabel>Parent's Email</FormLabel><FormControl><Input type="email" placeholder="e.g., parent@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="parentPhone" render={({ field }) => (
                                <FormItem><FormLabel>Parent's Phone</FormLabel><FormControl><Input placeholder="e.g., +1234567890" {...field} /></FormControl><FormMessage /></FormMessage>
                            )}/>
                            <DialogFooter>
                                <Button type="submit" variant="destructive" disabled={form.formState.isSubmitting}>
                                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Save Student
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
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
                students.map((student, index) => (
                <TableRow key={`${student.id}-${index}`}>
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
