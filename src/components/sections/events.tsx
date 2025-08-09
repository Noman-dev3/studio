import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const events = [
  {
    date: "NOV 25",
    title: "Annual Science Fair",
    description: "Showcasing innovative projects from our talented students. Open to all parents and guardians."
  },
  {
    date: "DEC 15",
    title: "Annual Sports Day",
    description: "A day of friendly competition, teamwork, and athletic achievement. Come cheer for our students!"
  },
  {
    date: "JAN 10",
    title: "Charity Bake Sale",
    description: "Raising funds for local community projects. Your support can make a huge difference."
  },
  {
    date: "FEB 05",
    title: "International Day Celebration",
    description: "A vibrant celebration of the diverse cultures within our school community."
  }
];

export function Events() {
  return (
    <section id="events" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Upcoming Events</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us for our upcoming events and be a part of the vibrant PIISS community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event, index) => (
            <Card key={index} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="flex-grow">
                <div className="flex items-center text-destructive font-bold mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{event.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                  <Button variant="link" className="p-0 h-auto">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
