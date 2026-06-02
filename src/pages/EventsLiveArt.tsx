import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircle2 } from 'lucide-react';

export function EventsLiveArt() {
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
      service_needed: 'live-event-art',
      budget_range: formData.get('budget') as string,
      deadline: formData.get('date') as string,
      reference_url: formData.get('reference') as string,
      description: `Event Type: ${formData.get('eventType')}\nGuests: ${formData.get('guests')}\nDuration: ${formData.get('duration')}\nService: ${formData.get('serviceSpecific')}\nNotes: ${formData.get('notes')}`,
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
        <h2 className="mb-4 text-3xl font-bold text-stone-900">Request Received</h2>
        <p className="mx-auto mb-8 max-w-md text-stone-600">
          Thank you. A ShareNGrow admin will review your event details and contact you on WhatsApp to discuss artist availability.
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
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Book live artists for weddings, events, and special gatherings.</h1>
        <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
          Live sketching, guest caricatures, event painting, and custom art experiences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card className="border-stone-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3">Popular Services</h3>
            <ul className="list-disc list-inside text-stone-600 space-y-1">
              <li>Live guest sketching</li>
              <li>Live canvas painting</li>
              <li>Guest caricatures</li>
              <li>Event art booths</li>
              <li>Custom event gifts for guests</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-stone-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3">What we need to know</h3>
            <ul className="list-disc list-inside text-stone-600 space-y-1">
              <li>Event date and time</li>
              <li>Venue location</li>
              <li>Expected guest count</li>
              <li>Duration of the service</li>
              <li>Preferred style of art</li>
            </ul>
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
              <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Client Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Name *</label>
                  <Input name="name" required placeholder="Full Name or Event Agency" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">WhatsApp / Phone *</label>
                  <Input name="phone" required placeholder="Phone number" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Event Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Event Type *</label>
                  <Input name="eventType" required placeholder="E.g. Wedding, Corporate Party, Birthday..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Event Date *</label>
                  <Input name="date" type="date" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">City *</label>
                  <Input name="city" required placeholder="E.g. Kolkata" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Venue Area *</label>
                  <Input name="area" required placeholder="E.g. Rajarhat" />
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Guest Count</label>
                  <Input name="guests" placeholder="Approximate number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Duration Needed</label>
                  <Input name="duration" placeholder="E.g. 3 hours" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="font-semibold text-lg border-b border-stone-100 pb-2">Art Requirements</h3>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Specific Art Service Needed *</label>
                  <select name="serviceSpecific" required className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900">
                    <option value="">Select...</option>
                    <option value="Live Sketching (Portraits)">Live Sketching (Guest Portraits)</option>
                    <option value="Live Painting (Event Scene)">Live Canvas Painting (Painting the event)</option>
                    <option value="Caricatures">Live Caricatures</option>
                    <option value="Custom Gifts">Custom Art Gifts setup</option>
                    <option value="Other">Other / Not sure</option>
                  </select>
               </div>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Style Reference (Optional)</label>
                  <Input name="reference" placeholder="Link to Pinterest board or Instagram post" />
               </div>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-900">Budget Range (Optional)</label>
                  <Input name="budget" placeholder="Approximate budget in ₹" />
               </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-stone-900">Additional Notes</label>
              <Textarea name="notes" placeholder="Any specific requirements for artist attire, setup space, or breaks?" />
            </div>

            <Button type="submit" variant="brand" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request Artist"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
