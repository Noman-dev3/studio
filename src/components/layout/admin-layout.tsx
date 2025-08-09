
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, LogOut, Settings, Users, UserSquare, FileCheck, DollarSign, Award } from 'lucide-react';
import { PiissLogo } from '@/components/icons/piiss-logo';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'students' | 'teachers' | 'admissions' | 'fees' | 'results' | 'settings';
}

export function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', href: '/admin/dashboard', icon: <Home className="mr-3" />, label: 'Dashboard' },
    { id: 'admissions', href: '/admin/dashboard/admissions', icon: <FileCheck className="mr-3" />, label: 'Admissions' },
    { id: 'students', href: '/admin/dashboard/students', icon: <Users className="mr-3" />, label: 'Students' },
    { id: 'teachers', href: '/admin/dashboard/teachers', icon: <UserSquare className="mr-3" />, label: 'Teachers' },
    { id: 'fees', href: '/admin/dashboard/fees', icon: <DollarSign className="mr-3" />, label: 'Fees' },
    { id: 'results', href: '/admin/dashboard/results', icon: <Award className="mr-3" />, label: 'Results' },
    { id: 'settings', href: '/admin/dashboard/settings', icon: <Settings className="mr-3" />, label: 'Settings' },
  ];

  return (
      <div className="flex min-h-screen bg-secondary/30">
        <aside className="w-64 flex-shrink-0 bg-background text-foreground flex flex-col border-r">
          <div className="h-20 flex items-center px-6 border-b">
            <Link href="/">
              <PiissLogo className="h-10 w-auto" />
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                  ${activePage === item.id 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:bg-secondary hover:text-secondary-foreground'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-4 py-6 mt-auto">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2" /> Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
      </div>
  );
}
