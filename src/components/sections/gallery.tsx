
'use client';
import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { db, GalleryImage } from '@/lib/db';
import { persistencePromise } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

export function Gallery() {
  const [images, setImages] = React.useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await persistencePromise;
      const settings = await db.getSettings();
      setImages(settings.images.gallery || []);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Our Gallery</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A glimpse into the vibrant life at Pakistan Islamic International School System.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="w-full aspect-video" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg shadow-lg group">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full aspect-video group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={image.hint}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
