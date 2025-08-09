'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "The Rahman Family",
    role: "Parent",
    avatar: "RF",
    text: "PIISS has been a blessing for our children. The blend of high-quality education and Islamic teachings is exactly what we were looking for. The teachers are caring and professional."
  },
  {
    name: "Ali Abdullah",
    role: "Alumnus, Class of 2022",
    avatar: "AA",
    text: "My time at PIISS prepared me not just for university but for life. I developed a strong sense of identity and purpose. I am forever grateful to my teachers and peers."
  },
  {
    name: "The Siddiqui Family",
    role: "Parent",
    avatar: "SF",
    text: "We are impressed by the school's commitment to excellence in all areas. The facilities are wonderful, and there's a strong sense of community. Highly recommended."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">What Our Community Says</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Words of appreciation from our students and their families.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    </CardContent>
                    <div className="p-6 bg-secondary/50 flex items-center">
                      <Avatar>
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${testimonial.avatar}`} />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-semibold text-primary">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
