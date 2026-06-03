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

export function WallMurals() {
  const wizard = useFormWizard({
    name: '', phone: '', org: '', city: '', area: '',
    locationType: '', size: '', style: '',
    reference: '', deadline: '', budget: '', notes: '',
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
      if (!data.locationType || !data.size) {
         return "Please specify the wall size and location type.";
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
      service_needed: 'wall-mural',
      budget_range: formData.budget,
      deadline: formData.deadline,
      reference_url: formData.reference,
      description: `Organization: ${formData.org}\nLocation Type: ${formData.locationType}\nWall Size: ${formData.size}\nStyle: ${formData.style}\nNotes: ${formData.notes}`,
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
          We'll review your project details and message you on WhatsApp to discuss artist matches.
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
        <title>Hire Wall Mural Artists | ShareNGrow</title>
        <meta name="description" content="Turn a blank wall into a custom painted space. Hire local wall mural artists for cafes, schools, offices, or homes." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/wall-murals" />
      </Helmet>
      
      <div className="mb-12 mt-6 max-w-4xl mx-auto px-4 md:px-0">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tighter text-ink leading-[1.1] font-serif mb-6">Turn a blank wall into art.</h1>
        <p className="text-lg md:text-xl text-ink-light leading-relaxed mb-8">
          Tell us the wall size, location, and what you want to paint. We'll introduce you to muralists who do exactly this.
        </p>
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={wizard.totalSteps} 
          steps={[{ label: 'Client' }, { label: 'Wall' }, { label: 'Vision' }]}
          activeColor="bg-terracotta"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-16 max-w-4xl mx-auto px-4 md:px-0">
        <Card className="border border-whisper bg-paper-dark rounded-2xl shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">Who asks for this?</h3>
            <ul className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg">
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Cafés and restaurants</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Offices and co-working spaces</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Schools and play spaces</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Gyms and studios</li>
              <li className="flex items-start"><span className="text-terracotta mr-3 font-bold">•</span> Private residences</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border border-whisper bg-white rounded-2xl shadow-none">
          <CardContent className="p-8 md:p-10">
            <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6 text-ink tracking-tight font-serif">How it works</h3>
            <ol className="list-none text-ink-light space-y-3 md:space-y-4 text-base md:text-lg counter-reset-works">
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">1</span> Send us wall dimensions and an idea.</li>
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">2</span> An artist sends back a concept and quote.</li>
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">3</span> Discuss timeline and material costs.</li>
              <li className="flex items-start"><span className="font-mono text-xs bg-ink text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-1 shrink-0">4</span> Bring the wall to life.</li>
            </ol>
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

             {/* Step 1: Your Details */}
             {currentStep === 1 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Your Details</h3>
                    <p className="text-ink-light">Who is organizing this project?</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Name *</label>
                      <Input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                      <Input name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Phone number" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-ink">Business / Organisation Name (Optional)</label>
                     <Input name="org" value={formData.org} onChange={handleInputChange} placeholder="Café name, School name, etc." className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">City *</label>
                      <Input name="city" required value={formData.city} onChange={handleInputChange} placeholder="E.g. Kolkata" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Area / Locality *</label>
                      <Input name="area" required value={formData.area} onChange={handleInputChange} placeholder="E.g. Ballygunge" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
               </div>
             )}

             {/* Step 2: Wall Context */}
             {currentStep === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Wall Details</h3>
                    <p className="text-ink-light">Tell us about the space.</p>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Location Type *</label>
                      <select name="locationType" required value={formData.locationType} onChange={handleInputChange} className="flex h-14 w-full rounded-xl border border-whisper bg-paper px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none focus:bg-white transition-colors appearance-none">
                        <option value="">Select...</option>
                        <option value="Indoor">Indoor Wall</option>
                        <option value="Outdoor">Outdoor Wall / Exterior</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Approximate Size *</label>
                      <Input name="size" required value={formData.size} onChange={handleInputChange} placeholder="E.g. 10ft x 8ft" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
               </div>
             )}
             
             {/* Step 3: Project Vision */}
             {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Project Vision</h3>
                    <p className="text-ink-light">Timing, budget, and design ideas.</p>
                  </div>
                  
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Preferred Style / Theme</label>
                      <Input name="style" value={formData.style} onChange={handleInputChange} placeholder="E.g. Floral, Abstract, Typography, Cartoon..." className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Wall Photo or Reference Link (Optional)</label>
                      <Input name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Link to Google Drive or Pinterest board" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                   </div>
                   
                   <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Deadline (Optional)</label>
                      <Input name="deadline" value={formData.deadline} onChange={handleInputChange} placeholder="When do you need it done?" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                      <Input name="budget" value={formData.budget} onChange={handleInputChange} placeholder="Approximate budget in ₹" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                   </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Additional Notes</label>
                    <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Is the wall textured? Are ladders needed? Any specific timing limits?" className="min-h-[140px] rounded-xl border-whisper p-4 bg-paper focus:bg-white transition-colors" />
                    <p className="text-xs text-ink-light mt-4 leading-relaxed">
                      Final quote depends on wall size, surface condition, location, design complexity, and material requirements.
                    </p>
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
                ) : currentStep === wizard.totalSteps ? "Request Quote" : (
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
