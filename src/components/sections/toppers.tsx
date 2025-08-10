
'use client';

import * as React from 'react';
import { Award } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { Topper, db } from '@/lib/db';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Toppers() {
  const [toppers, setToppers] = React.useState<Topper[]>([]);

  React.useEffect(() => {
    const fetchToppers = async () => {
        const topperData = await db.getToppers();
        setToppers(topperData);
    };
    fetchToppers();
  }, []);

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
