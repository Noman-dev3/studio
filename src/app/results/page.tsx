
'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, XCircle, FileSpreadsheet, User, Hash, School, Calendar as CalendarIcon, Info } from 'lucide-react';
import { db, StudentResult } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ResultsPage() {
  const { toast } = useToast();
  const [allResults, setAllResults] = React.useState<StudentResult[]>([]);
  const [filteredResults, setFilteredResults] = React.useState<StudentResult[]>([]);
  const [selectedResult, setSelectedResult] = React.useState<StudentResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        const resultsData = await db.getResults();
        setAllResults(resultsData);
        setFilteredResults(resultsData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load results data.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [toast]);

  React.useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredResults(allResults);
      return;
    }
    const filtered = allResults.filter(
      (result) =>
        result.student_name.toLowerCase().includes(query) ||
        result.roll_number.toLowerCase().includes(query) ||
        result.class.toLowerCase().includes(query)
    );
    setFilteredResults(filtered);
  }, [searchQuery, allResults]);

  const handleViewResult = (result: StudentResult) => {
    setSelectedResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearSelection = () => {
      setSelectedResult(null);
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-500';
    if (grade === 'B') return 'bg-blue-500';
    if (grade === 'C') return 'bg-yellow-500';
    if (grade === 'D') return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Student Results</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                View published report cards. Use the search bar to filter by name, roll number, or class.
              </p>
            </div>

            {selectedResult && (
              <Card className="max-w-4xl mx-auto mt-12 mb-8 shadow-2xl">
                 <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg p-6 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-primary-foreground hover:bg-white/20 hover:text-white" onClick={handleClearSelection}>
                        <XCircle />
                    </Button>
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-2"/>
                    <CardTitle className="text-3xl">Student Report Card</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mb-8 text-sm">
                       <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary"/>
                            <div><p className="font-semibold">Student Name</p><p className="text-muted-foreground">{selectedResult.student_name}</p></div>
                       </div>
                       <div className="flex items-center gap-2">
                            <Hash className="h-5 w-5 text-primary"/>
                             <div><p className="font-semibold">Roll Number</p><p className="text-muted-foreground">{selectedResult.roll_number}</p></div>
                       </div>
                       <div className="flex items-center gap-2">
                            <School className="h-5 w-5 text-primary"/>
                             <div><p className="font-semibold">Class</p><p className="text-muted-foreground">{selectedResult.class}</p></div>
                       </div>
                       <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary"/>
                            <div><p className="font-semibold">Session</p><p className="text-muted-foreground">{selectedResult.session}</p></div>
                       </div>
                    </div>
                    <Separator className="my-6"/>
                    <Table>
                        <TableHeader><TableRow><TableHead className="text-base">Subject</TableHead><TableHead className="text-right text-base">Marks Obtained</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {Object.entries(selectedResult.subjects).map(([name, marks]) => (
                                <TableRow key={name} className="text-base"><TableCell className="font-medium">{name}</TableCell><TableCell className="text-right">{String(marks)}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     <Separator className="my-6"/>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-secondary p-4 rounded-lg"><p className="text-sm font-medium text-muted-foreground">Total Marks</p><p className="text-2xl font-bold text-primary">{selectedResult.total_marks}</p></div>
                        <div className="bg-secondary p-4 rounded-lg"><p className="text-sm font-medium text-muted-foreground">Max Marks</p><p className="text-2xl font-bold text-primary">{selectedResult.max_marks}</p></div>
                        <div className="bg-secondary p-4 rounded-lg"><p className="text-sm font-medium text-muted-foreground">Percentage</p><p className="text-2xl font-bold text-primary">{selectedResult.percentage}%</p></div>
                        <div className="bg-secondary p-4 rounded-lg"><p className="text-sm font-medium text-muted-foreground">Grade</p><Badge className={`text-2xl font-bold text-white px-4 py-1 ${getGradeColor(selectedResult.grade)}`}>{selectedResult.grade}</Badge></div>
                    </div>
                </CardContent>
              </Card>
            )}

            <Card className="max-w-5xl mx-auto mt-12">
              <CardHeader>
                <CardTitle>Published Results</CardTitle>
                <CardDescription>
                  A list of all student results that have been published by the administration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, roll no, or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-base"
                  />
                </div>

                {isLoading ? (
                  <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p className="text-muted-foreground mt-2">Loading results...</p></div>
                ) : filteredResults.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Roll Number</TableHead><TableHead>Student Name</TableHead><TableHead>Class</TableHead><TableHead>Grade</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredResults.map((result, index) => (
                        <TableRow key={`${result.roll_number}-${result.student_name}-${index}`}>
                          <TableCell className="font-medium">{result.roll_number}</TableCell>
                          <TableCell>{result.student_name}</TableCell>
                          <TableCell>{result.class}</TableCell>
                          <TableCell><Badge variant={result.grade === 'F' ? 'destructive' : 'default'}>{result.grade}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => handleViewResult(result)}>View Report Card</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 px-4 bg-secondary/50 rounded-lg">
                    <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No Matching Results Found</h3>
                    <p className="text-muted-foreground mt-2">
                      Your search for "{searchQuery}" did not match any published results.
                    </p>
                  </div>
                )}
                 {allResults.length === 0 && !isLoading && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No Results Published</AlertTitle>
                        <AlertDescription>
                            There are currently no results published. Please check back later or contact the school administration.
                        </AlertDescription>
                    </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
