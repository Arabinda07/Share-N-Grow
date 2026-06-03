import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { api } from '../lib/api';
import { hasSupabaseConfig } from '../lib/supabase';
import { CheckCircledIcon as CheckCircle2 } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

export function Collaborate() {
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
      organization_name: formData.get('org') as string,
      role: formData.get('role') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      city: formData.get('city') as string,
      collaboration_type: formData.get('collabType') as string,
      budget_range: formData.get('budget') as string,
      preferred_timeline: formData.get('timeline') as string,
      description: formData.get('description') as string,
    };

    const { error: dbError } = await api.submitCollaborationRequest(data);

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
        <h2 className="mb-4 text-3xl font-bold text-ink font-serif tracking-tight">We have your request.</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          We'll review your collaboration proposal and message you to discuss it further.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-14 md:mb-20 px-4">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl font-serif">Collaborate with ShareNGrow.</h1>
        <p className="mt-4 text-lg text-ink-light max-w-2xl">
          We partner with schools, offices, cafés, NGOs, colleges, cultural groups, and event partners to bring more art into local spaces.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card className="border-whisper bg-paper rounded-2xl shadow-none">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-serif mb-3">For Schools & Colleges</h3>
             <p className="text-base text-ink-light leading-relaxed">Hire guest faculty, organise specialized art workshops, or find judges for cultural fests.</p>
          </CardContent>
        </Card>
        <Card className="border-whisper bg-white rounded-2xl shadow-none">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-serif mb-3">For Offices & Local Businesses</h3>
             <p className="text-base text-ink-light leading-relaxed">Team-building art workshops, office murals, or finding local art for your café walls.</p>
          </CardContent>
        </Card>
        <Card className="border-whisper bg-white rounded-2xl shadow-none">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-serif mb-3">For Events & Planners</h3>
             <p className="text-base text-ink-light leading-relaxed">Bulk hire live artists for large festivals, weddings, or corporate offsites.</p>
          </CardContent>
        </Card>
        <Card className="border-whisper bg-paper rounded-2xl shadow-none">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-serif mb-3">For Cultural Groups & NGOs</h3>
             <p className="text-base text-ink-light leading-relaxed">Partner with our network for community art projects, charity auctions, or public installations.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-whisper bg-white rounded-2xl shadow-none p-4 sm:p-8 md:p-10">
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-12">
             {error && (
              <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-900 border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-8">
              <h3 className="font-semibold text-xl text-ink">Your Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Your Name *</label>
                  <Input name="name" required placeholder="Full Name" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Organisation Name *</label>
                  <Input name="org" required placeholder="School, Company, NGO..." className="rounded-xl border-whisper h-12" />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Your Role</label>
                  <Input name="role" placeholder="E.g. Principal, HR Manager..." className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Email Address</label>
                  <Input name="email" type="email" placeholder="Optional" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <h3 className="font-semibold text-xl text-ink">Partnership Details</h3>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Type of Collaboration *</label>
                  <select name="collabType" required className="flex h-12 w-full rounded-xl border border-whisper bg-white px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none transition-shadow">
                    <option value="">Select...</option>
                    <option value="School/College Program">School / College Art Program</option>
                    <option value="Corporate Workshop">Corporate Team Building Workshop</option>
                    <option value="Event Partnership">Large Event Partnership</option>
                    <option value="Community Project">Community / NGO Project</option>
                    <option value="Venue Partnership">Venue Partner (Host artists at your space)</option>
                    <option value="Other">Other</option>
                  </select>
               </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Description of your needs *</label>
                  <Textarea name="description" required placeholder="Tell us what you are looking to achieve..." className="min-h-[140px] rounded-xl border-whisper p-4" />
                </div>
               
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Timeline (Optional)</label>
                  <Input name="timeline" placeholder="E.g. Next month, Ongoing..." className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" className="rounded-xl border-whisper h-12" />
                </div>
               </div>
            </div>

            <div>
              <Button type="submit" size="lg" className="w-full h-16 text-lg bg-ink hover:bg-ink-light text-white rounded-2xl shadow-none transition-transform active:scale-[0.98]" disabled={isSubmitting || !hasSupabaseConfig}>
                {isSubmitting ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                ) : "Submit Proposal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
