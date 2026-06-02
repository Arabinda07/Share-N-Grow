import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import React, { useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif tracking-tight text-ink sm:text-4xl">Find a drawing teacher for your child.</h1>
        <p className="mt-4 text-lg text-ink-light max-w-2xl mx-auto">
          Share your location, preferred timing, and your child's age. We will try to suggest suitable drawing teachers from the ShareNGrow network.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card className="border-ink-light/20 bg-white">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3 text-ink">What children can learn</h3>
            <ul className="list-disc list-inside text-ink-light space-y-1">
              <li>Basic drawing & sketching</li>
              <li>Colouring (crayons, pastels, watercolours)</li>
              <li>Craft and creative expression</li>
              <li>School art project support</li>
              <li>Hobby art and relaxation</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-ink-light/20 bg-white">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3 text-ink">Class formats</h3>
            <ul className="list-disc list-inside text-ink-light space-y-1">
              <li>Home visits</li>
              <li>Teacher's location / studio</li>
              <li>Small group classes</li>
              <li>Online sessions</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12 rounded-lg bg-paper-dark p-6 border border-ink-light/20">
        <h3 className="text-ink font-semibold mb-2 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-terracotta" />
          Safety note
        </h3>
        <p className="text-ink-light text-sm">
          For children's classes, we recommend that a parent or guardian stays involved during sessions. ShareNGrow reviews artist profiles and basic details before making introductions, but parents should speak directly with the teacher before confirming.
        </p>
      </div>

      <Card className="border-ink-light/20 bg-white" id="request-form">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-900">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b border-ink-light/20 pb-2 text-ink">Parent Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Parent Name *</label>
                  <Input name="name" required placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="font-semibold text-lg border-b border-ink-light/20 pb-2 text-ink">Location & Student</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g. Salt Lake" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-ink">Child's Age *</label>
                 <Input name="age" required placeholder="E.g. 7 years old" />
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="font-semibold text-lg border-b border-ink-light/20 pb-2 text-ink">Class Preferences</h3>
               <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Class Mode *</label>
                  <select name="mode" required className="flex h-10 w-full rounded-md border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:ring-terracotta focus:outline-none">
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
                  <select name="goal" required className="flex h-10 w-full rounded-md border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:ring-terracotta focus:outline-none">
                    <option value="">Select primary goal...</option>
                    <option value="Hobby & Fun">Hobby & Fun</option>
                    <option value="School Support">School Support</option>
                    <option value="Beginner Basics">Beginner Basics</option>
                    <option value="Advanced / Competitions">Advanced / Competitions</option>
                  </select>
                </div>
               </div>
               
               <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Preferred Days/Timing *</label>
                  <Input name="timing" required placeholder="E.g. Weekends morning" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Monthly Budget (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" />
                </div>
               </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-ink">Additional Notes</label>
              <Textarea name="notes" placeholder="Any specific requirements or things the teacher should know?" />
            </div>

            <Button type="submit" variant="brand" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request Teacher"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
