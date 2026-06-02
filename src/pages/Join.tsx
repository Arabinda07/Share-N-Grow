import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Apply to be listed on ShareNGrow.</h1>
        <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
          ShareNGrow is currently accepting artists for teaching, murals, live event art, workshops, portraits, and selected custom work.
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-stone-100 p-6 border border-stone-200">
        <h3 className="text-stone-900 font-semibold mb-2">Important Note</h3>
        <p className="text-stone-700 text-sm leading-relaxed">
          Applying does not guarantee listing. We manually review applications to keep the network useful and safe for both artists and clients. We look for clear examples of your work and a professional approach to client services.
        </p>
      </div>

      <Card className="border-stone-200">
        <CardContent className="pt-6">
          {!hasSupabaseConfig && (
             <div className="mb-6 flex items-start gap-3 rounded-md bg-red-50 p-4 text-red-900 border border-red-200">
               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
               <p className="text-sm font-medium">Database is not configured. Please add Supabase credentials in the settings.</p>
             </div>
          )}

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-900">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Basic Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Full Name *</label>
                  <Input name="name" required placeholder="Artist Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">WhatsApp Number *</label>
                  <Input name="contact" required placeholder="Phone number" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Email Address (Optional)</label>
                  <Input name="email" type="email" placeholder="email@example.com" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">City *</label>
                  <Input name="city" required placeholder="E.g., Kolkata" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g., Ballygunge" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Your Art</h3>
              <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Mediums you work with *</label>
                  <Input name="mediums" required placeholder="E.g., Acrylic, Watercolour, Charcoal (comma separated)" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-stone-900 mb-1 block">Services you can offer (Select all that apply) *</label>
                <div className="space-y-2 bg-stone-50 p-4 rounded-md border border-stone-200">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="service-drawing-teacher" name="service-drawing-teacher" className="rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                      <label htmlFor="service-drawing-teacher" className="text-sm text-stone-700">Drawing teacher</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="service-wall-mural" name="service-wall-mural" className="rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                      <label htmlFor="service-wall-mural" className="text-sm text-stone-700">Mural artist</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="service-live-event-art" name="service-live-event-art" className="rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                      <label htmlFor="service-live-event-art" className="text-sm text-stone-700">Live event artist</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="service-workshop" name="service-workshop" className="rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                      <label htmlFor="service-workshop" className="text-sm text-stone-700">Workshop facilitator</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="service-portrait-custom-artwork" name="service-portrait-custom-artwork" className="rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                      <label htmlFor="service-portrait-custom-artwork" className="text-sm text-stone-700">Portrait/custom artist</label>
                    </div>
                     <div className="flex items-center gap-2">
                      <input type="checkbox" id="service-other" name="service-other" className="rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                      <label htmlFor="service-other" className="text-sm text-stone-700">Other</label>
                    </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-stone-900">Portfolio Link(s) *</label>
                  <Input name="portfolio" required placeholder="Google Drive, Behance, or Website URL" />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Instagram / Facebook Link</label>
                  <Input name="social" placeholder="https://instagram.com/yourhandle" />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Short Bio</label>
                  <Textarea name="bio" placeholder="Tell us a bit about yourself and your artistic journey..." className="min-h-[100px]" />
              </div>
            </div>

             <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Availability & Consent</h3>
              
              <div className="space-y-3">
                 <div className="flex items-start gap-2">
                    <input type="checkbox" id="paid_work" name="paid_work" className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                    <label htmlFor="paid_work" className="text-sm text-stone-700">I am available to take on paid client work.</label>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="home_teaching" name="home_teaching" className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                    <label htmlFor="home_teaching" className="text-sm text-stone-700">I am available for home-visit teaching (if applying as teacher).</label>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="travel" name="travel" className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                    <label htmlFor="travel" className="text-sm text-stone-700">I am willing to travel outside my immediate area for projects.</label>
                  </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="consent_public" name="consent_public" required className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-600" />
                    <label htmlFor="consent_public" className="text-sm text-stone-700">I consent to having my public profile published on ShareNGrow if approved. (Private phone/email will not be shown).</label>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="consent_art" name="consent_art" required className="mt-0.5 rounded border-stone-300 text-terracotta focus:ring-terracotta" />
                    <label htmlFor="consent_art" className="text-sm text-ink-light">I consent to having my submitted artwork samples published on my profile.</label>
                  </div>
              </div>
              
               <div className="space-y-2 pt-4">
                  <label className="text-sm font-medium text-stone-900">Message to Admins (Optional)</label>
                  <Textarea name="message" placeholder="Anything else we should know?" />
              </div>
            </div>

            <Button type="submit" variant="brand" size="lg" className="w-full h-12" disabled={isSubmitting || !hasSupabaseConfig}>
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
