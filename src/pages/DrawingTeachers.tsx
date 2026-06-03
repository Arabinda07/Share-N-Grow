import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import React, { useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircledIcon as CheckCircle2, ExclamationTriangleIcon as AlertCircle } from '@radix-ui/react-icons';

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
        <meta name="description" content="Find the perfect drawing teacher for your child. We match you with vetted local art instructors for home visits or studio classes." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/drawing-teachers" />
      </Helmet>
      <div className="mb-12 md:mb-20 max-w-3xl px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-ink leading-tight">Find a drawing teacher for your child.</h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-ink-light leading-relaxed">
          Tell us where you are and when you want classes. We'll introduce you to an instructor who fits your schedule.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 px-4 md:px-0">
        <Card className="border border-whisper bg-paper-dark rounded-[1.5rem] md:rounded-[2rem] shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-semibold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">What they can learn</h3>
            <ul className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Basic drawing & sketching</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Coloring (crayons, pastels, water-colors)</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Craft and creative expression</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> School art project support</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Hobby art and relaxation</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border border-whisper bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-semibold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">Class formats</h3>
            <ul className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Home visits</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Teacher's location / studio</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Small group classes</li>
              <li className="flex items-start"><span className="text-terracotta mr-3">•</span> Online sessions</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12 rounded-[2rem] bg-paper p-6 md:p-8 border border-whisper flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        <div className="bg-white p-3 rounded-full shrink-0 border border-whisper shadow-sm">
           <AlertCircle className="w-6 h-6 text-terracotta" />
        </div>
        <div>
          <h3 className="text-ink font-semibold text-lg mb-1 font-serif tracking-tight">
            Safety note
          </h3>
          <p className="text-ink-light leading-relaxed">
            We verify portfolios and basic details before any introduction, but we recommend parents talk to the teacher directly and stay involved during early sessions.
          </p>
        </div>
      </div>

      <Card className="border-whisper bg-white rounded-[2.5rem] shadow-none p-4 sm:p-8" id="request-form">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
             {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-900 border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Parent Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Parent Name *</label>
                  <Input name="name" required placeholder="Full Name" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6">
               <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Location & Student</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g. Salt Lake" className="rounded-xl border-whisper h-12" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-ink">Child's Age *</label>
                 <Input name="age" required placeholder="E.g. 7 years old" className="rounded-xl border-whisper h-12" />
              </div>
            </div>

            <div className="space-y-6 pt-6">
               <h3 className="font-semibold text-xl border-b border-whisper pb-4 text-ink">Class Preferences</h3>
               <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Class Mode *</label>
                  <select name="mode" required className="flex h-12 w-full rounded-xl border border-whisper bg-white px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none transition-shadow">
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
                  <select name="goal" required className="flex h-12 w-full rounded-xl border border-whisper bg-white px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none transition-shadow">
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
                  <Input name="timing" required placeholder="E.g. Weekends morning" className="rounded-xl border-whisper h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Monthly Budget (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" className="rounded-xl border-whisper h-12" />
                </div>
               </div>
            </div>
            
            <div className="space-y-2 pt-6">
              <label className="text-sm font-medium text-ink">Additional Notes</label>
              <Textarea name="notes" placeholder="Any specific requirements or things the teacher should know?" className="min-h-[140px] rounded-xl border-whisper p-4" />
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full h-16 text-lg bg-ink hover:bg-ink-light text-white rounded-2xl shadow-none transition-transform active:scale-[0.98]" disabled={isSubmitting || !hasSupabaseConfig}>
                {isSubmitting ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                ) : "Request Teacher"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
