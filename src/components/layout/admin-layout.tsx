

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, LogOut, Settings, Users, UserSquare } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { PiissLogo } from '@/components/icons/piiss-logo';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'students' | 'teachers' | 'settings';
}

export function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', href: '/admin/dashboard', icon: <Home />, label: 'Dashboard' },
    { id: 'students', href: '/admin/dashboard/students', icon: <Users />, label: 'Students' },
    { id: 'teachers', href: '/admin/dashboard/teachers', icon: <UserSquare />, label: 'Teachers' },
    { id: 'settings', href: '/admin/dashboard/settings', icon: <Settings />, label: 'Settings' },
  ];

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
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild isActive={activePage === item.id}>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <div className="mt-auto p-4">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut /> Logout
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </SidebarProvider>
  );
}
