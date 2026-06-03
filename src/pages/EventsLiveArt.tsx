import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import React, { useState } from 'react';
import { api } from '../lib/api';
import { hasSupabaseConfig } from '../lib/supabase';
import { CheckCircledIcon as CheckCircle2 } from '@radix-ui/react-icons';

export function EventsLiveArt() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!hasSupabaseConfig) {
      setError("Database is not configured. (Developer: check Supabase credentials)");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      city: formData.get('city') as string,
      area: formData.get('area') as string,
      service_needed: 'live-event-art',
      budget_range: formData.get('budget') as string,
      deadline: formData.get('date') as string,
      reference_url: formData.get('reference') as string,
      description: `Event Type: ${formData.get('eventType')}\nGuests: ${formData.get('guests')}\nDuration: ${formData.get('duration')}\nService: ${formData.get('serviceSpecific')}\nNotes: ${formData.get('notes')}`,
    };

    const { error: dbError } = await api.submitInquiry(data);

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
        <CheckCircle2 className="mb-6 h-16 w-16 text-pine" />
        <h2 className="mb-4 text-3xl font-bold font-serif text-ink">We have your request.</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          We'll review your event details and message you on WhatsApp to discuss artist availability.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Hire Live Event Artists | ShareNGrow</title>
        <meta name="description" content="Book live artists for weddings, events, and special gatherings. Live sketching, guest caricatures, and event painting." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/events-live-art" />
      </Helmet>
      <div className="mb-12 mt-6 max-w-4xl mx-auto px-4 md:px-0">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tighter text-ink leading-[1.1] font-serif">Book live artists for weddings and events.</h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-ink-light leading-relaxed">
          We bring fast-flow watercolor caricatures, live guest sketching, and live canvas painting to premium gatherings.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-16 max-w-4xl mx-auto px-4 md:px-0">
        <Card className="border border-whisper bg-paper-dark rounded-2xl shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">Popular services</h3>
            <ul className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Live guest sketching</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Live canvas painting</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Guest caricatures</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Event art booths</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Custom event gifts for guests</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border border-whisper bg-white rounded-2xl shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">Event details we need</h3>
            <ul className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Event date and time</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Venue location</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Expected guest count</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Duration of the service</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Preferred style of art</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-whisper bg-white rounded-2xl shadow-none p-4 sm:p-8 md:p-10" id="request-form">
        <CardContent className="pt-2 md:pt-4">
          <form onSubmit={handleSubmit} className="space-y-12">
             {error && (
              <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-900 border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-8">
              <h3 className="font-semibold text-xl text-ink">Client Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Name *</label>
                  <Input name="name" required placeholder="Full Name or Event Agency" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <h3 className="font-semibold text-xl text-ink">Event Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Event Type *</label>
                  <Input name="eventType" required placeholder="E.g. Wedding, Corporate Party, Birthday..." className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Event Date *</label>
                  <Input name="date" type="date" required className="rounded-xl border-whisper h-12" />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Venue Area *</label>
                  <Input name="area" required placeholder="E.g. Rajarhat" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Guest Count</label>
                  <Input name="guests" placeholder="Approximate number" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Duration Needed</label>
                  <Input name="duration" placeholder="E.g. 3 hours" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <h3 className="font-semibold text-xl text-ink">Art Requirements</h3>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Specific Art Service Needed *</label>
                  <select name="serviceSpecific" required className="flex h-12 w-full rounded-xl border border-whisper bg-white px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none transition-shadow">
                    <option value="">Select...</option>
                    <option value="Live Sketching (Portraits)">Live Sketching (Guest Portraits)</option>
                    <option value="Live Painting (Event Scene)">Live Canvas Painting (Painting the event)</option>
                    <option value="Caricatures">Live Caricatures</option>
                    <option value="Custom Gifts">Custom Art Gifts setup</option>
                    <option value="Other">Other / Not sure</option>
                  </select>
               </div>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Style Reference (Optional)</label>
                  <Input name="reference" placeholder="Link to Pinterest board or Instagram post" className="rounded-xl border-whisper h-12" />
               </div>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" className="rounded-xl border-whisper h-12" />
               </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Additional Notes</label>
              <Textarea name="notes" placeholder="Any specific requirements for artist attire, setup space, or breaks?" className="min-h-[140px] rounded-xl border-whisper p-4" />
            </div>

            <div>
              <Button type="submit" size="lg" className="w-full h-16 text-lg bg-ink hover:bg-ink-light text-white rounded-2xl shadow-none transition-transform active:scale-[0.98]" disabled={isSubmitting || !hasSupabaseConfig}>
                {isSubmitting ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                ) : "Request Artist"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
