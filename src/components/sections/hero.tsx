import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-primary/80 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
        data-ai-hint="school building students"
      ></div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white drop-shadow-lg animate-fade-in-up">
          Excellence in Education, Rooted in Faith
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/90 drop-shadow-md animate-fade-in-up animation-delay-300">
          Nurturing young minds to become future leaders through a blend of world-class academics and timeless Islamic values.
        </p>
        <div className="mt-10 flex justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" variant="destructive">
            <Link href="#contact">
              Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
            <Link href="#about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
}
