import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const galleryImages = [
  { src: "https://placehold.co/600x400.png", alt: "Students in a classroom", hint: "students classroom" },
  { src: "https://placehold.co/600x400.png", alt: "School library", hint: "school library" },
  { src: "https://placehold.co/600x400.png", alt: "Science lab experiment", hint: "science lab" },
  { src: "https://placehold.co/600x400.png", alt: "Students playing sports", hint: "students sports" },
  { src: "https://placehold.co/600x400.png", alt: "Art class", hint: "art class" },
  { src: "https://placehold.co/600x400.png", alt: "School assembly", hint: "school assembly" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Our Gallery</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A glimpse into the vibrant life at Premier International Islamic School.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg group">
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
      </div>
    </section>
  );
}
