
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { MoreHorizontal, PlusCircle, Loader2, CalendarIcon, CheckCircle } from 'lucide-react';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/layout/admin-layout';
import { useToast } from '@/hooks/use-toast';
import { db, type Fee, type Student } from '@/lib/db';
import { cn } from '@/lib/utils';


const feeFormSchema = z.object({
  studentRollNumber: z.string({ required_error: 'Please select a student.' }),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  dueDate: z.date({ required_error: 'Due date is required.' }),
});

type FeeFormValues = z.infer<typeof feeFormSchema>;

export default function FeeManagementPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [fees, setFees] = React.useState<Fee[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const form = useForm<FeeFormValues>({
    resolver: zodResolver(feeFormSchema),
    defaultValues: {
      studentRollNumber: '',
      amount: 0,
    }
  });

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [feeData, studentData] = await Promise.all([db.getFees(), db.getStudents()]);
      setFees(feeData);
      setStudents(studentData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch data.' });
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
    fetchData();
  }, [router, fetchData]);


  const handleMarkAsPaid = async (feeId: string) => {
    const feeToUpdate = fees.find(f => f.id === feeId);
    if (!feeToUpdate) return;
    
    feeToUpdate.status = 'Paid';
    feeToUpdate.paymentDate = new Date().toISOString();

    try {
        await db.saveFees(fees); // Save the whole array
        toast({ title: 'Success', description: `Fee slip ${feeId} marked as paid.` });
        await fetchData(); // Refresh data
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update fee status.' });
    }
  };
  
  const onSubmit = async (data: FeeFormValues) => {
    const selectedStudent = students.find(s => s.Roll_Number === data.studentRollNumber);
    if (!selectedStudent) {
        toast({ variant: 'destructive', title: 'Error', description: 'Invalid student selected.'});
        return;
    }
    
    const newFee: Fee = {
        id: `FEE-${Date.now()}`,
        studentRollNumber: selectedStudent.Roll_Number,
        studentName: selectedStudent.Name,
        grade: selectedStudent.Class,
        amount: data.amount,
        dueDate: data.dueDate.toISOString(),
        status: 'Pending',
    };

    try {
        await db.saveFee(newFee);
        toast({ title: 'Success', description: `Fee slip for ${selectedStudent.Name} created.` });
        await fetchData(); // Refresh data
        setIsModalOpen(false);
        form.reset();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create fee slip.'});
    }
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
    <AdminLayout activePage="fees">
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Fees Management</CardTitle>
                    <CardDescription>Create, track, and manage student fee payments.</CardDescription>
                </div>
                 <Button onClick={() => setIsModalOpen(true)}>
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
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell>
                    </TableRow>
                ) : fees.length === 0 ? (
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
                    <TableCell>{format(new Date(fee.dueDate), 'PPP')}</TableCell>
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
                        {fee.status !== 'Paid' && (
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(fee.id)}>
                                <CheckCircle className="mr-2 h-4 w-4"/>
                                Mark as Paid
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem disabled>View Details</DropdownMenuItem>
                        <DropdownMenuItem disabled>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" disabled>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                )))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>

        {/* Create Fee Slip Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Fee Slip</DialogTitle>
                    <DialogDescription>Select a student and enter the fee details below.</DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="studentRollNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a student to bill" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {students.map(student => (
                                            <SelectItem key={student.Roll_Number} value={student.Roll_Number}>
                                                {student.Name} (Class: {student.Class})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Amount (PKR)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 5000" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Create Slip
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    </AdminLayout>
  );
}
