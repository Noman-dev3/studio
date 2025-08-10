
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Announcements } from "@/components/sections/announcements";
import { About } from "@/components/sections/about";
import { Teachers } from "@/components/sections/teachers";
import { Gallery } from "@/components/sections/gallery";
import { Testimonials } from "@/components/sections/testimonials";
import { Events } from "@/components/sections/events";
import { Location } from "@/components/sections/location";
import { Contact } from "@/components/sections/contact";
import { Toppers } from "@/components/sections/toppers";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Announcements />
        <Toppers />
        <About />
        <Teachers />
        <Gallery />
        <Testimonials />
        <Events />
        <Location />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
