import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircleIcon as CheckCircle2 } from '@heroicons/react/24/outline';
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

    const { error: dbError } = await supabase.from('collaboration_requests').insert([data]);

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
        <CheckCircle2 className="mb-6 h-16 w-16 text-amber-600" />
        <h2 className="mb-4 text-3xl font-bold text-stone-900">Request Sent</h2>
        <p className="mx-auto mb-8 max-w-md text-stone-600">
          Thank you for reaching out. We will review your collaboration proposal and get back to you shortly.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl font-sans">Collaborate with ShareNGrow.</h1>
        <p className="mt-4 text-lg text-ink-light max-w-2xl mx-auto">
          We partner with schools, offices, cafés, NGOs, colleges, cultural groups, and event partners to bring more art into local spaces.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card className="border border-slate-200/50 bg-paper-dark rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-sans mb-3">For Schools & Colleges</h3>
             <p className="text-base text-ink-light leading-relaxed">Hire guest faculty, organise specialized art workshops, or find judges for cultural fests.</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/50 bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-sans mb-3">For Offices & Local Businesses</h3>
             <p className="text-base text-ink-light leading-relaxed">Team-building art workshops, office murals, or finding local art for your café walls.</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/50 bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-sans mb-3">For Events & Planners</h3>
             <p className="text-base text-ink-light leading-relaxed">Bulk hire live artists for large festivals, weddings, or corporate offsites.</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/50 bg-paper-dark rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <CardContent className="p-8">
            <h3 className="font-semibold text-lg text-ink tracking-tight font-sans mb-3">For Cultural Groups & NGOs</h3>
             <p className="text-base text-ink-light leading-relaxed">Partner with our network for community art projects, charity auctions, or public installations.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-ink-light/20 bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-4 sm:p-8">
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
                  <label className="text-sm font-medium text-ink">Your Name *</label>
                  <Input name="name" required placeholder="Full Name" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Organisation Name *</label>
                  <Input name="org" required placeholder="School, Company, NGO..." className="rounded-xl border-ink-light/20" />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Your Role</label>
                  <Input name="role" placeholder="E.g. Principal, HR Manager..." className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Email Address</label>
                  <Input name="email" type="email" placeholder="Optional" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
               <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Partnership Details</h3>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Type of Collaboration *</label>
                  <select name="collabType" required className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:ring-terracotta focus:outline-none transition-shadow">
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
                  <Textarea name="description" required placeholder="Tell us what you are looking to achieve..." className="min-h-[120px] rounded-xl border-ink-light/20" />
                </div>
               
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Timeline (Optional)</label>
                  <Input name="timeline" placeholder="E.g. Next month, Ongoing..." className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" className="rounded-xl border-ink-light/20" />
                </div>
               </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 bg-ink hover:bg-ink-light text-white rounded-xl shadow-none transition-transform active:scale-[0.98] mt-4" disabled={isSubmitting || !hasSupabaseConfig}>
              {isSubmitting ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              ) : "Submit Proposal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
