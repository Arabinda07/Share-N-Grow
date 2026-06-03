import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import React from 'react';
import { api } from '../lib/api';
import { hasSupabaseConfig } from '../lib/supabase';
import { CheckCircledIcon as CheckCircle2, ExclamationTriangleIcon as AlertCircle } from '@radix-ui/react-icons';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useFormWizard } from '../hooks/useFormWizard';
import { WizardProgress } from '../components/ui/wizard-progress';

export function EventsLiveArt() {
  const wizard = useFormWizard({
    name: '', phone: '', city: '', area: '',
    eventType: '', date: '', guests: '', duration: '', serviceSpecific: '',
    reference: '', budget: '', notes: '',
    consent: false
  }, 3);

  const { formData, handleInputChange, currentStep, isSubmitting, isSuccess, error } = wizard;

  const validateStep = (step: number, data: typeof formData) => {
    if (step === 1) {
      if (!data.name || !data.phone || !data.city || !data.area) {
        return "Please fill out required contact and location fields before proceeding.";
      }
    }
    if (step === 2) {
      if (!data.eventType || !data.date || !data.serviceSpecific) {
         return "Please provide the event type, date, and specific service needed.";
      }
    }
    return null;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentStep !== wizard.totalSteps) {
      wizard.nextStep(validateStep);
      return;
    }

    if (!formData.consent) {
       wizard.setError("Please accept the terms to submit your request.");
       return;
    }

    wizard.setError(null);

    if (!hasSupabaseConfig) {
      wizard.setError("Database is not configured. (Developer: check Supabase credentials)");
      return;
    }

    // Bot check
    const formElement = e.currentTarget;
    const botCheck = (formElement.elements.namedItem('_botcheck') as HTMLInputElement)?.value;
    if (botCheck) {
      wizard.setIsSuccess(true);
      return;
    }

    wizard.setIsSubmitting(true);
    const data = {
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      area: formData.area,
      service_needed: 'live-event-art',
      budget_range: formData.budget,
      deadline: formData.date,
      reference_url: formData.reference,
      description: `Event Type: ${formData.eventType}\nGuests: ${formData.guests}\nDuration: ${formData.duration}\nService: ${formData.serviceSpecific}\nNotes: ${formData.notes}`,
    };

    const { error: dbError } = await api.submitInquiry(data);

    wizard.setIsSubmitting(false);

    if (dbError) {
      console.error(dbError);
      wizard.setError("Something went wrong submitting your request. Please try again.");
    } else {
      wizard.setIsSuccess(true);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 py-20 text-center">
        <CheckCircle2 className="mb-6 h-16 w-16 text-terracotta" />
        <h2 className="mb-4 text-3xl font-bold font-serif text-ink">We have your request.</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          We'll review your event details and message you on WhatsApp to discuss artist availability.
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
        <title>Hire Live Event Artists | ShareNGrow</title>
        <meta name="description" content="Book live artists for weddings, events, and special gatherings. Live sketching, guest caricatures, and event painting." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/events-live-art" />
      </Helmet>
      
      <div className="mb-12 mt-6 max-w-4xl mx-auto px-4 md:px-0">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tighter text-ink leading-[1.1] font-serif mb-6">Book live artists for weddings and events.</h1>
        <p className="text-lg md:text-xl text-ink-light leading-relaxed mb-8">
          We bring fast-flow watercolor caricatures, live guest sketching, and live canvas painting to premium gatherings.
        </p>
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={wizard.totalSteps} 
          steps={[{ label: 'Client' }, { label: 'Event' }, { label: 'Details' }]}
          activeColor="bg-terracotta"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-16 max-w-4xl mx-auto px-4 md:px-0">
        <Card className="border border-whisper bg-paper-dark rounded-[2rem] shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">Popular services</h3>
            <ul className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Live guest sketching</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Live canvas painting</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Guest caricatures</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Event art booths</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Custom event gifts for guests</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border border-whisper bg-white rounded-[2rem] shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">Event details we need</h3>
            <ul className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Event date and time</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Venue location</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Expected guest count</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Duration of the service</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Preferred style of art</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-whisper bg-white rounded-[2rem] shadow-none p-6 sm:p-10 md:p-12 overflow-hidden relative" id="request-form">
        <CardContent className="p-0">
          {!hasSupabaseConfig && (
             <div className="mb-8 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-900 border border-red-100">
               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
               <p className="text-sm font-medium">Database is not configured. Please add Supabase credentials in the settings.</p>
             </div>
          )}

          {error && (
            <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-900 border border-red-100 flex items-start gap-3">
               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
             <input type="text" name="_botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

             {/* Step 1: Client Details */}
             {currentStep === 1 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Client Details</h3>
                    <p className="text-ink-light">Who is planning this event?</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Name *</label>
                      <Input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full Name or Event Agency" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                      <Input name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Phone number" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">City *</label>
                      <Input name="city" required value={formData.city} onChange={handleInputChange} placeholder="E.g. Kolkata" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Venue Area *</label>
                      <Input name="area" required value={formData.area} onChange={handleInputChange} placeholder="E.g. Rajarhat" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
               </div>
             )}

             {/* Step 2: Event Details */}
             {currentStep === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Event Details</h3>
                    <p className="text-ink-light">Tell us about the event and what you are looking for.</p>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Event Type *</label>
                      <Input name="eventType" required value={formData.eventType} onChange={handleInputChange} placeholder="E.g. Wedding, Corporate Party, Birthday..." className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Event Date *</label>
                      <Input name="date" type="date" required value={formData.date} onChange={handleInputChange} className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Specific Art Service Needed *</label>
                    <select name="serviceSpecific" required value={formData.serviceSpecific} onChange={handleInputChange} className="flex h-14 w-full rounded-xl border border-whisper bg-paper px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none focus:bg-white transition-colors appearance-none">
                      <option value="">Select...</option>
                      <option value="Live Sketching (Portraits)">Live Sketching (Guest Portraits)</option>
                      <option value="Live Painting (Event Scene)">Live Canvas Painting (Painting the event)</option>
                      <option value="Caricatures">Live Caricatures</option>
                      <option value="Custom Gifts">Custom Art Gifts setup</option>
                      <option value="Other">Other / Not sure</option>
                    </select>
                  </div>
               </div>
             )}
             
             {/* Step 3: Details */}
             {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Guest count & Details</h3>
                    <p className="text-ink-light">Help us estimate the scope of the project.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Guest Count</label>
                      <Input name="guests" value={formData.guests} onChange={handleInputChange} placeholder="Approximate number" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Duration Needed</label>
                      <Input name="duration" value={formData.duration} onChange={handleInputChange} placeholder="E.g. 3 hours" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
                  
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Style Reference (Optional)</label>
                      <Input name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Link to Pinterest board or Instagram post" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                      <Input name="budget" value={formData.budget} onChange={handleInputChange} placeholder="Approximate budget in ₹" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                   </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Additional Notes</label>
                    <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any specific requirements for artist attire, setup space, or breaks?" className="min-h-[140px] rounded-xl border-whisper p-4 bg-paper focus:bg-white transition-colors" />
                  </div>
                  
                  <div className="flex items-start gap-4 pt-6 border-t border-whisper">
                     <input id="consent" name="consent" type="checkbox" checked={formData.consent} onChange={handleInputChange} required className="mt-1 h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper rounded" />
                     <label htmlFor="consent" className="text-sm font-medium text-ink leading-relaxed cursor-pointer">
                       I agree to be contacted via WhatsApp or phone. My details won't be made public. *
                     </label>
                  </div>
                </div>
             )}

            <div className="flex items-center gap-4 mt-12 pt-6 border-t border-whisper">
              {currentStep > 1 && (
                <Button type="button" variant="outline" size="lg" onClick={wizard.prevStep} className="h-14 px-6 rounded-xl border-whisper hover:bg-paper-dark group">
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                </Button>
              )}
              
              <Button 
                type="submit" 
                size="lg" 
                className={`h-14 flex-1 text-base shadow-none bg-ink hover:bg-ink-light text-white rounded-xl transition-all duration-300 ease-out active:scale-[0.98] ${currentStep === 1 ? 'w-full' : ''}`}
                disabled={isSubmitting || !hasSupabaseConfig}
              >
                {isSubmitting ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                ) : currentStep === wizard.totalSteps ? "Request Artist" : (
                  <>Next Step <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

