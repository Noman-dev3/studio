
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Award, MoreHorizontal, PlusCircle, XCircle, Save, Loader2, BookOpen } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, type Student, type StudentResult, type Subject } from '@/lib/db';

export default function ResultManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [students, setStudents] = React.useState<Student[]>([]);
  const [results, setResults] = React.useState<StudentResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [currentSubjects, setCurrentSubjects] = React.useState<Subject[]>([]);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const [studentData, resultData] = await Promise.all([db.getStudents(), db.getResults()]);
        setStudents(studentData);
        setResults(resultData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch data.' });
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
    fetchData();
  }, [router, fetchData]);

  const handleManageReportCard = (student: Student) => {
    setSelectedStudent(student);
    const studentResult = results.find(r => r.roll_number === student.Roll_Number);
    const subjectsArray = studentResult?.subjects ? Object.entries(studentResult.subjects).map(([name, marks], index) => ({
        id: `${student.Roll_Number}-${name}-${index}`,
        name,
        marks: Number(marks)
    })) : [];
    setCurrentSubjects(subjectsArray);
    setIsModalOpen(true);
  };

  const handleAddSubject = () => {
    setCurrentSubjects([...currentSubjects, { id: Date.now().toString(), name: '', marks: 0 }]);
  };

  const handleRemoveSubject = (id: string) => {
    setCurrentSubjects(currentSubjects.filter(s => s.id !== id));
  };

  const handleSubjectChange = (id: string, field: 'name' | 'marks', value: string) => {
    setCurrentSubjects(currentSubjects.map(s => 
      s.id === id 
        ? { ...s, [field]: field === 'marks' ? parseInt(value, 10) || 0 : value } 
        : s
    ));
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }

  const handleSaveChanges = async () => {
    if (!selectedStudent) return;
    setIsSaving(true);
    
    const subjectsObject = currentSubjects.reduce((acc, subject) => {
        if(subject.name.trim()) {
            acc[subject.name.trim()] = subject.marks;
        }
        return acc;
    }, {} as {[key: string]: number});

    const totalMarks = currentSubjects.reduce((acc, subject) => acc + subject.marks, 0);
    const maxMarks = currentSubjects.length * 100; // Assuming each subject is out of 100
    const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
    const grade = getGrade(percentage);
    
    const existingResult = results.find(r => r.roll_number === selectedStudent.Roll_Number);

    const newResult: StudentResult = {
      ...(existingResult || {}),
      student_name: selectedStudent.Name,
      roll_number: selectedStudent.Roll_Number,
      class: selectedStudent.Class,
      session: existingResult?.session || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      subjects: subjectsObject,
      total_marks: totalMarks,
      max_marks: maxMarks,
      percentage: parseFloat(percentage.toFixed(2)),
      grade: grade,
      date_created: existingResult?.date_created || new Date().toISOString(),
    };

    try {
      await db.saveResult(newResult);
      toast({ title: 'Success', description: `Report card for ${selectedStudent.Name} has been saved.` });
      await fetchData(); 
      setIsModalOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save the report card.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getResultForStudent = (rollNumber: string) => {
    return results.find(r => r.roll_number === rollNumber);
  };

  return (
    <AdminLayout activePage="results">
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <div>
                <CardTitle>Results Management</CardTitle>
                <CardDescription>Create and manage student report cards. You can also bulk-upload JSON files in settings.</CardDescription>
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                    </TableRow>
                ) : students.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    No students found. Upload student data in settings.
                    </TableCell>
                </TableRow>
                ) : (
                students.map((student, index) => {
                  const result = getResultForStudent(student.Roll_Number);
                  return (
                    <TableRow key={`${student.Roll_Number}-${index}`}>
                        <TableCell className="font-medium">{student.Roll_Number}</TableCell>
                        <TableCell>{student.Name}</TableCell>
                        <TableCell>{student.Class}</TableCell>
                        <TableCell>{result ? `${result.percentage}%` : 'N/A'}</TableCell>
                        <TableCell>{result ? result.grade : 'N/A'}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleManageReportCard(student)}>
                                <BookOpen className="mr-2 h-4 w-4" /> {result ? 'Edit' : 'Create'} Report Card
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                  );
                }))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>

        {/* Manage Report Card Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Manage Report Card</DialogTitle>
                    <DialogDescription>
                        For {selectedStudent?.Name} (Roll No: {selectedStudent?.Roll_Number})
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    {currentSubjects.map((subject, index) => (
                        <div key={subject.id} className="flex items-end gap-2 p-2 border rounded-md">
                            <div className="grid gap-1.5 flex-1">
                                <Label htmlFor={`subject-name-${index}`}>Subject Name</Label>
                                <Input 
                                    id={`subject-name-${index}`} 
                                    value={subject.name}
                                    onChange={e => handleSubjectChange(subject.id, 'name', e.target.value)}
                                />
                            </div>
                             <div className="grid gap-1.5 w-24">
                                <Label htmlFor={`subject-marks-${index}`}>Marks (out of 100)</Label>
                                <Input 
                                    id={`subject-marks-${index}`} 
                                    type="number"
                                    value={subject.marks}
                                    onChange={e => handleSubjectChange(subject.id, 'marks', e.target.value)}
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => handleRemoveSubject(subject.id)}>
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <Button variant="outline" onClick={handleAddSubject} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add Subject
                    </Button>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AdminLayout>
  );
}
