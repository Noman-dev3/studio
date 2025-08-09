import { Megaphone } from 'lucide-react';

export function Announcements() {
  const newsItems = [
    "Annual Sports Day on December 15th. All are welcome!",
    "Parent-Teacher meetings scheduled for the last week of November.",
    "Admissions for the 2024-2025 academic year are now open.",
    "Science Fair submissions are due by November 10th.",
    "School will be closed for a national holiday on November 1st."
  ];

  const fullText = newsItems.join(' ••• ');

  return (
    <section id="announcements" className="bg-primary text-primary-foreground relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center overflow-hidden">
            <div className="flex-shrink-0 mr-4">
                <Megaphone className="w-6 h-6" />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="ticker-wrap relative w-full">
                    <div className="ticker-move absolute whitespace-nowrap">
                        <p className="inline-block font-medium">{fullText}</p>
                        <p className="inline-block font-medium pl-16">{fullText}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
