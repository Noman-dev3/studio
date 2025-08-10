
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, XCircle, FileSpreadsheet } from 'lucide-react';
import { checkResult } from '@/app/actions';
import { StudentResult } from '@/lib/db';
import { Badge } from '@/components/ui/badge';

const resultCheckSchema = z.object({
  rollNumber: z.string().min(1, { message: 'Roll number is required.' }),
});

type ResultCheckFormValues = z.infer<typeof resultCheckSchema>;

export default function ResultsPage() {
  const { toast } = useToast();
  const [result, setResult] = React.useState<StudentResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  const form = useForm<ResultCheckFormValues>({
    resolver: zodResolver(resultCheckSchema),
    defaultValues: { rollNumber: '' },
  });

  const onSubmit = async (data: ResultCheckFormValues) => {
    setIsLoading(true);
    setResult(null);
    setSearched(true);
    const response = await checkResult(data);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Not Found',
        description: response.message,
      });
    }
    setIsLoading(false);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-500';
    if (grade === 'B') return 'bg-blue-500';
    if (grade === 'C') return 'bg-yellow-500';
    if (grade === 'D') return 'bg-orange-500';
    return 'bg-red-500';
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Check Your Result</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Enter your roll number below to view your report card.
              </p>
            </div>
            <Card className="max-w-md mx-auto mt-12">
                <CardHeader>
                    <CardTitle>Enter Your Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="rollNumber"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Roll Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., PIISS-101" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Search className="mr-2"/>}
                            Check Result
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                 <div className="text-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/>
                    <p className="text-muted-foreground mt-2">Fetching your result...</p>
                 </div>
            )}

            {result && (
              <Card className="max-w-4xl mx-auto mt-12 shadow-2xl">
                <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg p-6">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-2"/>
                  <CardTitle className="text-3xl">Student Report Card</CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-lg">Roll Number: {result.studentRollNumber}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-lg">Subject</TableHead>
                                <TableHead className="text-right text-lg">Marks (out of 100)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.subjects.map(subject => (
                                <TableRow key={subject.id} className="text-base">
                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                    <TableCell className="text-right">{subject.marks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-secondary p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
                            <p className="text-2xl font-bold text-primary">{result.totalMarks} / {result.subjects.length * 100}</p>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Percentage</p>
                            <p className="text-2xl font-bold text-primary">{result.percentage}%</p>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg col-span-2 md:col-span-1">
                            <p className="text-sm font-medium text-muted-foreground">Grade</p>
                            <Badge className={`text-2xl font-bold text-white px-4 py-1 ${getGradeColor(result.grade)}`}>{result.grade}</Badge>
                        </div>
                    </div>
                </CardContent>
              </Card>
            )}

            {searched && !isLoading && !result && (
                <div className="text-center mt-12 flex flex-col items-center">
                    <XCircle className="h-16 w-16 text-destructive mb-4"/>
                    <h3 className="text-xl font-semibold">No Result Found</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        We could not find a report card for the roll number you entered. Please verify the number and try again.
                    </p>
                </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
