
'use client';
import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { SiteSettings, Feature, db } from '@/lib/db';
import { Skeleton } from '../ui/skeleton';

export function About() {
  const [settings, setSettings] = React.useState<Partial<SiteSettings> | null>(null);
  const isLoading = !settings;

  React.useEffect(() => {
    const fetchSettings = async () => {
        const settingsData = await db.getSettings();
        setSettings(settingsData);
    };
    fetchSettings();
  }, []);

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
             {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-7 w-1/2" />
                  <Skeleton className="h-7 w-1/2" />
                  <Skeleton className="h-7 w-1/2" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                  Welcome to {settings.schoolName}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {settings.aboutText}
                </p>
                <ul className="space-y-3">
                  {settings.features?.map((feature: Feature) => (
                    <li key={feature.id} className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="w-full h-full">
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-0">
                {isLoading ? <Skeleton className="w-[600px] h-[500px]" /> :
                  <Image
                    src={settings.images?.about || "https://placehold.co/600x500.png"}
                    alt="School campus"
                    width={600}
                    height={500}
                    className="object-cover w-full h-full"
                    data-ai-hint="modern school campus"
                  />
                }
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
