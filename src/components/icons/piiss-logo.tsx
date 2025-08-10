
'use client';
import * as React from 'react';
import { Skeleton } from '../ui/skeleton';

interface PiissLogoProps extends React.SVGProps<SVGSVGElement> {
    schoolName?: string;
}

export function PiissLogo({ schoolName, ...props }: PiissLogoProps) {
  const [displayName, setDisplayName] = React.useState('PIISS');
  
  React.useEffect(() => {
    if(schoolName) {
      const abbreviation = schoolName.split(' ').map(word => word[0]).join('');
      setDisplayName(abbreviation.length > 1 && abbreviation.length <= 5 ? abbreviation : 'PIISS');
    }
  }, [schoolName]);

  if (!schoolName) {
    return <Skeleton className="h-8 w-20" {...props} />;
  }

  return (
    <svg width="100" height="32" viewBox="0 0 100 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text x="0" y="24" fontFamily="'PT Sans', sans-serif" fontSize="24" fontWeight="bold" className="text-primary dark:text-primary-foreground">
        {displayName}
      </text>
    </svg>
  );
}
