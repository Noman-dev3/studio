
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db } from '@/lib/db';
import Papa from 'papaparse';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const studentsFileRef = React.useRef<HTMLInputElement>(null);
  const teachersFileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleSaveChanges = () => {
    toast({
        title: "Settings Saved",
        description: "Your changes have been successfully saved.",
    });
  };

  const handleFileUpload = (file: File | undefined, type: 'students' | 'teachers') => {
    if (!file) {
        toast({ variant: "destructive", title: "Upload Failed", description: "Please select a file to upload." });
        return;
    }

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            try {
                if (type === 'students') {
                    await db.saveStudents(results.data as any);
                    toast({ title: "Success", description: "Students data has been uploaded and saved." });
                } else {
                    await db.saveTeachers(results.data as any);
                    toast({ title: "Success", description: "Teachers data has been uploaded and saved." });
                }
            } catch (error) {
                 toast({ variant: "destructive", title: "Save Failed", description: "There was an error saving the data." });
            }
        },
        error: (error) => {
            toast({ variant: "destructive", title: "Parsing Error", description: `Failed to parse CSV file: ${error.message}` });
        }
    });
  };


  return (
    <AdminLayout activePage="settings">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
                <p className="text-muted-foreground">Manage website content and configurations.</p>
            </div>
        </div>
        
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Upload CSV files to populate student and teacher data. This will overwrite any existing data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="students-csv">Students Data</Label>
                        <div className="flex items-center gap-2">
                            <Input 
                                id="students-csv" 
                                type="file" 
                                accept=".csv" 
                                ref={studentsFileRef}
                                onChange={(e) => handleFileUpload(e.target.files?.[0], 'students')}
                                className="hidden" 
                            />
                            <Button onClick={() => studentsFileRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Upload CSV
                            </Button>
                        </div>
                         <p className="text-sm text-muted-foreground">
                            Required columns: Name, Roll_Number, Class, Gender, Contact, Address
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teachers-csv">Teachers Data</Label>
                         <div className="flex items-center gap-2">
                             <Input 
                                id="teachers-csv" 
                                type="file" 
                                accept=".csv" 
                                ref={teachersFileRef}
                                onChange={(e) => handleFileUpload(e.target.files?.[0], 'teachers')}
                                className="hidden"
                            />
                             <Button onClick={() => teachersFileRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Upload CSV
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                           Required columns: Name, Teacher_ID, Contact, Salary, Photo_Path, Date_Joined
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Update the contact details displayed on the website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact-email">Email</Label>
                            <Input id="contact-email" type="email" placeholder="contact@piiss.edu" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-phone">Phone Number</Label>
                            <Input id="contact-phone" placeholder="+1 (234) 567-890" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-address">Address</Label>
                        <Input id="contact-address" placeholder="123 Education Lane, Knowledge City, 12345" />
                    </div>
                </CardContent>
            </Card>

             <div className="flex justify-end">
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                </Button>
            </div>
        </div>
    </AdminLayout>
  );
}
