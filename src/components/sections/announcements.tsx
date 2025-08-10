
'use client';
import * as React from 'react';
import { Megaphone } from 'lucide-react';
import { db, Announcement } from '@/lib/db';
import { persistencePromise } from '@/lib/firebase';

export function Announcements() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await persistencePromise;
      const settings = await db.getSettings();
      setAnnouncements(settings.announcements || []);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading || announcements.length === 0) {
    return null; // Don't render if loading or no announcements
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
