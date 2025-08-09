'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleSmartSearch } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Search, BrainCircuit, AlertTriangle, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from './ui/separator';

const searchSchema = z.object({
  query: z.string().min(3, { message: 'Search query must be at least 3 characters.' }),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export function SmartSearch() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<string[] | null>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = async (data: SearchFormValues) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    const response = await handleSmartSearch({ query: data.query });
    if (response.success && response.data) {
      setResults(response.data.results);
    } else {
      setError(response.message || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  React.useEffect(() => {
    if(isOpen) {
        form.reset();
        setResults(null);
        setError(null);
        setIsLoading(false);
    }
  }, [isOpen, form])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Smart Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            AI-Powered Smart Search
          </DialogTitle>
          <DialogDescription>
            Ask anything about our school, programs, or events.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="e.g., 'What are the admission requirements?'" {...field} className="pr-12"/>
                      <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <div className="mt-4 min-h-[200px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Searching...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-destructive bg-destructive/10 p-4 rounded-md">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Search Failed</p>
              <p className="text-sm text-center">{error}</p>
            </div>
          )}
          {results && (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle className="text-green-600"/>
                    Search Results
                </h3>
                <ScrollArea className="h-[250px] w-full rounded-md border p-4">
                    <ul className="space-y-3">
                        {results.length > 0 ? results.map((result, index) => (
                        <li key={index} className="pb-3 border-b last:border-b-0">
                            {result}
                        </li>
                        )) : (
                            <p>No results found for your query.</p>
                        )}
                    </ul>
                </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
