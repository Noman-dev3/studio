
'use client';
import * as React from 'react';
import { Skeleton } from '../ui/skeleton';

// Extract SVG props from all possible props to avoid passing them to the Skeleton
type SVGProps = React.SVGProps<SVGSVGElement>;

interface PiissLogoProps extends SVGProps {
    schoolName?: string;
}

export function PiissLogo({ schoolName, className, ...props }: PiissLogoProps) {
  const [displayName, setDisplayName] = React.useState('PIISS');
  
  React.useEffect(() => {
    if(schoolName) {
      const abbreviation = schoolName.split(' ').map(word => word[0]).join('');
      setDisplayName(abbreviation.length > 1 && abbreviation.length <= 5 ? abbreviation : 'PIISS');
    }
  }, [schoolName]);

  if (!schoolName) {
    // Only pass className to the Skeleton component, not all SVG props
    return <Skeleton className={cn("h-8 w-20", className)} />;
  }

  return (
    <svg width="100" height="32" viewBox="0 0 100 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <text x="0" y="24" fontFamily="'PT Sans', sans-serif" fontSize="24" fontWeight="bold" className="text-primary dark:text-primary-foreground">
        {displayName}
      </text>
    </svg>
  );
}

// Helper function to combine class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

