
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, Loader2, UserSquare } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, type Teacher } from '@/lib/db';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const teacherFormSchema = z.object({
  name: z.string().min(2, "Teacher's name is required."),
  subject: z.string().min(2, "Subject is required."),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  joiningDate: z.date({ required_error: 'Joining date is required.' }),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

export default function TeacherManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: '',
      subject: '',
      email: '',
      phone: '',
    },
  });

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

  const handleAddTeacher = async (data: TeacherFormValues) => {
    try {
      await db.addTeacher(data);
      toast({
        title: 'Teacher Added',
        description: `${data.name} has been successfully added.`,
      });
      fetchTeachers(); // Re-fetch to update the list
      setIsAddTeacherDialogOpen(false);
      form.reset();
    } catch (error) {
       toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add teacher.',
      });
    }
  }

  return (
    <AdminLayout activePage="teachers">
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <div>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Manage teacher records for the school.</CardDescription>
            </div>
            <Dialog open={isAddTeacherDialogOpen} onOpenChange={setIsAddTeacherDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Teacher
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Add New Teacher</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new teacher.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddTeacher)} className="space-y-4 py-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Teacher's Full Name</FormLabel><FormControl><Input placeholder="e.g., Ahmed Hassan" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Mathematics" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="e.g., teacher@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="e.g., +1234567890" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="joiningDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Joining Date</FormLabel>
                                    <Popover><PopoverTrigger asChild><FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                    </PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )}/>
                            <DialogFooter>
                                <Button type="submit" variant="destructive" disabled={form.formState.isSubmitting}>
                                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Save Teacher
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
                <TableHead>Teacher ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Loading teachers...
                        </TableCell>
                    </TableRow>
                ) : teachers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    No teachers found. Add a new teacher to get started.
                    </TableCell>
                </TableRow>
                ) : (
                teachers.map((teacher, index) => (
                <TableRow key={`${teacher.id}-${index}`}>
                    <TableCell className="font-medium">{teacher.id}</TableCell>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>
                    <Badge variant={teacher.status === 'Active' ? 'default' : 'secondary'}>
                        {teacher.status}
                    </Badge>
                    </TableCell>
                    <TableCell>{format(teacher.joiningDate, "PPP")}</TableCell>
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
