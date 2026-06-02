import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Palette, Brush, Users, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-paper py-24 px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-4xl font-bold font-serif tracking-tight text-ink sm:text-5xl md:text-6xl text-balance">
            Find trusted local artists for classes, murals, events, and custom art in Bengal.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-ink-light md:text-xl text-balance">
            ShareNGrow connects parents, schools, cafés, offices, event organisers, and local businesses with curated artists from the community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/hire">
              <Button size="lg" variant="brand" className="w-full sm:w-auto h-12 px-8 text-base shadow-sm">
                Request an artist
              </Button>
            </Link>
            <Link to="/join">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-white border-stone-300 shadow-sm">
                Apply as artist
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What do you need? */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif tracking-tight text-ink sm:text-4xl">What do you need?</h2>
            <p className="mt-4 text-lg text-ink-light">Select a service to get started.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Link to="/drawing-teachers" className="group h-full">
              <Card className="h-full border-stone-200 transition-all hover:border-terracotta hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-dark text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                    <Palette className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-terracotta transition-colors">Drawing teacher for children</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-ink-light">
                    Find home tutors or local classes for basic drawing, sketching, and hobby art.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/wall-murals" className="group h-full">
              <Card className="h-full border-stone-200 transition-all hover:border-terracotta hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-dark text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                    <Brush className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-terracotta transition-colors">Wall mural for café, office, school, or home</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-ink-light">
                    Turn a blank wall into a custom painted space. Indoor and outdoor artists available.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/events-live-art" className="group h-full">
              <Card className="h-full border-stone-200 transition-all hover:border-terracotta hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-dark text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-terracotta transition-colors">Live artist for wedding or event</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-ink-light">
                    Book artists for live sketching, guest caricatures, and event painting.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
          
           <div className="mt-12 text-center">
             <Link to="/hire" className="text-terracotta font-medium hover:underline inline-flex items-center">
               Need something else? View all services 
               <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
             </Link>
           </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-paper py-24 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif tracking-tight text-ink sm:text-4xl">How it works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-medium text-ink">Tell us what you need</h3>
              <p className="text-ink-light max-w-xs">Fill out a simple form with your location, service needed, and budget.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-medium text-ink">We review and shortlist</h3>
              <p className="text-ink-light max-w-xs">Our team reviews your request and finds suitable artists from the local community.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-medium text-ink">You speak to the artist</h3>
              <p className="text-ink-light max-w-xs">We introduce you via WhatsApp. Discuss details directly with the artist and confirm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Note */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
           <ShieldCheck className="w-12 h-12 text-pine mb-6" />
           <p className="text-lg text-ink-light leading-relaxed font-medium">
             ShareNGrow manually reviews artist profiles and portfolio samples before making introductions. Private contact details are not shared publicly.
           </p>
        </div>
      </section>
    </div>
  );
}
