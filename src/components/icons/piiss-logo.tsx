
'use client';
import * as React from 'react';
import { db } from '@/lib/db';
import { persistencePromise } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

export function PiissLogo(props: React.SVGProps<SVGSVGElement>) {
  const [schoolName, setSchoolName] = React.useState('PIISS');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      await persistencePromise;
      const settings = await db.getSettings();
      // Use abbreviation or short name for logo
      const name = settings.schoolName || 'PIISS';
      const abbreviation = name.split(' ').map(word => word[0]).join('');
      setSchoolName(abbreviation.length > 1 && abbreviation.length <= 5 ? abbreviation : 'PIISS');
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-8 w-20" {...props} />;
  }

  return (
    <svg width="100" height="32" viewBox="0 0 100 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text x="0" y="24" fontFamily="'PT Sans', sans-serif" fontSize="24" fontWeight="bold" className="text-primary dark:text-primary-foreground">
        {schoolName}
      </text>
    </svg>
  );
}
