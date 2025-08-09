'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Location() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const position = { lat: 3.1390, lng: 101.6869 }; // Placeholder: Kuala Lumpur

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
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-2 h-96 md:h-full w-full">
              {apiKey ? (
                <APIProvider apiKey={apiKey}>
                  <Map defaultCenter={position} defaultZoom={14} mapId="piiss-school-map" className="w-full h-full">
                    <Marker position={position} />
                  </Map>
                </APIProvider>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Map is unavailable.</p>
                </div>
              )}
            </div>
            <div className="p-8 bg-card flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-primary mb-6">Find Us Here</h3>
              <div className="space-y-4 text-card-foreground">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p>123 Education Lane, Knowledge City, 12345</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p>+1 (234) 567-890</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p>contact@piiss.edu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
