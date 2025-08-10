
'use client';
import * as React from 'react';
import { Megaphone } from 'lucide-react';
import { SiteSettings, db } from '@/lib/db';

export function Announcements() {
  const [settings, setSettings] = React.useState<Partial<SiteSettings> | null>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      const settingsData = await db.getSettings();
      setSettings(settingsData);
    };
    fetchSettings();
  }, []);

  const announcements = settings?.announcements || [];
  
  if (announcements.length === 0) {
    return null; // Don't render if no announcements
  }

  const fullText = announcements.map(item => item.text).join(' ••• ');

  return (
    <section id="announcements" className="bg-primary text-primary-foreground relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center overflow-hidden">
            <div className="flex-shrink-0 mr-4">
                <Megaphone className="w-6 h-6" />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="ticker-wrap relative w-full">
                    <div className="ticker-move absolute whitespace-nowrap">
                        <p className="inline-block font-medium">{fullText}</p>
                        <p className="inline-block font-medium pl-16">{fullText}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
