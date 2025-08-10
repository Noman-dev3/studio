
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdmissionsForm } from '@/components/admissions-form';

export default function AdmissionsPage() {
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
              <AdmissionsForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
