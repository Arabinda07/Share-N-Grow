import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import React, { useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircleIcon as CheckCircle2, ExclamationCircleIcon as AlertCircle } from '@heroicons/react/24/outline';

export function DrawingTeachers() {
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
      service_needed: 'drawing-teacher',
      budget_range: formData.get('budget') as string,
      description: `Child Age: ${formData.get('age')}\nClass Mode: ${formData.get('mode')}\nTiming: ${formData.get('timing')}\nGoal: ${formData.get('goal')}\nNotes: ${formData.get('notes')}`,
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
        <h2 className="mb-4 text-3xl font-bold font-serif text-ink">Request Received</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          Thank you. A ShareNGrow admin will review your request and contact you on WhatsApp if we can suggest suitable teachers.
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
        <title>Find Drawing Teachers | ShareNGrow</title>
        <meta name="description" content="Find the perfect drawing teacher for your child in Bengal. We match you with vetted local art instructors for home visits or studio classes." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/drawing-teachers" />
      </Helmet>
      <div className="mb-20 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold font-sans tracking-tight text-ink leading-tight">Find a drawing teacher for your child.</h1>
        <p className="mt-6 text-xl text-ink-light leading-relaxed">
          Tell us where you are and when you want classes. We'll introduce you to an instructor who fits your schedule.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="border border-whisper bg-paper-dark rounded-[2rem] shadow-none">
          <CardContent className="p-10">
            <h3 className="font-semibold text-2xl mb-6 text-ink tracking-tight font-sans">What they can learn</h3>
            <ul className="list-none text-ink-light space-y-4 text-lg">
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Basic drawing & sketching</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Coloring (crayons, pastels, water-colors)</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Craft and creative expression</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> School art project support</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Hobby art and relaxation</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border border-whisper bg-white rounded-[2rem] shadow-none">
          <CardContent className="p-10">
            <h3 className="font-semibold text-2xl mb-6 text-ink tracking-tight font-sans">Class formats</h3>
            <ul className="list-none text-ink-light space-y-4 text-lg">
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Home visits</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Teacher's location / studio</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Small group classes</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Online sessions</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12 rounded-[1.5rem] bg-paper-dark p-6 border border-ink-light/10">
        <h3 className="text-ink font-semibold mb-2 flex items-center font-sans tracking-tight">
          <AlertCircle className="w-5 h-5 mr-2 text-terracotta" />
          Safety note
        </h3>
        <p className="text-ink-light text-sm leading-relaxed">
          We verify portfolios and basic details before any introduction, but we recommend parents talk to the teacher directly and stay involved during early sessions.
        </p>
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
              <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Parent Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Parent Name *</label>
                  <Input name="name" required placeholder="Full Name" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
               <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Location & Student</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g. Salt Lake" className="rounded-xl border-ink-light/20" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-ink">Child's Age *</label>
                 <Input name="age" required placeholder="E.g. 7 years old" className="rounded-xl border-ink-light/20" />
              </div>
            </div>

            <div className="space-y-6 pt-4">
               <h3 className="font-semibold text-lg border-b border-ink-light/10 pb-2 text-ink">Class Preferences</h3>
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Class Mode *</label>
                  <select name="mode" required className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:ring-terracotta focus:outline-none transition-shadow">
                    <option value="">Select mode...</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Teacher Location">Teacher's Location</option>
                    <option value="Online">Online</option>
                    <option value="Group Class">Small Group Class</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Goal *</label>
                  <select name="goal" required className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:ring-terracotta focus:outline-none transition-shadow">
                    <option value="">Select primary goal...</option>
                    <option value="Hobby & Fun">Hobby & Fun</option>
                    <option value="School Support">School Support</option>
                    <option value="Beginner Basics">Beginner Basics</option>
                    <option value="Advanced / Competitions">Advanced / Competitions</option>
                  </select>
                </div>
               </div>
               
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Days/Timing *</label>
                  <Input name="timing" required placeholder="E.g. Weekends morning" className="rounded-xl border-ink-light/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Monthly Budget (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" className="rounded-xl border-ink-light/20" />
                </div>
               </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-ink">Additional Notes</label>
              <Textarea name="notes" placeholder="Any specific requirements or things the teacher should know?" className="min-h-[100px] rounded-xl border-ink-light/20" />
            </div>

            <Button type="submit" size="lg" className="w-full h-14 bg-ink hover:bg-ink-light text-white rounded-xl shadow-none transition-transform active:scale-[0.98] mt-4" disabled={isSubmitting || !hasSupabaseConfig}>
              {isSubmitting ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              ) : "Request Teacher"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
