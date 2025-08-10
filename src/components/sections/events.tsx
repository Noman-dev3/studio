
'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { db, Event } from '@/lib/db';
import { Skeleton } from '../ui/skeleton';

export function Events() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const settings = await db.getSettings();
      setEvents(settings.events || []);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
       <section id="events" className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Skeleton className="h-10 w-2/3 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
       </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section id="events" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Upcoming Events</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us for our upcoming events and be a part of the vibrant PIISS community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="flex-grow">
                <div className="flex items-center text-destructive font-bold mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{event.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                  <Button variant="link" className="p-0 h-auto">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
