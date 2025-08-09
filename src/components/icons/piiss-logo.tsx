import * as React from 'react';

export function PiissLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="100" height="32" viewBox="0 0 100 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text x="0" y="24" fontFamily="'PT Sans', sans-serif" fontSize="24" fontWeight="bold" className="text-primary dark:text-primary-foreground">
        PIISS
      </text>
    </svg>
  );
}
