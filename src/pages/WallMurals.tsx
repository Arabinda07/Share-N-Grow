import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import React, { useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircleIcon as CheckCircle2 } from '@heroicons/react/24/outline';

export function WallMurals() {
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
      service_needed: 'wall-mural',
      budget_range: formData.get('budget') as string,
      deadline: formData.get('deadline') as string,
      reference_url: formData.get('reference') as string,
      description: `Organization: ${formData.get('org')}\nLocation Type: ${formData.get('locationType')}\nWall Size: ${formData.get('size')}\nStyle: ${formData.get('style')}\nNotes: ${formData.get('notes')}`,
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
        <CheckCircle2 className="mb-6 h-16 w-16 text-pine" />
        <h2 className="mb-4 text-3xl font-bold font-serif text-ink">Inquiry Received</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          Thank you. A ShareNGrow admin will review your project details and contact you on WhatsApp to discuss the next steps and artist matches.
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
        <title>Hire Wall Mural Artists | ShareNGrow</title>
        <meta name="description" content="Turn a blank wall into a custom painted space. Hire local wall mural artists in Bengal for cafes, schools, offices, or homes." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/wall-murals" />
      </Helmet>
      <div className="mb-16 mt-10 max-w-4xl mx-auto">
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tighter text-ink leading-tight font-sans">Turn a blank wall into art.</h1>
        <p className="mt-6 text-xl text-ink-light leading-relaxed">
          Tell us the wall size, location, and what you want to paint. We'll introduce you to muralists who do exactly this.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
        <Card className="border border-whisper bg-paper-dark rounded-[2.5rem] shadow-none">
          <CardContent className="p-10">
            <h3 className="font-bold text-2xl mb-6 text-ink tracking-tight font-sans">Who asks for this?</h3>
            <ul className="list-none text-ink-light space-y-4 text-lg">
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Cafés and restaurants</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Offices and co-working spaces</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Schools and play spaces</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Gyms and studios</li>
              <li className="flex items-start"><span className="text-pine mr-3 font-bold">•</span> Private residences</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border border-whisper bg-white rounded-[2.5rem] shadow-none">
          <CardContent className="p-10">
            <h3 className="font-bold text-2xl mb-6 text-ink tracking-tight font-sans">How it works</h3>
            <ol className="list-none text-ink-light space-y-4 text-lg counter-reset-works">
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">1</span> Send us wall dimensions and a reference idea.</li>
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">2</span> An artist sends back a concept and a quote.</li>
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">3</span> You talk timeline, scaffolding, and paint costs.</li>
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">4</span> They paint.</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="border-ink-light/20 bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-4 sm:p-8" id="request-form">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
             {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-900 border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Your Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Name *</label>
                  <Input name="name" required placeholder="Full Name" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-ink">Business / Organisation Name (Optional)</label>
                 <Input name="org" placeholder="Café name, School name, etc." className="rounded-xl border-ink-light/20" />
              </div>
            </div>

            <div className="space-y-6 pt-4">
               <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Wall Context</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g. Ballygunge" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Location Type *</label>
                  <select name="locationType" required className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:ring-terracotta focus:outline-none transition-shadow">
                    <option value="">Select...</option>
                    <option value="Indoor">Indoor Wall</option>
                    <option value="Outdoor">Outdoor Wall / Exterior</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Approximate Size *</label>
                  <Input name="size" required placeholder="E.g. 10ft x 8ft" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
               <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Project Vision</h3>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Style / Theme</label>
                  <Input name="style" placeholder="E.g. Floral, Abstract, Typography, Cartoon..." className="rounded-xl border-ink-light/20" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Wall Photo or Reference Link (Optional)</label>
                  <Input name="reference" placeholder="Link to Google Drive or Pinterest board" className="rounded-xl border-ink-light/20" />
               </div>
               
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Deadline (Optional)</label>
                  <Input name="deadline" placeholder="When do you need it done?" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" className="rounded-xl border-ink-light/20" />
                </div>
               </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-ink">Additional Notes</label>
              <Textarea name="notes" placeholder="Is the wall textured? Are ladders needed? Any specific timing limits?" className="min-h-[100px] rounded-xl border-ink-light/20" />
              <p className="text-xs text-ink-light mt-2 leading-relaxed">
                Final quote depends on wall size, surface condition, location, design complexity, and material requirements.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 bg-ink hover:bg-ink-light text-white rounded-xl shadow-none transition-transform active:scale-[0.98] mt-4" disabled={isSubmitting || !hasSupabaseConfig}>
              {isSubmitting ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              ) : "Request Quote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
