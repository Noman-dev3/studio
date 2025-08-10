
'use client';

import * as React from 'react';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db, Topper } from '@/lib/db';
import { persistencePromise } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Toppers() {
  const [toppers, setToppers] = React.useState<Topper[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadToppers() {
      setIsLoading(true);
      await persistencePromise;
      const savedToppers = await db.getToppers();
      setToppers(savedToppers);
      setIsLoading(false);
    }
    loadToppers();
  }, []);

  if (isLoading) {
    return (
        <section id="toppers" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Our Toppers</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Celebrating the academic achievements of our brilliant students.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="text-center p-6">
                            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                            <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                            <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
                            <Skeleton className="h-4 w-1/3 mx-auto mt-1" />
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
  }

  if (toppers.length === 0) {
    return null; // Don't render the section if there are no toppers
  }

  return (
    <section id="toppers" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Our Toppers</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Celebrating the academic achievements of our brilliant students.
          </p>
        </div>

        <Carousel 
            opts={{ align: "start", loop: toppers.length > 3 }} 
            className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {toppers.map((topper) => (
              <CarouselItem key={topper.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2 h-full">
                    <Card className="text-center p-6 flex flex-col items-center justify-center h-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <Award className="h-12 w-12 text-yellow-500 mb-4" />
                        <CardTitle className="text-2xl text-primary">{topper.name}</CardTitle>
                        <p className="text-muted-foreground mt-1">{topper.grade}</p>
                        <p className="font-bold text-destructive text-lg mt-2">{topper.marks}</p>
                    </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex"/>
          <CarouselNext className="hidden sm:flex"/>
        </Carousel>
      </div>
    </section>
  );
}
