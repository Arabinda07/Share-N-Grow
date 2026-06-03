import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { SERVICES } from '../types';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircleIcon as CheckCircle2, ExclamationCircleIcon as AlertCircle } from '@heroicons/react/24/outline';
import { Link, useSearchParams } from 'react-router-dom';

export function Hire() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const preselectedArtistId = searchParams.get('artist');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const honeypot = formData.get('_botcheck') as string;
    if (honeypot) {
      console.warn("Bot detected.");
      setIsSuccess(true);
      return;
    }

    if (!hasSupabaseConfig) {
      setError("Database is not configured. (Developer: check Supabase credentials)");
      return;
    }

    setIsSubmitting(true);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('contact') as string,
      email: formData.get('email') as string,
      city: formData.get('city') as string,
      area: formData.get('area') as string,
      service_needed: formData.get('service') as string,
      budget_range: formData.get('budget') as string,
      deadline: formData.get('deadline') as string,
      description: formData.get('details') as string,
      reference_url: formData.get('reference') as string,
      selected_artist_id: preselectedArtistId || null,
    };

    const { error: dbError } = await supabase.from('inquiries').insert([data]);

    setIsSubmitting(false);

    if (dbError) {
      console.error(dbError);
      setError("Something went wrong submitting your request. Please try again.");
    } else {
      setIsSuccess(true);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 py-20 text-center">
        <CheckCircle2 className="mb-6 h-16 w-16 text-terracotta" />
        <h2 className="mb-4 text-3xl font-bold text-ink">We have your request.</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          We'll review your project details and message you on WhatsApp to set up an introduction.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 sm:py-32 lg:px-8 min-h-[90vh]">
      <Helmet>
        <title>Hire an Artist | ShareNGrow</title>
        <meta name="description" content="Request custom art work, murals, live event art, or find a drawing teacher. We match you with vetted local professionals." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/hire" />
      </Helmet>
      <div className="mb-10 md:mb-14 text-center px-4">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold font-sans tracking-tighter text-ink leading-[1.1]">Hire an artist</h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-ink-light max-w-2xl mx-auto leading-relaxed">
          Tell us what you need. We'll review the brief and introduce you to an artist who can do it.
        </p>
      </div>

      <Card className="border-whisper bg-white rounded-[2.5rem] shadow-none p-4 sm:p-8">
        <CardContent className="pt-6">
          {!hasSupabaseConfig && (
             <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-900 border border-red-200">
               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
               <p className="text-sm font-medium">Database is not configured. Please add Supabase credentials in the settings.</p>
             </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-900 border border-red-200">
              {error}
            </div>
          )}
          
          {preselectedArtistId && (
            <div className="mb-6 rounded-xl bg-paper p-4 text-sm text-ink flex items-start gap-3 border border-whisper">
               <CheckCircle2 className="mt-0.5 h-5 w-5 text-pine shrink-0" />
               <p>We see you selected an artist. We'll reach out to them first to check availability.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
             <input type="text" name="_botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

             <div className="space-y-6">
               <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Client Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Full Name *</label>
                  <Input name="name" required placeholder="Name" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="contact" required placeholder="Phone number" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Email (Optional)</label>
                  <Input name="email" type="email" placeholder="email@example.com" className="rounded-xl border-whisper h-12" />
              </div>
             </div>

             <div className="space-y-6 pt-6">
               <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Location</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g., Kolkata" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g., Salt Lake" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6">
               <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Project Details</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Service Needed *</label>
                <select
                  name="service"
                  required
                  className="flex h-12 w-full rounded-xl border border-whisper bg-white px-4 py-2 text-base text-ink focus:outline-none focus:ring-1 focus:ring-ink transition-shadow"
                >
                  <option value="">Select a service...</option>
                  <option value="drawing-teacher">Drawing teacher for child</option>
                  <option value="wall-mural">Wall mural</option>
                  <option value="live-event-art">Live event artist</option>
                  <option value="portrait-custom-artwork">Portrait or custom artwork</option>
                  <option value="workshop">Workshop for school/office</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="₹" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Date/Deadline</label>
                  <Input name="deadline" placeholder="E.g. Next month" className="rounded-xl border-whisper h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Short Description *</label>
                <Textarea 
                  name="details" 
                  required 
                  placeholder="Give us an idea of what you need..." 
                  className="min-h-[140px] rounded-xl border-whisper p-4"
                />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Reference Image or Link (Optional)</label>
                  <Input name="reference" placeholder="Drive / Pinterest link" className="rounded-xl border-whisper h-12" />
              </div>
            </div>

            <div className="flex items-start gap-4 pt-6">
               <input id="consent" type="checkbox" required className="mt-1 h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper rounded" />
               <label htmlFor="consent" className="text-base text-ink-light leading-relaxed cursor-pointer">
                 I agree to be contacted via WhatsApp or phone. My details won't be made public.
               </label>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full h-16 text-lg bg-ink hover:bg-ink-light text-white rounded-2xl transition-transform active:scale-[0.98]" disabled={isSubmitting || !hasSupabaseConfig}>
                {isSubmitting ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                ) : "Send Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
