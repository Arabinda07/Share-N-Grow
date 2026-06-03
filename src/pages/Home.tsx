import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { SwatchIcon as Palette, PaintBrushIcon as Brush, UsersIcon as Users, ShieldCheckIcon as ShieldCheck, MapPinIcon as MapPin, ArrowRightIcon as ArrowRight } from '@heroicons/react/24/outline';

export function Home() {
  return (
    <div className="flex flex-col bg-paper min-h-screen">
      {/* Hero Section - Asymmetrical Split */}
      <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-ink-light/20 bg-paper-dark px-3 py-1 text-sm font-medium text-ink-light mb-8">
              <MapPin className="mr-2 h-4 w-4 text-terracotta" />
              <span>Available across Bengal</span>
            </div>
            <h1 className="text-5xl font-bold font-sans tracking-tighter text-ink sm:text-6xl md:text-7xl leading-[1.1] mb-6">
              Hire local artists for your next project.
            </h1>
            <p className="text-lg text-ink-light md:text-xl leading-relaxed max-w-[55ch] mb-10">
              Connect directly with vetted drawing teachers, muralists, and live event artists. We review portfolios and handle introductions to keep the process simple and secure.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link to="/hire">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-sm bg-ink hover:bg-ink-light text-white rounded-full transition-transform active:scale-[0.98]">
                  Request an artist
                </Button>
              </Link>
              <Link to="/join">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-transparent border-ink-light/20 text-ink hover:bg-paper-dark shadow-none rounded-full transition-transform active:scale-[0.98]">
                  Apply as artist
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Aesthetic Asymmetrical Asset Placeholder */}
          <div className="relative hidden lg:block h-[600px] w-full rounded-[2.5rem] overflow-hidden bg-paper-dark border border-ink-light/10">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-terracotta/40 via-transparent to-transparent"></div>
             {/* This simulates a beautiful, clean display area for artist works. No stock photos, just a structural placeholder that feels architectural */}
             <div className="absolute inset-x-8 bottom-8 top-24 rounded-2xl bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-ink-light/5 p-8 flex flex-col justify-end">
                <div className="h-4 w-1/3 bg-paper-dark rounded-full mb-3" />
                <div className="h-3 w-1/2 bg-paper-dark rounded-full opacity-50" />
             </div>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-ink-light/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-sans tracking-tight text-ink sm:text-4xl">Specialized Services</h2>
            <p className="mt-4 text-lg text-ink-light max-w-xl">Find the right talent for specific needs. We focus on quality introductions for these core disciplines.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Link to="/drawing-teachers" className="group block outline-none">
              <Card className="h-full border border-slate-200/50 bg-white rounded-[2rem] p-8 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-paper-dark text-ink group-hover:bg-terracotta group-hover:text-white transition-colors duration-300">
                  <Palette className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-ink mb-3 group-hover:text-terracotta transition-colors">Drawing Teachers</h3>
                <p className="text-base text-ink-light leading-relaxed">
                  Home tutors or local classes for children. Focus on basic drawing, sketching, and hobby art.
                </p>
              </Card>
            </Link>

            <Link to="/wall-murals" className="group block outline-none">
              <Card className="h-full border border-slate-200/50 bg-white rounded-[2rem] p-8 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-paper-dark text-ink group-hover:bg-terracotta group-hover:text-white transition-colors duration-300">
                  <Brush className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-ink mb-3 group-hover:text-terracotta transition-colors">Wall Murals</h3>
                <p className="text-base text-ink-light leading-relaxed">
                  Turn a blank wall into a custom painted space for cafés, offices, schools, or homes.
                </p>
              </Card>
            </Link>

            <Link to="/events-live-art" className="group block outline-none">
              <Card className="h-full border border-slate-200/50 bg-white rounded-[2rem] p-8 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-paper-dark text-ink group-hover:bg-terracotta group-hover:text-white transition-colors duration-300">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-ink mb-3 group-hover:text-terracotta transition-colors">Live Event Art</h3>
                <p className="text-base text-ink-light leading-relaxed">
                  Live sketching, guest caricatures, and event painting for weddings and corporate gatherings.
                </p>
              </Card>
            </Link>
          </div>
          
           <div className="mt-12 flex justify-end">
             <Link to="/hire" className="group inline-flex items-center text-sm font-medium text-ink hover:text-terracotta transition-colors">
               Explore all services 
               <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
             </Link>
           </div>
        </div>
      </section>

      {/* Clean Workflow Pattern */}
      <section className="bg-paper py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-bold font-sans tracking-tight text-ink sm:text-4xl mb-8">A focused, manual review process.</h2>
            <div className="space-y-12">
              <div className="flex gap-6">
                <span className="font-mono text-terracotta font-medium mt-1">01</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink mb-2">Submit requirements</h3>
                  <p className="text-ink-light leading-relaxed">Share the project scope, location, and budget constraints through our secure form. No public marketplace bidding.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="font-mono text-terracotta font-medium mt-1">02</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink mb-2">Internal matching</h3>
                  <p className="text-ink-light leading-relaxed">We review your needs against our closed network of local artists, verifying availability and portfolio alignment.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="font-mono text-terracotta font-medium mt-1">03</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink mb-2">Direct introduction</h3>
                  <p className="text-ink-light leading-relaxed">You receive a curated WhatsApp introduction to the selected artist to handle final negotiations exclusively.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-10 lg:p-16 border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
             <ShieldCheck className="w-10 h-10 text-terracotta mb-8" />
             <h3 className="text-2xl font-bold tracking-tight text-ink mb-4">Privacy by Default</h3>
             <p className="text-lg text-ink-light leading-relaxed mb-8">
               Unlike open directories, ShareNGrow protects both the client and the artist. Phone numbers, rates, and personal details remain invisible to the public internet. Portfolios are reviewed manually before any introduction is made.
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}

