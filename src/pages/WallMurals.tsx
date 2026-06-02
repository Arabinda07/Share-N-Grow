import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircle2 } from 'lucide-react';

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
        <CheckCircle2 className="mb-6 h-16 w-16 text-amber-600" />
        <h2 className="mb-4 text-3xl font-bold text-stone-900">Inquiry Received</h2>
        <p className="mx-auto mb-8 max-w-md text-stone-600">
          Thank you. A ShareNGrow admin will review your project details and contact you on WhatsApp to discuss the next steps and artist matches.
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
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Turn a blank wall into a custom painted space.</h1>
        <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
          Share your wall size, location, and style idea. We will try to connect you with suitable mural artists.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card className="border-stone-200 bg-stone-50/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3">Suitable for</h3>
            <ul className="list-disc list-inside text-stone-600 space-y-1">
              <li>Cafés and restaurants</li>
              <li>Offices and co-working spaces</li>
              <li>Schools and play schools</li>
              <li>Gyms and studios</li>
              <li>Homes and private spaces</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-stone-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3">How mural projects work</h3>
            <ol className="list-decimal list-inside text-stone-600 space-y-2">
              <li>Share wall photo and approximate size</li>
              <li>Artist suggests concept or Quote</li>
              <li>Timeline and material needs are discussed</li>
              <li>Work starts after confirmation</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200" id="request-form">
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
                  <label className="text-sm font-medium text-stone-900">Name *</label>
                  <Input name="name" required placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-stone-900">Business / Organisation Name (Optional)</label>
                 <Input name="org" placeholder="Café name, School name, etc." />
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Wall Context</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Area / Locality *</label>
                  <Input name="area" required placeholder="E.g. Ballygunge" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Location Type *</label>
                  <select name="locationType" required className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900">
                    <option value="">Select...</option>
                    <option value="Indoor">Indoor Wall</option>
                    <option value="Outdoor">Outdoor Wall / Exterior</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Approximate Size *</label>
                  <Input name="size" required placeholder="E.g. 10ft x 8ft" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Project Vision</h3>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Preferred Style / Theme</label>
                  <Input name="style" placeholder="E.g. Floral, Abstract, Typography, Cartoon..." />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Wall Photo or Reference Link (Optional)</label>
                  <Input name="reference" placeholder="Link to Google Drive or Pinterest board" />
               </div>
               
               <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Deadline (Optional)</label>
                  <Input name="deadline" placeholder="When do you need it done?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" />
                </div>
               </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-stone-900">Additional Notes</label>
              <Textarea name="notes" placeholder="Is the wall textured? Are ladders needed? Any specific timing limits?" />
              <p className="text-xs text-stone-500 mt-2">
                Final quote depends on wall size, surface condition, location, design complexity, and material requirements.
              </p>
            </div>

            <Button type="submit" variant="brand" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request Quote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
