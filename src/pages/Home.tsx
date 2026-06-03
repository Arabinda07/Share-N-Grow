import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { WhatsappLogo } from '@phosphor-icons/react';
import { ArrowRightIcon as ArrowRight } from '@radix-ui/react-icons';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Mobile Contextual Bottom Sticky CTA
const MobileBottomCTA = () => (
  <div className="md:hidden fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center mobile-cta-element">
    <div className="bg-ink/90 backdrop-blur-md text-white p-2.5 rounded-full shadow-2xl flex items-center justify-between pointer-events-auto border border-white/10 w-full max-w-[340px] transition-transform duration-300">
      <span className="text-sm font-medium pl-4 opacity-90 pr-2">Are you an artist?</span>
      <a href="https://chat.whatsapp.com/JtEre6AP4zaEXgJVu8edVe" target="_blank" rel="noopener noreferrer" className="bg-terracotta text-white hover:bg-terracotta-dark font-semibold text-sm px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-sm inline-flex items-center gap-2">
        <WhatsappLogo weight="fill" className="w-4 h-4" /> Join Us
      </a>
    </div>
  </div>
);

export function Home() {
  const container = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Hero Entrance
    gsap.from('.hero-element', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
    });

    // Fade Scroll for category items
    gsap.utils.toArray('.bento-item').forEach((item: any) => {
      gsap.fromTo(item, 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        }
      );
    });

    // Scroll Pinning for Workflow
    ScrollTrigger.matchMedia({
      "(min-width: 1024px)": function() {
        ScrollTrigger.create({
          trigger: '.workflow-container',
          start: 'top 20%',
          end: 'bottom 80%',
          pin: '.workflow-title',
        });
      }
    });
    
    // Scrubbing Text Reveal
    gsap.fromTo('.reveal-text', 
      { opacity: 0.4 },
      { 
        opacity: 1,
        scrollTrigger: {
          trigger: '.reveal-section',
          start: 'top 70%',
          end: 'center center',
          scrub: true,
        }
      }
    );

    // Mobile Bottom CTA element pop-up
    gsap.from('.mobile-cta-element', {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.8,
      ease: 'back.out(1.2)',
    });

  }, { scope: container });

  return (
    <div className="flex flex-col bg-paper min-h-screen" ref={container}>
      <Helmet>
        <title>ShareNGrow | Hire Local Artists</title>
        <meta name="description" content="Connect directly with vetted drawing teachers, muralists, and live event artists." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/" />
      </Helmet>
      
      {/* Editorial Left-Aligned Hero */}
      <section className="relative px-6 pt-28 md:pt-40 pb-24 md:pb-48 lg:px-12 w-full max-w-7xl mx-auto flex flex-col items-start justify-center">
        <h1 className="text-[clamp(2.75rem,8vw,7rem)] font-bold font-serif tracking-tighter text-ink leading-[1] mb-8 md:mb-10 max-w-[900px] animate-in fade-in duration-1000 slide-in-from-bottom-8">
          Find the right <br /> local artist.
        </h1>
        <p className="text-xl md:text-3xl text-ink-light leading-snug max-w-[35ch] mb-10 md:mb-14 animate-in fade-in duration-1000 delay-150 slide-in-from-bottom-8 fill-mode-both">
          Direct introductions to vetted muralists, drawing teachers, and live event artists. 
        </p>
        <div className="flex flex-col sm:flex-row items-start justify-start gap-4 w-full animate-in fade-in duration-1000 delay-300 slide-in-from-bottom-8 fill-mode-both">
          <Link to="/hire">
            <Button size="lg" className="w-full sm:w-auto">
              Hire an Artist
            </Button>
          </Link>
          <Link to="/join">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Join the Community
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Focus */}
      <section className="py-24 md:py-40 px-6 lg:px-12 bg-paper-dark relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-24">
            
            <div className="bento-item flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-16 pb-12 border-b border-whisper group select-none">
              <div className="flex-1 max-w-2xl">
                <span className="text-secondary-dark font-semibold tracking-[0.15em] text-xs uppercase mb-6 block">01 / Wall Murals & Public Art</span>
                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-[1.05]">Turn a blank wall into art.</h2>
                <p className="text-lg md:text-xl text-ink-light leading-relaxed">Connect with painters who handle large-format typography, illustration, and commercial branding for your specific project.</p>
              </div>
              <div className="shrink-0 pt-4 md:pt-0">
                <Link to="/hire" className="inline-flex items-center text-sm font-semibold tracking-wide uppercase group-hover:text-terracotta transition-colors">
                  Contact an artist <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bento-item flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-16 pb-12 border-b border-whisper group select-none">
              <div className="flex-1 max-w-2xl">
                 <span className="text-secondary-dark font-semibold tracking-[0.15em] text-xs uppercase mb-6 block">02 / Drawing Teachers</span>
                 <h2 className="text-3xl md:text-5xl font-bold font-serif text-ink mb-6 leading-[1.05]">Foundational skills.</h2>
                 <p className="text-ink-light text-lg md:text-xl leading-relaxed">Charcoal, acrylics, and sketching basics. Find patient, skilled teachers for in-home lessons or private studio sessions.</p>
              </div>
              <div className="shrink-0 pt-4 md:pt-0">
                <Link to="/hire" className="inline-flex items-center text-sm font-semibold tracking-wide uppercase group-hover:text-terracotta transition-colors">
                  Find a teacher <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bento-item flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-16 pb-12 border-b border-whisper group select-none">
              <div className="flex-1 max-w-2xl">
                 <span className="text-secondary-dark font-semibold tracking-[0.15em] text-xs uppercase mb-6 block">03 / Live Event Art</span>
                 <h2 className="text-3xl md:text-5xl font-bold font-serif text-ink mb-6 leading-[1.05]">Live canvas painting.</h2>
                 <p className="text-ink-light text-lg md:text-xl leading-relaxed">Hire artists for fast watercolors, live canvas painting, and caricatures to capture memories right as they happen.</p>
              </div>
              <div className="shrink-0 pt-4 md:pt-0">
                <Link to="/hire" className="inline-flex items-center text-sm font-semibold tracking-wide uppercase group-hover:text-terracotta transition-colors">
                  Book for an event <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </div>
            </div>

        </div>
      </section>

      {/* GSAP Pinned Scrubbing Text */}
      <section className="reveal-section py-32 md:py-48 bg-ink text-white relative flex flex-col justify-center min-h-[60vh] md:min-h-[80vh]">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <h2 className="reveal-text text-3xl md:text-6xl lg:text-[5rem] font-serif font-medium leading-[1.1] md:leading-[1.05] tracking-tight text-white text-left max-w-5xl">
              Tell us what you need. We skip the job boards and introduce you straight to an artist who can do it.
            </h2>
         </div>
      </section>

      {/* Pinned Workflow Section */}
      <section className="workflow-container py-24 md:py-56 px-6 lg:px-12 bg-paper">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 md:gap-16 lg:gap-32 items-start">
          <div className="workflow-title lg:col-span-6 md:h-[50vh] flex flex-col justify-center">
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold font-serif tracking-tight text-ink mb-4 md:mb-8 leading-[1]">How it works</h2>
            <p className="text-xl md:text-2xl text-ink-light leading-snug">We read your brief. We check portfolios. We make the intro.</p>
          </div>
          <div className="lg:col-span-6 space-y-16 md:space-y-32 py-10 md:py-[25vh]">
            <div className="pl-8 md:pl-12 border-l-2 border-whisper relative bento-item">
               <span className="absolute -left-[9px] md:-left-[10px] top-2 md:top-3 w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-paper-dark border-[4px] border-secondary-dark rounded-full shadow-lg shadow-secondary-dark/40"></span>
               <h3 className="text-2xl md:text-4xl font-bold text-ink mb-4 md:mb-6">Request</h3>
               <p className="text-lg md:text-2xl leading-relaxed text-ink-light">Send us the wall dimensions, event dates, or what you want to learn. We keep it private.</p>
            </div>
            <div className="pl-8 md:pl-12 border-l-2 border-whisper relative bento-item">
               <span className="absolute -left-[9px] md:-left-[10px] top-2 md:top-3 w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-paper-dark border-[4px] border-secondary-dark rounded-full shadow-lg shadow-secondary-dark/40"></span>
               <h3 className="text-2xl md:text-4xl font-bold text-ink mb-4 md:mb-6">Review</h3>
               <p className="text-lg md:text-2xl leading-relaxed text-ink-light">We check our roster for medium, location, and your budget to find the artist whose work fits.</p>
            </div>
            <div className="pl-8 md:pl-12 border-l-2 border-whisper relative bento-item">
               <span className="absolute -left-[9px] md:-left-[10px] top-2 md:top-3 w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-paper-dark border-[4px] border-terracotta rounded-full shadow-lg shadow-terracotta/30"></span>
               <h3 className="text-2xl md:text-4xl font-bold text-ink mb-4 md:mb-6">Introduction</h3>
               <p className="text-lg md:text-2xl leading-relaxed text-ink-light">We set up a chat between you and the artist. You handle the timeline and budget with them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Community Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-secondary/15 border-t border-secondary/20 flex justify-center">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight text-ink mb-4">Join the Community</h2>
            <p className="text-lg md:text-xl text-ink-light leading-relaxed">
              Our main goal is to connect artists and clients directly. Join our WhatsApp community to stay updated on new projects, workshops, and calls for artists.
            </p>
          </div>
          <div className="shrink-0">
            <a href="https://chat.whatsapp.com/JtEre6AP4zaEXgJVu8edVe" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-medium rounded-2xl text-white bg-terracotta hover:opacity-90 transition-opacity">
              Join Us
            </a>
          </div>
        </div>
      </section>

      <MobileBottomCTA />
    </div>
  );
}

