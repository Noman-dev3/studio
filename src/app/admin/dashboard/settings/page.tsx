
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, PlusCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, Topper } from '@/lib/db';
import Papa from 'papaparse';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const studentsFileRef = React.useRef<HTMLInputElement>(null);
  const teachersFileRef = React.useRef<HTMLInputElement>(null);

  const [contactEmail, setContactEmail] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [contactAddress, setContactAddress] = React.useState('');
  
  const [toppers, setToppers] = React.useState<Topper[]>([]);
  const [newTopper, setNewTopper] = React.useState({ name: '', grade: '', marks: '' });

  React.useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
      return;
    }

    const fetchSettings = async () => {
        const email = await db.getSetting('contactEmail');
        const phone = await db.getSetting('contactPhone');
        const address = await db.getSetting('contactAddress');
        const savedToppers = await db.getToppers();
        setContactEmail(email || '');
        setContactPhone(phone || '');
        setContactAddress(address || '');
        setToppers(savedToppers);
    }
    fetchSettings();

  }, [router]);

  const handleSaveChanges = async () => {
    try {
        await db.saveSetting('contactEmail', contactEmail);
        await db.saveSetting('contactPhone', contactPhone);
        await db.saveSetting('contactAddress', contactAddress);
        await db.saveToppers(toppers);
        toast({
            title: "Settings Saved",
            description: "Your changes have been successfully saved.",
        });
    } catch {
        toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
    }
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

  const handleAddTopper = () => {
    if (newTopper.name && newTopper.grade && newTopper.marks) {
        const topperToAdd: Topper = { id: Date.now().toString(), ...newTopper };
        setToppers([...toppers, topperToAdd]);
        setNewTopper({ name: '', grade: '', marks: '' });
    } else {
        toast({ variant: "destructive", title: "Missing Fields", description: "Please fill out all topper fields." });
    }
  };

  const handleRemoveTopper = (id: string) => {
    setToppers(toppers.filter(t => t.id !== id));
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
                    <CardTitle>Manage Toppers</CardTitle>
                    <CardDescription>Add or remove students to be featured in the toppers section on the homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="topper-name">Student Name</Label>
                            <Input id="topper-name" placeholder="e.g., Ali Khan" value={newTopper.name} onChange={e => setNewTopper({...newTopper, name: e.target.value})} />
                        </div>
                         <div className="flex-1 space-y-2">
                            <Label htmlFor="topper-grade">Grade / Class</Label>
                            <Input id="topper-grade" placeholder="e.g., Grade 10" value={newTopper.grade} onChange={e => setNewTopper({...newTopper, grade: e.target.value})} />
                        </div>
                         <div className="flex-1 space-y-2">
                            <Label htmlFor="topper-marks">Marks / Achievement</Label>
                            <Input id="topper-marks" placeholder="e.g., 95%" value={newTopper.marks} onChange={e => setNewTopper({...newTopper, marks: e.target.value})} />
                        </div>
                        <Button onClick={handleAddTopper} className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Topper
                        </Button>
                    </div>

                    <div className="border rounded-md p-2 mt-4 space-y-2">
                        <h4 className="font-medium">Current Toppers</h4>
                        {toppers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No toppers added yet.</p>
                        ) : (
                            toppers.map(topper => (
                                <div key={topper.id} className="flex justify-between items-center bg-secondary p-2 rounded-md">
                                    <p className="text-sm">{topper.name} ({topper.grade}) - {topper.marks}</p>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveTopper(topper.id)}>
                                        <XCircle className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                            ))
                        )}
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
                            <Input id="contact-email" type="email" placeholder="contact@piiss.edu" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-phone">Phone Number</Label>
                            <Input id="contact-phone" placeholder="+1 (234) 567-890" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-address">Address</Label>
                        <Input id="contact-address" placeholder="123 Education Lane, Knowledge City, 12345" value={contactAddress} onChange={(e) => setContactAddress(e.target.value)}/>
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

