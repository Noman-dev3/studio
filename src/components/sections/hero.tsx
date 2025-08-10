
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteSettings, db } from '@/lib/db';
import { Skeleton } from '../ui/skeleton';

export function Hero() {
  const [settings, setSettings] = React.useState<Partial<SiteSettings> | null>(null);
  const isLoading = !settings;
  const title = settings?.heroTitle;
  const subtitle = settings?.heroSubtitle;
  const heroImage = settings?.images?.hero;

  React.useEffect(() => {
    const fetchSettings = async () => {
        const settingsData = await db.getSettings();
        setSettings(settingsData);
    };
    fetchSettings();
  }, []);

  return (
    <section id="home" className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-primary/80 z-10"></div>
      
      {isLoading ? 
        <Skeleton className="absolute inset-0" />
      :
        heroImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('${heroImage}')` }}
              data-ai-hint="school building students"
            ></div>
        )
      }


      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {isLoading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white drop-shadow-lg animate-fade-in-up">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/90 drop-shadow-md animate-fade-in-up animation-delay-300">
              {subtitle}
            </p>
          </>
        )}
        <div className="mt-10 flex justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" variant="destructive">
            <Link href="#contact">
              Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
            <Link href="#about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
}
