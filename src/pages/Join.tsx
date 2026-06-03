import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircleIcon as CheckCircle2, ExclamationCircleIcon as AlertCircle } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function Join() {
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
    
    const services = ['drawing-teacher', 'wall-mural', 'live-event-art', 'workshop', 'portrait-custom-artwork', 'other'];
    const service_interest = services.filter(s => formData.get(`service-${s}`));
    
    // Naive split for MVP
    const mediumsString = formData.get('mediums') as string;
    const mediums = mediumsString ? mediumsString.split(',').map(s => s.trim()).filter(Boolean) : [];

    const data = {
      name: formData.get('name') as string,
      phone: formData.get('contact') as string,
      email: formData.get('email') as string,
      city: formData.get('city') as string,
      area: formData.get('area') as string,
      mediums,
      service_interest,
      portfolio_links: formData.get('portfolio') as string,
      social_links: formData.get('social') as string,
      short_bio: formData.get('bio') as string,
      available_for_paid_work: formData.get('paid_work') === 'on',
      available_for_home_teaching: formData.get('home_teaching') === 'on',
      available_for_travel: formData.get('travel') === 'on',
      consent_profile_public: formData.get('consent_public') === 'on',
      consent_artwork_public: formData.get('consent_art') === 'on',
      message: formData.get('message') as string,
    };

    const { error: dbError } = await supabase.from('join_requests').insert([data]);

    setIsSubmitting(false);

    if (dbError) {
      console.error(dbError);
      setError("Something went wrong submitting your application. Please try again.");
    } else {
      setIsSuccess(true);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 py-20 text-center">
        <CheckCircle2 className="mb-6 h-16 w-16 text-pine" />
        <h2 className="mb-4 text-3xl font-bold font-serif text-ink">Application Received</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          Thank you for applying to join ShareNGrow. We will review your details and get in touch with you via WhatsApp.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl font-sans">Apply for the Directory</h1>
        <p className="mt-4 text-lg text-ink-light max-w-2xl mx-auto">
          ShareNGrow is currently accepting artists for teaching, murals, live event art, workshops, portraits, and selected custom work.
        </p>
      </div>

      <div className="mb-8 rounded-[1.5rem] bg-paper-dark p-6 border border-ink-light/10">
        <h3 className="text-ink font-semibold mb-2">Important Note</h3>
        <p className="text-ink-light text-sm leading-relaxed">
          Applying does not guarantee listing. We manually review applications to keep the network useful and safe for both artists and clients. We look for clear examples of your work and a professional approach to client services.
        </p>
      </div>

      <Card className="border-ink-light/20 bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-4 sm:p-8">
        <CardContent className="pt-6">
          {!hasSupabaseConfig && (
             <div className="mb-6 flex items-start gap-3 rounded-md bg-red-50 p-4 text-red-900 border border-red-200">
               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
               <p className="text-sm font-medium">Database is not configured. Please add Supabase credentials in the settings.</p>
             </div>
          )}

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-900 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Basic Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Full Name *</label>
                  <Input name="name" required placeholder="Artist Name" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp Number *</label>
                  <Input name="contact" required placeholder="Phone number" className="rounded-xl border-ink-light/20" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Email Address (Optional)</label>
                  <Input name="email" type="email" placeholder="email@example.com" className="rounded-xl border-ink-light/20" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g., Kolkata" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g., Ballygunge" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6 pt-4">
              <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Your Art</h3>
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Mediums you work with *</label>
                  <Input name="mediums" required placeholder="E.g., Acrylic, Watercolour, Charcoal (comma separated)" className="rounded-xl border-ink-light/20" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-ink mb-1 block">Services you can offer (Select all that apply) *</label>
                <div className="space-y-3 bg-paper-dark p-5 rounded-[1.5rem] border border-ink-light/10">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-drawing-teacher" name="service-drawing-teacher" className="rounded h-4 w-4 border-ink-light/20 text-terracotta focus:ring-terracotta" />
                      <label htmlFor="service-drawing-teacher" className="text-sm text-ink-light leading-none">Drawing teacher</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-wall-mural" name="service-wall-mural" className="rounded h-4 w-4 border-ink-light/20 text-terracotta focus:ring-terracotta" />
                      <label htmlFor="service-wall-mural" className="text-sm text-ink-light leading-none">Mural artist</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-live-event-art" name="service-live-event-art" className="rounded h-4 w-4 border-ink-light/20 text-terracotta focus:ring-terracotta" />
                      <label htmlFor="service-live-event-art" className="text-sm text-ink-light leading-none">Live event artist</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-workshop" name="service-workshop" className="rounded h-4 w-4 border-ink-light/20 text-terracotta focus:ring-terracotta" />
                      <label htmlFor="service-workshop" className="text-sm text-ink-light leading-none">Workshop facilitator</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-portrait-custom-artwork" name="service-portrait-custom-artwork" className="rounded h-4 w-4 border-ink-light/20 text-terracotta focus:ring-terracotta" />
                      <label htmlFor="service-portrait-custom-artwork" className="text-sm text-ink-light leading-none">Portrait/custom artist</label>
                    </div>
                     <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-other" name="service-other" className="rounded h-4 w-4 border-ink-light/20 text-terracotta focus:ring-terracotta" />
                      <label htmlFor="service-other" className="text-sm text-ink-light leading-none">Other</label>
                    </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-ink">Portfolio Link(s) *</label>
                  <Input name="portfolio" required placeholder="Google Drive, Behance, or Website URL" className="rounded-xl border-ink-light/20" />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Instagram / Facebook Link</label>
                  <Input name="social" placeholder="https://instagram.com/yourhandle" className="rounded-xl border-ink-light/20" />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Short Bio</label>
                  <Textarea name="bio" placeholder="Tell us a bit about yourself and your artistic journey..." className="min-h-[100px] rounded-xl border-ink-light/20" />
              </div>
            </div>

             <div className="space-y-6 pt-4">
              <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Availability & Consent</h3>
              
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <input type="checkbox" id="paid_work" name="paid_work" className="mt-0.5 h-4 w-4 rounded border-ink-light/20 text-terracotta focus:ring-terracotta" />
                    <label htmlFor="paid_work" className="text-sm text-ink-light leading-relaxed">I am available to take on paid client work.</label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="home_teaching" name="home_teaching" className="mt-0.5 h-4 w-4 rounded border-ink-light/20 text-terracotta focus:ring-terracotta" />
                    <label htmlFor="home_teaching" className="text-sm text-ink-light leading-relaxed">I am available for home-visit teaching (if applying as teacher).</label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="travel" name="travel" className="mt-0.5 h-4 w-4 rounded border-ink-light/20 text-terracotta focus:ring-terracotta" />
                    <label htmlFor="travel" className="text-sm text-ink-light leading-relaxed">I am willing to travel outside my immediate area for projects.</label>
                  </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-ink-light/10">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent_public" name="consent_public" required className="mt-0.5 h-4 w-4 rounded border-ink-light/20 text-terracotta focus:ring-terracotta" />
                    <label htmlFor="consent_public" className="text-sm text-ink-light leading-relaxed">I consent to having my public profile published on ShareNGrow if approved. (Private phone/email will not be shown).</label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent_art" name="consent_art" required className="mt-0.5 h-4 w-4 rounded border-ink-light/20 text-terracotta focus:ring-terracotta" />
                    <label htmlFor="consent_art" className="text-sm text-ink-light leading-relaxed">I consent to having my submitted artwork samples published on my profile.</label>
                  </div>
              </div>
              
               <div className="space-y-2 pt-4">
                  <label className="text-sm font-medium text-ink">Message to Admins (Optional)</label>
                  <Textarea name="message" placeholder="Anything else we should know?" className="rounded-xl border-ink-light/20" />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 bg-ink hover:bg-ink-light text-white rounded-xl transition-transform active:scale-[0.98] mt-4" disabled={isSubmitting || !hasSupabaseConfig}>
              {isSubmitting ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              ) : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
