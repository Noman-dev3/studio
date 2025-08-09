import { PiissLogo } from "@/components/icons/piiss-logo";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <PiissLogo className="h-8 w-auto" />
            <p className="text-sm">
              Fostering excellence in education and character within a nurturing Islamic environment.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#about" className="hover:text-primary dark:hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link href="#teachers" className="hover:text-primary dark:hover:text-primary-foreground transition-colors">Faculty</Link></li>
              <li><Link href="#events" className="hover:text-primary dark:hover:text-primary-foreground transition-colors">Events</Link></li>
              <li><Link href="#contact" className="hover:text-primary dark:hover:text-primary-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start"><MapPin className="w-5 h-5 mr-3 mt-1 shrink-0" /><span>123 Education Lane, Knowledge City, 12345</span></li>
              <li className="flex items-center"><Phone className="w-5 h-5 mr-3 shrink-0" /><span>+1 (234) 567-890</span></li>
              <li className="flex items-center"><Mail className="w-5 h-5 mr-3 shrink-0" /><span>contact@piiss.edu</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-secondary-foreground hover:text-primary dark:hover:text-primary-foreground transition-colors"><Facebook /></Link>
              <Link href="#" className="text-secondary-foreground hover:text-primary dark:hover:text-primary-foreground transition-colors"><Twitter /></Link>
              <Link href="#" className="text-secondary-foreground hover:text-primary dark:hover:text-primary-foreground transition-colors"><Instagram /></Link>
              <Link href="#" className="text-secondary-foreground hover:text-primary dark:hover:text-primary-foreground transition-colors"><Linkedin /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Pakistan Islamic International School System. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
