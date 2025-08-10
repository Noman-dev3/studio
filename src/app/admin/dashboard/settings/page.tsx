
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Upload, PlusCircle, XCircle, Info, Save, Loader2, KeyRound, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/layout/admin-layout';
import { db, Topper, StudentResult, SiteSettings, Feature, Announcement, Event, Testimonial, GalleryImage } from '@/lib/db';
import Papa from 'papaparse';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const studentsFileRef = React.useRef<HTMLInputElement>(null);
  const teachersFileRef = React.useRef<HTMLInputElement>(null);
  const resultsFileRef = React.useRef<HTMLInputElement>(null);
  
  const [toppers, setToppers] = React.useState<Topper[]>([]);
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);


  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.replace('/admin/login');
      return;
    }

    const fetchSettings = async () => {
        setIsLoading(true);
        const [savedToppers, savedSettings] = await Promise.all([
            db.getToppers(),
            db.getSettings()
        ]);
        setToppers(savedToppers);
        setSettings(savedSettings);
        setIsLoading(false);
    }
    fetchSettings();

  }, [router]);

  const handleSettingsChange = (field: keyof SiteSettings, value: any) => {
    if (settings) {
        setSettings({ ...settings, [field]: value });
    }
  };

  const handleSocialChange = (platform: keyof SiteSettings['socials'], value: string) => {
    if (settings) {
      setSettings({
        ...settings,
        socials: {
          ...settings.socials,
          [platform]: value,
        }
      })
    }
  }

  const handleImageChange = (field: keyof SiteSettings['images'], value: string) => {
    if (settings) {
      setSettings({ ...settings, images: { ...settings.images, [field]: value } });
    }
  };

  const handleImageUpload = (file: File, field: keyof SiteSettings['images']) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        handleImageChange(field, e.target.result);
        toast({ title: 'Image Uploaded', description: 'Click "Save All Changes" to apply.' });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleGalleryImageChange = (id: string, field: keyof GalleryImage, value: string) => {
    if (settings) {
      const updatedGallery = settings.images.gallery.map(img => 
        img.id === id ? { ...img, [field]: value } : img
      );
      handleImageChange('gallery', updatedGallery as any);
    }
  };

  const addGalleryImage = () => {
    if(settings) {
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        src: 'https://placehold.co/600x400.png',
        alt: 'New Gallery Image',
        hint: ''
      };
      handleImageChange('gallery', [...settings.images.gallery, newImage] as any);
    }
  };

  const removeGalleryImage = (id: string) => {
    if(settings) {
      const updatedGallery = settings.images.gallery.filter(img => img.id !== id);
      handleImageChange('gallery', updatedGallery as any);
    }
  };


  const handleListItemChange = <T extends { id: string }>(
    list: T[],
    id: string,
    field: keyof T,
    value: any
  ): T[] => {
    return list.map(item => item.id === id ? { ...item, [field]: value } : item);
  };
  
  const addListItem = <T extends { id: string }>(list: T[], newItem: T): T[] => {
    return [...list, newItem];
  };

  const removeListItem = <T extends { id: string }>(list: T[], id: string): T[] => {
    return list.filter(item => item.id !== id);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        if(settings) await db.saveSettings(settings);
        await db.saveToppers(toppers);
        toast({
            title: "Settings Saved",
            description: "Your changes have been successfully saved.",
        });
    } catch {
        toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
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

              // Basic validation to match the expected structure
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
  
  if (isLoading || !settings) {
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
                <AlertTitle>Configuration Change</AlertTitle>
                <AlertDescription>
                    Contact information (email, phone, address) and email server settings are now managed in the <code>.env</code> file for better security and server-side access.
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
                    <CardDescription>Update main images on the website by providing a URL or uploading a file.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    {['hero', 'about', 'location'].map(field => (
                        <div key={field} className="space-y-2">
                           <Label htmlFor={`${field}-image`} className="capitalize">{field} Image</Label>
                            <Image 
                                src={(settings.images as any)[field]} 
                                alt={`${field} preview`} 
                                width={300} height={200} 
                                className="rounded-md border aspect-video object-cover"
                            />
                            <Input 
                                id={`${field}-image-url`}
                                placeholder="Enter image URL"
                                value={(settings.images as any)[field]}
                                onChange={e => handleImageChange(field as keyof SiteSettings['images'], e.target.value)}
                            />
                            <Input 
                                id={`${field}-image-upload`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => e.target.files && handleImageUpload(e.target.files[0], field as keyof SiteSettings['images'])}
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
                        {settings.features.map(feature => (
                            <div key={feature.id} className="flex items-center gap-2">
                                <Input value={feature.text} onChange={e => handleSettingsChange('features', handleListItemChange(settings.features, feature.id, 'text', e.target.value))} />
                                <Button variant="ghost" size="icon" onClick={() => handleSettingsChange('features', removeListItem(settings.features, feature.id))}><XCircle className="text-destructive" /></Button>
                            </div>
                        ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleSettingsChange('features', addListItem(settings.features, {id: Date.now().toString(), text: ''}))}>
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
                  {settings.images.gallery.map(image => (
                    <div key={image.id} className="border rounded-lg p-3 space-y-2">
                        <Image src={image.src} alt={image.alt} width={200} height={150} className="w-full object-cover aspect-video rounded-md" />
                        <div className="space-y-1">
                          <Label htmlFor={`gallery-src-${image.id}`} className="text-xs">Image URL or Data URL</Label>
                          <Input id={`gallery-src-${image.id}`} value={image.src} onChange={e => handleGalleryImageChange(image.id, 'src', e.target.value)} />
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
                        <Input id="facebook" placeholder="https://facebook.com/your-page" value={settings.socials.facebook} onChange={e => handleSocialChange('facebook', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter URL</Label>
                        <Input id="twitter" placeholder="https://twitter.com/your-handle" value={settings.socials.twitter} onChange={e => handleSocialChange('twitter', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram URL</Label>
                        <Input id="instagram" placeholder="https://instagram.com/your-account" value={settings.socials.instagram} onChange={e => handleSocialChange('instagram', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/your-profile" value={settings.socials.linkedin} onChange={e => handleSocialChange('linkedin', e.target.value)} />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Announcements Bar</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Label>Announcement Ticker Items</Label>
                    <div className="space-y-2">
                    {settings.announcements.map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                            <Input value={item.text} onChange={e => handleSettingsChange('announcements', handleListItemChange(settings.announcements, item.id, 'text', e.target.value))} />
                            <Button variant="ghost" size="icon" onClick={() => handleSettingsChange('announcements', removeListItem(settings.announcements, item.id))}><XCircle className="text-destructive" /></Button>
                        </div>
                    ))}
                    </div>
                     <Button variant="outline" size="sm" onClick={() => handleSettingsChange('announcements', addListItem(settings.announcements, {id: Date.now().toString(), text: ''}))}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Announcement
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Events Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {settings.events.map(event => (
                        <div key={event.id} className="p-4 border rounded-lg space-y-2 relative">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleSettingsChange('events', removeListItem(settings.events, event.id))}>
                                <XCircle className="text-destructive" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label>Date</Label>
                                    <Input value={event.date} onChange={e => handleSettingsChange('events', handleListItemChange(settings.events, event.id, 'date', e.target.value))} placeholder="e.g. NOV 25"/>
                                </div>
                                 <div className="space-y-1 col-span-2">
                                    <Label>Title</Label>
                                    <Input value={event.title} onChange={e => handleSettingsChange('events', handleListItemChange(settings.events, event.id, 'title', e.target.value))} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Description</Label>
                                <Textarea value={event.description} onChange={e => handleSettingsChange('events', handleListItemChange(settings.events, event.id, 'description', e.target.value))} />
                            </div>
                        </div>
                    ))}
                     <Button variant="outline" size="sm" onClick={() => handleSettingsChange('events', addListItem(settings.events, {id: Date.now().toString(), date: '', title: '', description: ''}))}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Event
                    </Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Testimonials Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     {settings.testimonials.map(item => (
                        <div key={item.id} className="p-4 border rounded-lg space-y-2 relative">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleSettingsChange('testimonials', removeListItem(settings.testimonials, item.id))}>
                                <XCircle className="text-destructive" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div className="space-y-1">
                                    <Label>Name</Label>
                                    <Input value={item.name} onChange={e => handleSettingsChange('testimonials', handleListItemChange(settings.testimonials, item.id, 'name', e.target.value))}/>
                                </div>
                                <div className="space-y-1">
                                    <Label>Role</Label>
                                    <Input value={item.role} onChange={e => handleSettingsChange('testimonials', handleListItemChange(settings.testimonials, item.id, 'role', e.target.value))}/>
                                </div>
                                <div className="space-y-1">
                                    <Label>Avatar Text</Label>
                                    <Input value={item.avatar} onChange={e => handleSettingsChange('testimonials', handleListItemChange(settings.testimonials, item.id, 'avatar', e.target.value))} placeholder="e.g. JD"/>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Testimonial Text</Label>
                                <Textarea value={item.text} onChange={e => handleSettingsChange('testimonials', handleListItemChange(settings.testimonials, item.id, 'text', e.target.value))} />
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleSettingsChange('testimonials', addListItem(settings.testimonials, {id: Date.now().toString(), name: '', role: '', avatar: '', text: ''}))}>
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
                        {toppers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No toppers added yet.</p>
                        ) : (
                            toppers.map(topper => (
                                <div key={topper.id} className="flex justify-between items-center bg-secondary p-2 rounded-md">
                                    <p className="text-sm">{topper.name} ({topper.grade}) - {topper.marks}</p>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setToppers(toppers.filter(t => t.id !== topper.id))}>
                                        <XCircle className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-end pt-4">
                        <div className="flex-1 space-y-2">
                            <Label>New Topper</Label>
                             <Input placeholder="Student Name" onChange={e => handleTopperChange('name', e.target.value)} />
                        </div>
                         <div className="flex-1 space-y-2">
                             <Label>&nbsp;</Label>
                            <Input placeholder="Grade / Class" onChange={e => handleTopperChange('grade', e.target.value)} />
                        </div>
                         <div className="flex-1 space-y-2">
                            <Label>&nbsp;</Label>
                            <Input placeholder="Marks / Achievement" onChange={e => handleTopperChange('marks', e.target.value)} />
                        </div>
                        <Button onClick={handleAddTopper} className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Topper
                        </Button>
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

  function handleTopperChange(field: keyof Topper, value: string) {
      // Helper for new topper state - not implemented yet to simplify
  }

  function handleAddTopper() {
    //
  }
}
