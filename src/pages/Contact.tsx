import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '../components/ui/card';
import { EnvelopeSimple, Phone } from '@phosphor-icons/react';

export function Contact() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 sm:py-32 lg:px-8 min-h-[90vh]">
      <Helmet>
        <title>Contact Us | ShareNGrow</title>
        <meta name="description" content="Get in touch with ShareNGrow." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/contact" />
      </Helmet>
      
      <div className="mb-14 md:mb-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter text-ink mb-6">Contact Us</h1>
        <p className="text-ink-light leading-relaxed text-lg max-w-xl">
          Have questions or want to learn more about our network? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-whisper bg-white rounded-[2.5rem] shadow-none flex flex-col justify-start items-start text-left p-8 md:p-10">
          <CardContent className="p-0">
             <div className="h-16 w-16 mb-6 rounded-full bg-paper flex items-center justify-center">
                <EnvelopeSimple className="h-6 w-6 text-ink" />
             </div>
             <h3 className="text-2xl font-bold text-ink mb-2">Email</h3>
             <p className="text-ink-light mb-6">Drop us a line anytime.</p>
             <a href="mailto:sharengrowofficial@gmail.com" className="text-terracotta font-medium hover:underline text-lg">
               sharengrowofficial@gmail.com
             </a>
          </CardContent>
        </Card>

        <Card className="border-whisper bg-white rounded-[2.5rem] shadow-none flex flex-col justify-start items-start text-left p-8 md:p-10">
          <CardContent className="p-0">
             <div className="h-16 w-16 mb-6 rounded-full bg-paper flex items-center justify-center">
                <Phone className="h-6 w-6 text-ink" />
             </div>
             <h3 className="text-2xl font-bold text-ink mb-2">Phone</h3>
             <p className="text-ink-light mb-6">Call or WhatsApp us.</p>
             <a href="tel:+917031584487" className="text-terracotta font-medium hover:underline text-lg">
               +91 7031584487
             </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
