import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircle2 } from 'lucide-react';
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
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Collaborate with ShareNGrow.</h1>
        <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
          We partner with schools, offices, cafés, NGOs, colleges, cultural groups, and event partners to bring more art into local spaces.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card className="border-stone-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-stone-900 mb-2">For Schools & Colleges</h3>
             <p className="text-sm text-stone-600">Hire guest faculty, organise specialized art workshops, or find judges for cultural fests.</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-stone-900 mb-2">For Offices & Local Businesses</h3>
             <p className="text-sm text-stone-600">Team-building art workshops, office murals, or finding local art for your café walls.</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-stone-900 mb-2">For Events & Planners</h3>
             <p className="text-sm text-stone-600">Bulk hire live artists for large festivals, weddings, or corporate offsites.</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-stone-900 mb-2">For Cultural Groups & NGOs</h3>
             <p className="text-sm text-stone-600">Partner with our network for community art projects, charity auctions, or public installations.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-900">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Your Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Your Name *</label>
                  <Input name="name" required placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Organisation Name *</label>
                  <Input name="org" required placeholder="School, Company, NGO..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Your Role</label>
                  <Input name="role" placeholder="E.g. Principal, HR Manager..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" />
                </div>
              </div>
               <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Email Address</label>
                  <Input name="email" type="email" placeholder="Optional" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Partnership Details</h3>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Type of Collaboration *</label>
                  <select name="collabType" required className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900">
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
                  <label className="text-sm font-medium text-stone-900">Description of your needs *</label>
                  <Textarea name="description" required placeholder="Tell us what you are looking to achieve..." className="min-h-[120px]" />
                </div>
               
               <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Preferred Timeline (Optional)</label>
                  <Input name="timeline" placeholder="E.g. Next month, Ongoing..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" />
                </div>
               </div>
            </div>

            <Button type="submit" variant="brand" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
