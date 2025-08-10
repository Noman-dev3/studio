
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Upload, PlusCircle, XCircle, Info, Save, Loader2, KeyRound, Link as LinkIcon, Image as ImageIcon, Contact } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, Topper, StudentResult, SiteSettings, Feature, Announcement, Event, Testimonial, GalleryImage, defaultSettings } from '@/lib/db';
import { persistencePromise } from '@/lib/firebase';
import Papa from 'papaparse';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const studentsFileRef = React.useRef<HTMLInputElement>(null);
  const teachersFileRef = React.useRef<HTMLInputElement>(null);
  const resultsFileRef = React.useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = React.useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [newTopper, setNewTopper] = React.useState<Omit<Topper, 'id'>>({ name: '', grade: '', marks: '' });

  React.useEffect(() => {
    const checkAuthAndFetch = async () => {
      await persistencePromise;
      const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
      if (isAuthenticated !== 'true') {
        router.replace('/admin/login');
        return;
      }

      setIsLoading(true);
      try {
          const savedSettings = await db.getSettings();
          // Deep merge to ensure all nested objects have default values
          setSettings(prev => ({
              ...prev,
              ...savedSettings,
              socials: { ...prev.socials, ...savedSettings.socials },
              images: { ...prev.images, ...savedSettings.images }
          }));
      } catch (error) {
          console.error("Failed to fetch settings:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to load settings data.' });
      } finally {
          setIsLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router, toast]);

  const handleSettingsChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNestedChange = (
    section: keyof SiteSettings, 
    field: string,
    value: any
  ) => {
    setSettings(prev => ({
        ...prev,
        [section]: {
            ...(prev[section] as object),
            [field]: value
        }
    }));
  };

  const handleImageUpload = (file: File, field: keyof SiteSettings['images']) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        handleNestedChange('images', field, e.target.result);
        toast({ title: 'Image Staged', description: 'Click "Save All Changes" to make the change permanent.' });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleGalleryImageChange = (id: string, field: keyof GalleryImage, value: string) => {
      const updatedGallery = (settings.images.gallery || []).map(img => 
        img.id === id ? { ...img, [field]: value } : img
      );
      handleNestedChange('images', 'gallery', updatedGallery);
  };
  
  const handleGalleryImageUpload = (file: File, id: string) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
         const updatedGallery = (settings.images.gallery || []).map(img => 
            img.id === id ? { ...img, src: e.target?.result as string } : img
         );
         handleNestedChange('images', 'gallery', updatedGallery);
         toast({ title: 'Image Staged', description: 'Click "Save All Changes" to apply.' });
      }
    };
    reader.readAsDataURL(file);
  };


  const addGalleryImage = () => {
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        src: 'https://placehold.co/600x400.png',
        alt: 'New Gallery Image',
        hint: ''
      };
       handleNestedChange('images', 'gallery', [...(settings.images.gallery || []), newImage]);
  };

  const removeGalleryImage = (id: string) => {
      const updatedGallery = (settings.images.gallery || []).filter(img => img.id !== id);
      handleNestedChange('images', 'gallery', updatedGallery);
  };


  const handleListItemChange = <T extends { id: string }>(
    listName: keyof SiteSettings,
    id: string,
    field: keyof T,
    value: any
  ) => {
    const list = (settings[listName] as T[]) || [];
    const updatedList = list.map(item => item.id === id ? { ...item, [field]: value } : item);
    handleSettingsChange(listName, updatedList);
  };
  
  const addListItem = <T extends { id: string }>(listName: keyof SiteSettings, newItem: T) => {
    const list = (settings[listName] as T[]) || [];
    handleSettingsChange(listName, [...list, newItem]);
  };

  const removeListItem = <T extends { id: string }>(listName: keyof SiteSettings, id: string) => {
     const list = (settings[listName] as T[]) || [];
     handleSettingsChange(listName, list.filter(item => item.id !== id));
  };
  
  const handleAddTopper = () => {
    if (newTopper.name && newTopper.grade && newTopper.marks) {
        addListItem('toppers', { ...newTopper, id: Date.now().toString() });
        setNewTopper({ name: '', grade: '', marks: '' });
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields for the new topper.' });
    }
  };


  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        await db.saveSettings(settings);
        toast({
            title: "Settings Saved",
            description: "Your changes have been successfully saved to the database.",
        });
    } catch (err: any) {
        toast({ variant: "destructive", title: "Error", description: `Failed to save settings: ${err.message}` });
    } finally {
        setIsSaving(false);
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
        dynamicTyping: true,
        complete: async (results) => {
            try {
                if (type === 'students') {
                    await db.saveStudents(results.data as any);
                    toast({ title: "Success", description: "Students data has been uploaded." });
                } else if (type === 'teachers') {
                    await db.saveTeachers(results.data as any);
                    toast({ title: "Success", description: "Teachers data has been uploaded." });
                }
            } catch (error) {
                 toast({ variant: "destructive", title: "Save Failed", description: `There was an error saving the data. Please check the CSV format. Error: ${error}` });
            }
        },
        error: (error) => {
            toast({ variant: "destructive", title: "Parsing Error", description: `Failed to parse CSV file: ${error.message}` });
        }
    });
  };

  const handleResultJsonUpload = (file: File | undefined) => {
      if (!file) {
          toast({ variant: "destructive", title: "Upload Failed", description: "Please select a JSON file." });
          return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
          try {
              const jsonContent = event.target?.result;
              if (typeof jsonContent !== 'string') throw new Error("File content is not valid.");
              
              const resultData: StudentResult = JSON.parse(jsonContent);

              if (!resultData.roll_number || !resultData.subjects) {
                throw new Error("Invalid JSON format. Missing 'roll_number' or 'subjects'.");
              }
              
              await db.saveResult(resultData);
              toast({ title: "Success", description: `Result for roll number ${resultData.roll_number} has been uploaded and saved.` });

          } catch (error: any) {
              toast({ variant: "destructive", title: "JSON Error", description: `Failed to parse or save JSON file: ${error.message}` });
          }
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "File Read Error", description: "Could not read the selected file." });
      };
      reader.readAsText(file);
  };
  
  if (isLoading) {
    return (
      <AdminLayout activePage="settings">
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="settings">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
                <p className="text-muted-foreground">Manage website content and configurations.</p>
            </div>
             <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                 Save All Changes
            </Button>
        </div>
        
        <div className="grid gap-8">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Global Changes</AlertTitle>
                <AlertDescription>
                   Your site is now connected to a global database. Any changes saved here will be visible to all users instantly.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="schoolName">School Name</Label>
                        <Input id="schoolName" value={settings.schoolName} onChange={e => handleSettingsChange('schoolName', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Contact/>Contact Information</CardTitle>
                    <CardDescription>Update the public contact details for the school.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input id="contactEmail" value={settings.contactEmail} onChange={e => handleSettingsChange('contactEmail', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input id="contactPhone" value={settings.contactPhone} onChange={e => handleSettingsChange('contactPhone', e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="contactAddress">Contact Address</Label>
                        <Textarea id="contactAddress" value={settings.contactAddress} onChange={e => handleSettingsChange('contactAddress', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><KeyRound/>Admin Credentials</CardTitle>
                    <CardDescription>Change the username and password for accessing this admin dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="adminUsername">Admin Username</Label>
                        <Input id="adminUsername" value={settings.adminUsername} onChange={e => handleSettingsChange('adminUsername', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="adminPassword">Admin Password</Label>
                        <Input id="adminPassword" type="password" value={settings.adminPassword} onChange={e => handleSettingsChange('adminPassword', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Homepage Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input id="heroTitle" value={settings.heroTitle} onChange={e => handleSettingsChange('heroTitle', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                        <Textarea id="heroSubtitle" value={settings.heroSubtitle} onChange={e => handleSettingsChange('heroSubtitle', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon/>Image Management</CardTitle>
                    <CardDescription>Update main images on the website by uploading a file.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    {(['hero', 'about', 'location'] as const).map(field => (
                        <div key={field} className="space-y-2">
                           <Label htmlFor={`${field}-image`} className="capitalize">{field} Image</Label>
                            <Image 
                                src={settings.images?.[field] || "https://placehold.co/300x200.png"} 
                                alt={`${field} preview`} 
                                width={300} height={200} 
                                className="rounded-md border aspect-video object-cover"
                            />
                            <Input 
                                id={`${field}-image-upload`}
                                type="file"
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                className="hidden"
                                onChange={e => e.target.files && handleImageUpload(e.target.files[0], field)}
                            />
                            <Button onClick={() => document.getElementById(`${field}-image-upload`)?.click()} variant="outline" className="w-full">
                                <Upload className="mr-2 h-4 w-4"/> Upload File
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="aboutText">About Text</Label>
                        <Textarea id="aboutText" rows={5} value={settings.aboutText} onChange={e => handleSettingsChange('aboutText', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="space-y-2">
                        {(settings.features || []).map(feature => (
                            <div key={feature.id} className="flex items-center gap-2">
                                <Input value={feature.text} onChange={e => handleListItemChange('features', feature.id, 'text', e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeListItem('features', feature.id)}><XCircle className="text-destructive" /></Button>
                            </div>
                        ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => addListItem('features', {id: Date.now().toString(), text: ''})}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Feature
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gallery Section</CardTitle>
                <CardDescription>Manage images in the homepage gallery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(settings.images.gallery || []).map(image => (
                    <div key={image.id} className="border rounded-lg p-3 space-y-2">
                        <Image src={image.src || "https://placehold.co/200x150.png"} alt={image.alt} width={200} height={150} className="w-full object-cover aspect-video rounded-md" />
                        <div className="space-y-1">
                          <Label htmlFor={`gallery-src-${image.id}`} className="text-xs">Image URL or Data URL</Label>
                           <Input 
                                id={`gallery-upload-${image.id}`}
                                type="file"
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                className="hidden"
                                onChange={(e) => e.target.files && handleGalleryImageUpload(e.target.files[0], image.id)}
                            />
                             <Button onClick={() => document.getElementById(`gallery-upload-${image.id}`)?.click()} variant="outline" className="w-full">
                                <Upload className="mr-2 h-4 w-4"/> Upload File
                            </Button>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`gallery-alt-${image.id}`} className="text-xs">Alt Text</Label>
                          <Input id={`gallery-alt-${image.id}`} value={image.alt} onChange={e => handleGalleryImageChange(image.id, 'alt', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`gallery-hint-${image.id}`} className="text-xs">AI Hint</Label>
                          <Input id={`gallery-hint-${image.id}`} value={image.hint} onChange={e => handleGalleryImageChange(image.id, 'hint', e.target.value)} />
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-destructive" onClick={() => removeGalleryImage(image.id)}>
                            <XCircle className="mr-2 h-4 w-4"/> Remove Image
                        </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addGalleryImage}>
                  <PlusCircle className="mr-2 h-4 w-4"/> Add Gallery Image
                </Button>
              </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LinkIcon/>Social Media Links</CardTitle>
                    <CardDescription>Enter the full URLs for your social media profiles.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook URL</Label>
                        <Input id="facebook" placeholder="https://facebook.com/your-page" value={settings.socials?.facebook || ''} onChange={e => handleNestedChange('socials', 'facebook', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter URL</Label>
                        <Input id="twitter" placeholder="https://twitter.com/your-handle" value={settings.socials?.twitter || ''} onChange={e => handleNestedChange('socials', 'twitter', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram URL</Label>
                        <Input id="instagram" placeholder="https://instagram.com/your-account" value={settings.socials?.instagram || ''} onChange={e => handleNestedChange('socials', 'instagram', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/your-profile" value={settings.socials?.linkedin || ''} onChange={e => handleNestedChange('socials', 'linkedin', e.target.value)} />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Announcements Bar</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Label>Announcement Ticker Items</Label>
                    <div className="space-y-2">
                    {(settings.announcements || []).map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                            <Input value={item.text} onChange={e => handleListItemChange('announcements', item.id, 'text', e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeListItem('announcements', item.id)}><XCircle className="text-destructive" /></Button>
                        </div>
                    ))}
                    </div>
                     <Button variant="outline" size="sm" onClick={() => addListItem('announcements', {id: Date.now().toString(), text: ''})}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Announcement
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Events Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {(settings.events || []).map(event => (
                        <div key={event.id} className="p-4 border rounded-lg space-y-2 relative">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeListItem('events', event.id)}>
                                <XCircle className="text-destructive" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label>Date</Label>
                                    <Input value={event.date} onChange={e => handleListItemChange('events', event.id, 'date', e.target.value)} placeholder="e.g. NOV 25"/>
                                </div>
                                 <div className="space-y-1 col-span-2">
                                    <Label>Title</Label>
                                    <Input value={event.title} onChange={e => handleListItemChange('events', event.id, 'title', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Description</Label>
                                <Textarea value={event.description} onChange={e => handleListItemChange('events', event.id, 'description', e.target.value)} />
                            </div>
                        </div>
                    ))}
                     <Button variant="outline" size="sm" onClick={() => addListItem('events', {id: Date.now().toString(), date: '', title: '', description: ''})}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Event
                    </Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Testimonials Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     {(settings.testimonials || []).map(item => (
                        <div key={item.id} className="p-4 border rounded-lg space-y-2 relative">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeListItem('testimonials', item.id)}>
                                <XCircle className="text-destructive" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div className="space-y-1">
                                    <Label>Name</Label>
                                    <Input value={item.name} onChange={e => handleListItemChange('testimonials', item.id, 'name', e.target.value)}/>
                                </div>
                                <div className="space-y-1">
                                    <Label>Role</Label>
                                    <Input value={item.role} onChange={e => handleListItemChange('testimonials', item.id, 'role', e.target.value)}/>
                                </div>
                                <div className="space-y-1">
                                    <Label>Avatar Text</Label>
                                    <Input value={item.avatar} onChange={e => handleListItemChange('testimonials', item.id, 'avatar', e.target.value)} placeholder="e.g. JD"/>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Testimonial Text</Label>
                                <Textarea value={item.text} onChange={e => handleListItemChange('testimonials', item.id, 'text', e.target.value)} />
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addListItem('testimonials', {id: Date.now().toString(), name: '', role: '', avatar: '', text: ''})}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Testimonial
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Upload CSV files for students/teachers and JSON files for results. This will overwrite existing data where applicable.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
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
                            <Button onClick={() => studentsFileRef.current?.click()} className="w-full">
                                <Upload className="mr-2 h-4 w-4" /> Upload CSV
                            </Button>
                        </div>
                         <p className="text-sm text-muted-foreground">
                            Columns: Name, Roll_Number, Class, Gender, Contact, Address
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
                             <Button onClick={() => teachersFileRef.current?.click()} className="w-full">
                                <Upload className="mr-2 h-4 w-4" /> Upload CSV
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                           Columns: Name, Teacher_ID, Contact, Salary, Photo_Path, Date_Joined
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="results-json">Results Data (JSON)</Label>
                         <div className="flex items-center gap-2">
                             <Input 
                                id="results-json" 
                                type="file" 
                                accept=".json" 
                                ref={resultsFileRef}
                                onChange={(e) => handleResultJsonUpload(e.target.files?.[0])}
                                className="hidden"
                            />
                             <Button onClick={() => resultsFileRef.current?.click()} className="w-full">
                                <Upload className="mr-2 h-4 w-4" /> Upload JSON
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                           Upload a single JSON file per student result.
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
                    <div className="border rounded-md p-2 mt-4 space-y-2">
                        <h4 className="font-medium">Current Toppers</h4>
                        {(settings.toppers || []).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No toppers added yet.</p>
                        ) : (
                            (settings.toppers || []).map(topper => (
                                <div key={topper.id} className="flex justify-between items-center bg-secondary p-2 rounded-md">
                                    <p className="text-sm">{topper.name} ({topper.grade}) - {topper.marks}</p>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeListItem('toppers', topper.id)}>
                                        <XCircle className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="pt-4">
                        <Label>New Topper</Label>
                        <div className="flex flex-col sm:flex-row gap-2 items-end mt-2">
                             <Input placeholder="Student Name" value={newTopper.name} onChange={e => setNewTopper(p => ({...p, name: e.target.value}))} />
                             <Input placeholder="Grade / Class" value={newTopper.grade} onChange={e => setNewTopper(p => ({...p, grade: e.target.value}))} />
                            <Input placeholder="Marks / Achievement" value={newTopper.marks} onChange={e => setNewTopper(p => ({...p, marks: e.target.value}))} />
                            <Button onClick={handleAddTopper} className="w-full sm:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Topper
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <div className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                     Save All Changes
                </Button>
            </div>
        </div>
    </AdminLayout>
  );
}
