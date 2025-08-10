
'use client';

import { Card } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';
import * as React from 'react';
import Image from 'next/image';
import { db } from '@/lib/db';
import { persistencePromise } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

export function Location() {
  const [settings, setSettings] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await persistencePromise;
      const siteSettings = await db.getSettings();
      setSettings(siteSettings);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <section id="location" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Our Location</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Visit our state-of-the-art campus. We are conveniently located and easily accessible.
          </p>
        </div>
        
        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2">
            <div className="md:col-span-1 h-96 md:h-full w-full bg-muted flex items-center justify-center">
                 {isLoading || !settings ? <Skeleton className="w-full h-full" /> : 
                    <Image
                      src={settings.images?.location || "https://placehold.co/600x500.png"}
                      alt="School location placeholder"
                      width={600}
                      height={500}
                      className="object-cover w-full h-full"
                      data-ai-hint="map location"
                    />
                 }
            </div>
            <div className="p-8 bg-card flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-primary mb-6">Find Us Here</h3>
              {isLoading || !settings ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
              ) : (
              <div className="space-y-4 text-card-foreground">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p>{settings.contactAddress}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p>{settings.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p>{settings.contactEmail}</p>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
