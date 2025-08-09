import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function About() {
  const features = [
    "Holistic Islamic & Academic Education",
    "Certified & Experienced Faculty",
    "State-of-the-Art Facilities",
    "Focus on Character Building"
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              Welcome to Pakistan Islamic International School System
            </h2>
            <p className="text-lg text-muted-foreground">
              At PIISS, we are dedicated to providing a balanced and comprehensive education that integrates academic excellence with profound Islamic values. Our mission is to nurture a new generation of leaders who are knowledgeable, pious, and ready to contribute positively to the global community.
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full h-full">
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Image
                  src="https://placehold.co/600x500.png"
                  alt="School campus"
                  width={600}
                  height={500}
                  className="object-cover w-full h-full"
                  data-ai-hint="modern school campus"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
