
'use client';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { db } from '@/lib/db';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [title, setTitle] = React.useState('PIISS - Pakistan Islamic International School System');
  const [description, setDescription] = React.useState('Fostering excellence in education and character.');

  React.useEffect(() => {
    const fetchSettings = async () => {
      const settings = await db.getSettings();
      setTitle(settings.schoolName);
      setDescription(settings.heroSubtitle);
    };
    fetchSettings();
  }, []);

  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
