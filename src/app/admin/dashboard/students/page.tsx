
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, MoreHorizontal, PlusCircle, Settings, Users, FileCheck, DollarSign } from 'lucide-react';
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
import { PiissLogo } from '@/components/icons/piiss-logo';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';


interface Student {
    id: string;
    name: string;
    grade: string;
    status: 'Active' | 'Inactive';
    registered: string;
}

export default function StudentManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = React.useState(false);
  const [newStudentName, setNewStudentName] = React.useState('');
  const [newStudentGrade, setNewStudentGrade] = React.useState('');

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };
  
  const handleAddStudent = () => {
      if (!newStudentName || !newStudentGrade) {
        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please fill out all fields.',
        });
        return;
      }

      const newStudent: Student = {
          id: `PIISS-${Math.floor(1000 + Math.random() * 9000)}`,
          name: newStudentName,
          grade: newStudentGrade,
          status: 'Active',
          registered: format(new Date(), "PPP")
      };

      setStudents(prev => [...prev, newStudent]);
      toast({
          title: 'Student Added',
          description: `${newStudent.name} has been successfully added.`,
      });
      
      setNewStudentName('');
      setNewStudentGrade('');
      setIsAddStudentDialogOpen(false);
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
            <div className="p-4 mb-4">
                 <Link href="/">
                    <PiissLogo className="h-10 w-auto" />
                </Link>
            </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard"><Home /> Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/admin/dashboard/students"><Users /> Students</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard/admissions"><FileCheck /> Admissions</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard/fees"><DollarSign /> Fees</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard/settings"><Settings /> Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-auto p-4">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut /> Logout
            </Button>
          </div>
        </Sidebar>
        
        <main className="flex-1 p-6 md:p-10">
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
                  {students.length === 0 ? (
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
        </main>
      </div>
    </SidebarProvider>
  );
}
