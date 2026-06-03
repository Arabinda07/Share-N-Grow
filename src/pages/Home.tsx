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
  <div className="md:hidden fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
    <div className="bg-ink/90 backdrop-blur-md text-white p-2.5 rounded-full shadow-2xl flex items-center justify-between pointer-events-auto border border-white/10 w-full max-w-[340px] transition-transform duration-300">
      <span className="text-sm font-medium pl-4 opacity-90 pr-2">Are you an artist?</span>
      <a href="https://chat.whatsapp.com/JtEre6AP4zaEXgJVu8edVe" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-[#FFFFFF] hover:bg-[#1DA851] font-semibold text-sm px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-sm inline-flex items-center gap-2">
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

    // Image Scale & Fade Scroll for grid items
    gsap.utils.toArray('.bento-item').forEach((item: any) => {
      gsap.fromTo(item, 
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 1.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 50%',
            scrub: true,
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
      { opacity: 0.2 },
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
        <h1 className="hero-element text-[clamp(2.75rem,8vw,7rem)] font-bold font-serif tracking-tighter text-ink leading-[1] mb-8 md:mb-10 max-w-[900px]">
          Find the right <br /> local artist.
        </h1>
        <p className="hero-element text-xl md:text-3xl text-ink-light leading-snug max-w-[35ch] mb-10 md:mb-14">
          Direct introductions to vetted muralists, drawing teachers, and live event artists. 
        </p>
        <div className="hero-element flex flex-col sm:flex-row items-start justify-start gap-4 w-full">
          <Link to="/hire">
            <Button size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-base md:text-lg font-medium shadow-[0_10px_30px_-10px_rgba(28,25,23,0.2)] bg-ink hover:bg-ink-light text-white rounded-2xl transition-transform active:scale-[0.98]">
              Hire an artist
            </Button>
          </Link>
          <Link to="/join">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-base md:text-lg font-medium bg-transparent border-whisper text-ink hover:bg-paper-dark shadow-none rounded-2xl transition-transform active:scale-[0.98]">
              Apply to directory
            </Button>
          </Link>
        </div>
      </section>

      {/* Gapless Bento Grid Focus */}
      <section className="py-24 md:py-48 px-4 sm:px-6 lg:px-8 bg-white border-t border-whisper relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(250px,auto)] grid-flow-dense gap-4 md:gap-6">
            
            <div className="bento-item md:col-span-8 md:row-span-2 relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group bg-ink text-white p-8 md:p-10 flex flex-col justify-end min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink to-ink-light opacity-90"></div>
              <div className="relative z-10">
                <span className="text-white/70 font-semibold tracking-widest text-[11px] md:text-[13px] uppercase mb-4 block">Wall Murals & Public Art</span>
                <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 max-w-lg leading-tight">Paint a blank wall.</h3>
                <p className="text-lg md:text-xl text-white/80 max-w-md mb-8 md:mb-10 leading-relaxed">We connect you with painters who handle large-format typography, illustration, and commercial branding.</p>
                <Link to="/hire" className="inline-flex items-center text-sm font-medium tracking-wide uppercase hover:text-terracotta transition-colors">
                  Contact an artist <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bento-item md:col-span-4 md:row-span-1 border border-whisper rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-10 bg-white shadow-none flex flex-col justify-center relative overflow-hidden group">
               <h3 className="text-xl md:text-2xl font-bold text-ink mb-3 md:mb-4 group-hover:text-terracotta transition-colors">Drawing Teachers</h3>
               <p className="text-ink-light text-base md:text-lg leading-relaxed">Foundational drawing, charcoal, and acrylics. In-home or private studios.</p>
               <Link to="/hire" className="mt-6 md:mt-8 inline-flex items-center text-sm font-medium text-ink hover:text-terracotta transition-colors">
                 Find a teacher <ArrowRight className="ml-1 h-3.5 w-3.5" />
               </Link>
            </div>

            <div className="bento-item md:col-span-4 md:row-span-1 border border-whisper rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-10 bg-white shadow-none flex flex-col justify-center relative overflow-hidden group">
               <h3 className="text-xl md:text-2xl font-bold text-ink mb-3 md:mb-4 group-hover:text-terracotta transition-colors">Live Event Art</h3>
               <p className="text-ink-light text-base md:text-lg leading-relaxed">Fast watercolors, live canvas painting, and caricatures for events.</p>
               <Link to="/hire" className="mt-6 md:mt-8 inline-flex items-center text-sm font-medium text-ink hover:text-terracotta transition-colors">
                 Book for an event <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
               <span className="absolute -left-[9px] md:-left-[10px] top-2 md:top-3 w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-paper border-[4px] border-ink rounded-full"></span>
               <h3 className="text-2xl md:text-4xl font-bold text-ink mb-4 md:mb-6">Request</h3>
               <p className="text-lg md:text-2xl leading-relaxed text-ink-light">Send us the wall dimensions, event dates, or what you want to learn. We keep it private.</p>
            </div>
            <div className="pl-8 md:pl-12 border-l-2 border-whisper relative bento-item">
               <span className="absolute -left-[9px] md:-left-[10px] top-2 md:top-3 w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-paper border-[4px] border-ink rounded-full"></span>
               <h3 className="text-2xl md:text-4xl font-bold text-ink mb-4 md:mb-6">Review</h3>
               <p className="text-lg md:text-2xl leading-relaxed text-ink-light">We check our roster for medium, location, and your budget to find the artist whose work fits.</p>
            </div>
            <div className="pl-8 md:pl-12 border-l-2 border-whisper relative bento-item">
               <span className="absolute -left-[9px] md:-left-[10px] top-2 md:top-3 w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-paper border-[4px] border-ink rounded-full"></span>
               <h3 className="text-2xl md:text-4xl font-bold text-ink mb-4 md:mb-6">Introduction</h3>
               <p className="text-lg md:text-2xl leading-relaxed text-ink-light">We set up a chat between you and the artist. You handle the timeline and budget with them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Community Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-white border-t border-whisper flex justify-center">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="h-16 w-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mb-6">
              <WhatsappLogo className="w-8 h-8 text-[#25D366]" weight="regular" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight text-ink mb-4">Join the Community</h2>
            <p className="text-lg md:text-xl text-ink-light leading-relaxed">
              Our main goal is to connect artists and clients directly. Join our WhatsApp community to stay updated on new projects, workshops, and calls for artists.
            </p>
          </div>
          <div className="shrink-0">
            <a href="https://chat.whatsapp.com/JtEre6AP4zaEXgJVu8edVe" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-medium rounded-2xl text-[#FFFFFF] bg-[#25D366] hover:bg-[#1DA851] shadow-lg shadow-[#25D366]/20 transition-all active:scale-[0.98]">
              Join the Community
            </a>
          </div>
        </div>
      </section>

      <MobileBottomCTA />
    </div>
  );
}

