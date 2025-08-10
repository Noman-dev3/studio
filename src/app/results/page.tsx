
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResultsClient } from '@/components/results-client';

export default function ResultsPage() {

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
            <ResultsClient />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
