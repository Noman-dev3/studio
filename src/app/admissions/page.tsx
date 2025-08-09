
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { submitAdmissionForm } from '@/app/actions';

const admissionFormSchema = z.object({
  studentName: z.string().min(2, "Student's name is required."),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  grade: z.string({ required_error: 'Please select a grade.' }),
  parentName: z.string().min(2, "Parent's name is required."),
  parentEmail: z.string().email('Please enter a valid email.'),
  parentPhone: z.string().min(10, 'Please enter a valid phone number.'),
  previousSchool: z.string().optional(),
  comments: z.string().optional(),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

export default function AdmissionsPage() {
  const { toast } = useToast();
  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
        studentName: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        previousSchool: '',
        comments: '',
    }
  });

  const onSubmit = async (data: AdmissionFormValues) => {
    const result = await submitAdmissionForm(data);
    if (result.success) {
      toast({
        title: 'Application Submitted!',
        description: result.message,
      });
      form.reset();
    } else {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: result.message || "An unexpected error occurred.",
        });
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section id="admissions" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Admissions</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Join the PIISS family. Fill out the form below to start the admission process for your child.
              </p>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student's Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applying for Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="playgroup">Playgroup</SelectItem>
                            <SelectItem value="nursery">Nursery</SelectItem>
                            <SelectItem value="kg1">KG-1</SelectItem>
                            <SelectItem value="kg2">KG-2</SelectItem>
                            {[...Array(10)].map((_, i) => (
                               <SelectItem key={i+1} value={`grade${i+1}`}>Grade {i+1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian's Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian's Email</FormLabel>
                        <FormControl><Input type="email" placeholder="e.g., parent@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian's Phone</FormLabel>
                        <FormControl><Input placeholder="e.g., +1234567890" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="previousSchool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous School (if any)</FormLabel>
                        <FormControl><Input placeholder="e.g., ABC International School" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Comments</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any other information you'd like to share." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center">
                    <Button type="submit" size="lg" variant="destructive" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Application
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
