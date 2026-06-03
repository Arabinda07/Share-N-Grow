import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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

    const formData = new FormData(e.currentTarget);

    // Initial Security: Honeypot check
    // Bots usually fill hidden fields. If this is filled, it's likely a bot.
    const honeypot = formData.get('_botcheck') as string;
    if (honeypot) {
      console.warn("Bot detected.");
      // Silently succeed to trick bots
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    
    // Process File Upload if provided
    let uploadedFileUrl = "";
    const fileInput = formData.get('portfolio_file') as File;
    if (fileInput && fileInput.size > 0) {
      if (fileInput.size > 5 * 1024 * 1024) {
        setError("File size must be under 5MB.");
        setIsSubmitting(false);
        return;
      }
      const fileExt = fileInput.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('application-uploads')
        .upload(fileName, fileInput);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError("Failed to upload portfolio file. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('application-uploads')
        .getPublicUrl(fileName);
        
      uploadedFileUrl = publicUrlData.publicUrl;
    }

    const services = ['drawing-teacher', 'wall-mural', 'live-event-art', 'workshop', 'portrait-custom-artwork', 'other'];
    const service_interest = services.filter(s => formData.get(`service-${s}`));
    
    // Naive split for MVP
    const mediumsString = formData.get('mediums') as string;
    const mediums = mediumsString ? mediumsString.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    // Combine text portfolio links and the uploaded file link
    let portfolioText = formData.get('portfolio') as string;
    if (uploadedFileUrl) {
       portfolioText = portfolioText ? `${portfolioText}\n\nUploaded File: ${uploadedFileUrl}` : `Uploaded File: ${uploadedFileUrl}`;
    }

    const data = {
      name: formData.get('name') as string,
      phone: formData.get('contact') as string,
      email: formData.get('email') as string,
      city: formData.get('city') as string,
      area: formData.get('area') as string,
      mediums,
      service_interest,
      portfolio_links: portfolioText,
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
    <div className="container mx-auto max-w-3xl px-4 py-24 sm:py-32 lg:px-8 min-h-[90vh]">
      <Helmet>
        <title>Apply as Artist | ShareNGrow</title>
        <meta name="description" content="Apply to join our vetted community of local drawing teachers, muralists, and live event artists." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/join" />
      </Helmet>
      <div className="mb-10 md:mb-14 text-center px-4">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tighter text-ink leading-[1.1] font-sans">Apply for the Directory</h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-ink-light max-w-2xl mx-auto leading-relaxed">
          ShareNGrow is currently accepting artists for teaching, murals, live event art, workshops, portraits, and selected custom work.
        </p>
      </div>

      <div className="mb-8 rounded-[1.5rem] bg-paper-dark p-6 border border-ink-light/10">
        <h3 className="text-ink font-semibold mb-2">Important Note</h3>
        <p className="text-ink-light text-sm leading-relaxed">
          Applying does not guarantee listing. We manually review applications to keep the network useful and safe for both artists and clients. We look for clear examples of your work and a professional approach to client services.
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="text" name="_botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="space-y-6">
              <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Basic Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Full Name *</label>
                  <Input name="name" required placeholder="Artist Name" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp Number *</label>
                  <Input name="contact" required placeholder="Phone number" className="rounded-xl border-whisper h-12" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Email Address (Optional)</label>
                  <Input name="email" type="email" placeholder="email@example.com" className="rounded-xl border-whisper h-12" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g., Kolkata" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g., Ballygunge" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6 pt-6">
              <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Your Art</h3>
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Mediums you work with *</label>
                  <Input name="mediums" required placeholder="E.g., Acrylic, Watercolour, Charcoal (comma separated)" className="rounded-xl border-whisper h-12" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-ink mb-1 block">Services you can offer (Select all that apply) *</label>
                <div className="space-y-3 bg-paper p-6 rounded-[1.5rem] border border-whisper">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-drawing-teacher" name="service-drawing-teacher" className="rounded h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="service-drawing-teacher" className="text-sm text-ink-light leading-none cursor-pointer">Drawing teacher</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-wall-mural" name="service-wall-mural" className="rounded h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="service-wall-mural" className="text-sm text-ink-light leading-none cursor-pointer">Mural artist</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-live-event-art" name="service-live-event-art" className="rounded h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="service-live-event-art" className="text-sm text-ink-light leading-none cursor-pointer">Live event artist</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-workshop" name="service-workshop" className="rounded h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="service-workshop" className="text-sm text-ink-light leading-none cursor-pointer">Workshop facilitator</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-portrait-custom-artwork" name="service-portrait-custom-artwork" className="rounded h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="service-portrait-custom-artwork" className="text-sm text-ink-light leading-none cursor-pointer">Portrait/custom artist</label>
                    </div>
                     <div className="flex items-center gap-3">
                      <input type="checkbox" id="service-other" name="service-other" className="rounded h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="service-other" className="text-sm text-ink-light leading-none cursor-pointer">Other</label>
                    </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-ink">Portfolio Link(s)</label>
                  <Input name="portfolio" placeholder="Google Drive, Behance, or Website URL" className="rounded-xl border-whisper h-12" />
              </div>
              
              <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-ink">Upload Portfolio File (PDF/Image max 5MB)</label>
                  <Input type="file" name="portfolio_file" accept=".pdf,.jpeg,.jpg,.png" className="rounded-xl border-whisper file:mr-4 file:rounded-xl file:border-0 file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-paper-dark transition-all cursor-pointer h-12 pt-2" />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Instagram / Facebook Link</label>
                  <Input name="social" placeholder="https://instagram.com/yourhandle" className="rounded-xl border-whisper h-12" />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Short Bio</label>
                  <Textarea name="bio" placeholder="Tell us a bit about yourself and your artistic journey..." className="min-h-[140px] rounded-xl border-whisper p-4" />
              </div>
            </div>

             <div className="space-y-6 pt-6">
              <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Availability & Consent</h3>
              
              <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <input type="checkbox" id="paid_work" name="paid_work" className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                    <label htmlFor="paid_work" className="text-base text-ink-light leading-relaxed cursor-pointer">I am available to take on paid client work.</label>
                  </div>
                  <div className="flex items-start gap-4">
                    <input type="checkbox" id="home_teaching" name="home_teaching" className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                    <label htmlFor="home_teaching" className="text-base text-ink-light leading-relaxed cursor-pointer">I am available for home-visit teaching (if applying as teacher).</label>
                  </div>
                  <div className="flex items-start gap-4">
                    <input type="checkbox" id="travel" name="travel" className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                    <label htmlFor="travel" className="text-base text-ink-light leading-relaxed cursor-pointer">I am willing to travel outside my immediate area for projects.</label>
                  </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-whisper">
                  <div className="flex items-start gap-4">
                    <input type="checkbox" id="consent_public" name="consent_public" required className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                    <label htmlFor="consent_public" className="text-base text-ink-light leading-relaxed cursor-pointer">I consent to having my public profile published on ShareNGrow if approved. (Private phone/email will not be shown).</label>
                  </div>
                  <div className="flex items-start gap-4">
                    <input type="checkbox" id="consent_art" name="consent_art" required className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                    <label htmlFor="consent_art" className="text-base text-ink-light leading-relaxed cursor-pointer">I consent to having my submitted artwork samples published on my profile.</label>
                  </div>
              </div>
              
               <div className="space-y-2 pt-6">
                  <label className="text-sm font-medium text-ink">Message to Admins (Optional)</label>
                  <Textarea name="message" placeholder="Anything else we should know?" className="rounded-xl border-whisper min-h-[100px] p-4" />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full h-16 text-lg bg-ink hover:bg-ink-light text-white rounded-2xl transition-all duration-300 ease-out active:scale-[0.98]" disabled={isSubmitting || !hasSupabaseConfig}>
                {isSubmitting ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                ) : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
