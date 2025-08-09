
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { db, Teacher } from '@/lib/db';
import { Skeleton } from '@/components/ui/skeleton';

const dummyTeachers = [
  { Name: "Expert Educator", subject: "Specialized Subject", Photo_Path: "https://placehold.co/400x400.png", hint: "person portrait" },
  { Name: "Lead Instructor", subject: "Core Curriculum", Photo_Path: "https://placehold.co/400x400.png", hint: "person face" },
  { Name: "Senior Mentor", subject: "Advanced Studies", Photo_Path: "https://placehold.co/400x400.png", hint: "professional portrait" },
  { Name: "Academic Advisor", subject: "Student Guidance", Photo_Path: "https://placehold.co/400x400.png", hint: "friendly teacher" },
];

export function Teachers() {
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadTeachers() {
      setIsLoading(true);
      const storedTeachers = await db.getTeachers();
      setTeachers(storedTeachers);
      setIsLoading(false);
    }
    loadTeachers();
  }, []);

  const displayTeachers = React.useMemo(() => {
    if (isLoading) return Array.from({ length: 4 });
    if (teachers.length > 0 && teachers.length < 4) {
      const dummies = dummyTeachers.slice(0, 4 - teachers.length).map(t => ({...t, isDummy: true}));
      return [...teachers, ...dummies];
    }
    if (teachers.length >= 4) {
        return teachers;
    }
    const dummies = dummyTeachers.map(t => ({...t, isDummy: true}));
    return dummies;
  }, [teachers, isLoading]);

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
          {displayTeachers.map((teacher: any, index) => (
            isLoading ? (
                <Card key={index} className="text-center overflow-hidden group shadow-md">
                    <CardContent className="p-0">
                        <Skeleton className="aspect-square w-full" />
                    </CardContent>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
                    </CardHeader>
                </Card>
            ) : (
                <Card key={teacher.Teacher_ID || `dummy-${index}`} className="text-center overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden">
                    <Image
                        src={teacher.Photo_Path || `https://placehold.co/400x400.png?text=${teacher.Name.charAt(0)}`}
                        alt={`Photo of ${teacher.Name}`}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={teacher.hint || "teacher portrait"}
                    />
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle className="text-xl">{teacher.Name}</CardTitle>
                    <CardDescription className="text-destructive font-semibold">{teacher.isDummy ? teacher.subject : `Teacher ID: ${teacher.Teacher_ID}`}</CardDescription>
                </CardHeader>
                </Card>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
