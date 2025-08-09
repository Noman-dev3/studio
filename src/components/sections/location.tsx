
'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';
import * as React from 'react';
import { db } from '@/lib/db';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Location() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const position = { lat: 24.8607, lng: 67.0011 }; // Placeholder: Karachi

  const [contactInfo, setContactInfo] = React.useState({ email: '', phone: '', address: '' });
  const [isApiKeyMissing, setIsApiKeyMissing] = React.useState(false);

  React.useEffect(() => {
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        setIsApiKeyMissing(true);
    }

    async function fetchContactInfo() {
      const email = await db.getSetting('contactEmail');
      const phone = await db.getSetting('contactPhone');
      const address = await db.getSetting('contactAddress');
      setContactInfo({
        email: email || 'contact@piiss.edu',
        phone: phone || '+92 123 4567890',
        address: address || '123 Education Road, Karachi, Pakistan',
      });
    }
    fetchContactInfo();
  }, [apiKey]);

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
              {isApiKeyMissing ? (
                <div className="w-full h-full bg-muted flex items-center justify-center p-4">
                  <Alert variant="destructive" className="max-w-sm">
                    <MapPin className="h-4 w-4"/>
                    <AlertTitle>Google Maps API Key is Missing</AlertTitle>
                    <AlertDescription>
                        Please add your Google Maps API key to the .env file to enable the map view.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <APIProvider apiKey={apiKey!}>
                  <Map defaultCenter={position} defaultZoom={14} mapId="piiss-school-map" className="w-full h-full">
                    <Marker position={position} />
                  </Map>
                </APIProvider>
              )}
            </div>
            <div className="p-8 bg-card flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-primary mb-6">Find Us Here</h3>
              <div className="space-y-4 text-card-foreground">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p>{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p>{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 mt-1 text-destructive shrink-0" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p>{contactInfo.email}</p>
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
