
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, Settings, Users, FileCheck, Save, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiissLogo } from '@/components/icons/piiss-logo';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

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

  const handleSaveChanges = () => {
    // In a real application, you would save these settings to a database.
    toast({
        title: "Settings Saved",
        description: "Your changes have been successfully saved.",
    });
  };

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
              <SidebarMenuButton asChild>
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
              <SidebarMenuButton asChild isActive>
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
          <div className="flex items-center justify-between mb-8">
              <div>
                  <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
                  <p className="text-muted-foreground">Manage website content and configurations.</p>
              </div>
              <Button onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
          </div>
          
          <div className="grid gap-8">
              <Card>
                  <CardHeader>
                      <CardTitle>Hero Section</CardTitle>
                      <CardDescription>Update the main text and image on the homepage.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="hero-title">Headline</Label>
                          <Input id="hero-title" placeholder="Excellence in Education, Rooted in Faith" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="hero-subtitle">Sub-headline</Label>
                          <Textarea id="hero-subtitle" placeholder="Nurturing young minds to become future leaders..." />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="hero-image">Hero Background Image</Label>
                          <Input id="hero-image" type="file" />
                          <p className="text-sm text-muted-foreground">Upload a new background image. Recommended size: 1920x1080px.</p>
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
