import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { SERVICES } from '../types';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircledIcon as CheckCircle2, ExclamationTriangleIcon as AlertCircle } from '@radix-ui/react-icons';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

export function Hire() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const preselectedArtistId = searchParams.get('artist');

  const [formData, setFormData] = useState({
    name: '', contact: '', email: '', city: '', area: '',
    service: '', budget: '', deadline: '', details: '', reference: '',
    consent: false
  });

  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.contact || !formData.city || !formData.area) {
        setError("Please fill out required fields before proceeding.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.service || !formData.details) {
         setError("Please select a service and provide project details.");
         return;
      }
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentStep !== totalSteps) {
      nextStep();
      return;
    }

    if (!formData.consent) {
       setError("Please accept the terms to submit your request.");
       return;
    }

    setError(null);
    
    // Bot check
    const formElement = e.currentTarget;
    const botCheck = (formElement.elements.namedItem('_botcheck') as HTMLInputElement)?.value;
    if (botCheck) {
      setIsSuccess(true);
      return;
    }

    if (!hasSupabaseConfig) {
      setError("Database is not configured. (Developer: check Supabase credentials)");
      return;
    }

    setIsSubmitting(true);
    const data = {
      name: formData.name,
      phone: formData.contact,
      email: formData.email,
      city: formData.city,
      area: formData.area,
      service_needed: formData.service,
      budget_range: formData.budget,
      deadline: formData.deadline,
      description: formData.details,
      reference_url: formData.reference,
      selected_artist_id: preselectedArtistId || null,
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
        <CheckCircle2 className="mb-6 h-16 w-16 text-terracotta" />
        <h2 className="mb-4 text-3xl font-bold text-ink">We have your request.</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          We'll review your project details and message you on WhatsApp to set up an introduction.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 sm:py-32 lg:px-8 min-h-[90vh]">
      <Helmet>
        <title>Hire an Artist | ShareNGrow</title>
        <meta name="description" content="Request custom art work, murals, live event art, or find a drawing teacher. We match you with vetted local professionals." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/hire" />
      </Helmet>
      
      <div className="mb-12">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold font-serif tracking-tighter text-ink leading-[1.1] mb-4">Hire an Artist</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mt-8 max-w-sm">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 h-2 rounded-full bg-whisper overflow-hidden flex">
              <div 
                className={`h-full bg-terracotta transition-all duration-500 ease-out`}
                style={{ width: currentStep >= step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-sm mt-2">
            <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-ink' : 'text-ink-light'}`}>Client</span>
            <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-ink' : 'text-ink-light'}`}>Project</span>
            <span className={`text-xs font-medium ${currentStep >= 3 ? 'text-ink' : 'text-ink-light'}`}>Review</span>
        </div>
      </div>

      <Card className="border border-whisper bg-white rounded-[2rem] shadow-none p-6 sm:p-10 md:p-12 overflow-hidden relative">
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
          
          {preselectedArtistId && currentStep === 1 && (
            <div className="mb-8 rounded-xl bg-paper p-4 text-sm text-ink flex items-start gap-3 border border-whisper animate-in fade-in">
               <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#25D366] shrink-0" />
               <p>We see you selected an artist. We'll reach out to them first to check availability.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
             <input type="text" name="_botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

             {/* Step 1: Client Details */}
             {currentStep === 1 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Your information</h3>
                    <p className="text-ink-light">How can we contact you?</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Full Name *</label>
                      <Input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Name" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                      <Input name="contact" required value={formData.contact} onChange={handleInputChange} placeholder="Phone number" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Email (Optional)</label>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">City *</label>
                      <Input name="city" required value={formData.city} onChange={handleInputChange} placeholder="E.g. Kolkata" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Area / Locality *</label>
                      <Input name="area" required value={formData.area} onChange={handleInputChange} placeholder="E.g. Salt Lake" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
               </div>
             )}

             {/* Step 2: Project Details */}
             {currentStep === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Project details</h3>
                    <p className="text-ink-light">What are you looking for?</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Service Needed *</label>
                    <select
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleInputChange}
                      className="flex h-14 w-full rounded-xl border border-whisper bg-paper px-4 py-2 text-base text-ink focus:outline-none focus:ring-1 focus:ring-ink focus:bg-white transition-colors"
                    >
                      <option value="">Select a service...</option>
                      <option value="drawing-teacher">Drawing teacher for child</option>
                      <option value="wall-mural">Wall mural</option>
                      <option value="live-event-art">Live event artist</option>
                      <option value="portrait-custom-artwork">Portrait or custom artwork</option>
                      <option value="workshop">Workshop for school/office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Short Description *</label>
                    <Textarea 
                      name="details" 
                      required 
                      value={formData.details}
                      onChange={handleInputChange}
                      placeholder="Give us an idea of what you need..." 
                      className="min-h-[140px] rounded-xl border-whisper p-4 bg-paper focus:bg-white transition-colors"
                    />
                  </div>
               </div>
             )}
             
             {/* Step 3: Timeline & Final Context */}
             {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Budget & timeline</h3>
                    <p className="text-ink-light">Help us set expectations.</p>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                      <Input name="budget" value={formData.budget} onChange={handleInputChange} placeholder="₹" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Preferred Date/Deadline</label>
                      <Input name="deadline" value={formData.deadline} onChange={handleInputChange} placeholder="E.g. Next month" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Reference Image or Link (Optional)</label>
                      <Input name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Drive / Pinterest link" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
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
                <Button type="button" variant="outline" size="lg" onClick={prevStep} className="h-14 px-6 rounded-xl border-whisper hover:bg-paper-dark group">
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
                ) : currentStep === totalSteps ? "Send Request" : (
                  <>Next Step <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
       <div className="mt-8 rounded-[1.5rem] bg-paper p-6 border border-whisper text-center">
        <p className="text-ink-light text-sm leading-relaxed">
          Tell us what you're looking for. We'll review your project and introduce you to an artist who fits the bill.
        </p>
      </div>
    </div>
  );
}
