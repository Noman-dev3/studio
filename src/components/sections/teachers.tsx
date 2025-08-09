import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const teachers = [
  { name: "Dr. Aisha Khan", subject: "Principal & Islamic Studies", image: "https://placehold.co/400x400.png", hint: "woman portrait" },
  { name: "Mr. Omar Ahmed", subject: "Head of Sciences", image: "https://placehold.co/400x400.png", hint: "man portrait" },
  { name: "Mrs. Fatima Ali", subject: "Mathematics Coordinator", image: "https://placehold.co/400x400.png", hint: "woman face" },
  { name: "Mr. Yusuf Ibrahim", subject: "English & Literature", image: "https://placehold.co/400x400.png", hint: "man face" },
];

export function Teachers() {
  return (
    <section id="teachers" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Meet Our Faculty</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our team of dedicated and experienced educators is committed to inspiring every student.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher, index) => (
            <Card key={index} className="text-center overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={teacher.image}
                    alt={`Photo of ${teacher.name}`}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={teacher.hint}
                  />
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle className="text-xl">{teacher.name}</CardTitle>
                <CardDescription className="text-destructive font-semibold">{teacher.subject}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
