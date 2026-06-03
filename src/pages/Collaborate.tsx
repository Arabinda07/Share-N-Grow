import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { api } from '../lib/api';
import { hasSupabaseConfig } from '../lib/supabase';
import { CheckCircledIcon as CheckCircle2, ExclamationTriangleIcon as AlertCircle } from '@radix-ui/react-icons';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useFormWizard } from '../hooks/useFormWizard';
import { WizardProgress } from '../components/ui/wizard-progress';
import { Link } from 'react-router-dom';

export function Collaborate() {
  const wizard = useFormWizard({
    name: '', org: '', role: '', city: '',
    phone: '', email: '',
    collabType: '', timeline: '', budget: '', description: '',
    consent: false
  }, 3);

  const { formData, handleInputChange, currentStep, isSubmitting, isSuccess, error } = wizard;

  const validateStep = (step: number, data: typeof formData) => {
    if (step === 1) {
      if (!data.name || !data.org || !data.city) {
        return "Please fill out required organization details before proceeding.";
      }
    }
    if (step === 2) {
      if (!data.phone) {
         return "Please provide your contact number. Email is optional but recommended.";
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

    if (!formData.collabType || !formData.description) {
       wizard.setError("Please specify collaboration type and provide a brief description.");
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
      organization_name: formData.org,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      collaboration_type: formData.collabType,
      budget_range: formData.budget,
      preferred_timeline: formData.timeline,
      description: formData.description,
    };

    const { error: dbError } = await api.submitCollaborationRequest(data);

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
          We'll review your collaboration proposal and message you to discuss it further.
        </p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-12 md:mb-20 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-ink leading-tight mb-6">Collaborate with ShareNGrow.</h1>
        <p className="text-lg md:text-xl text-ink-light leading-relaxed mb-8 max-w-2xl">
          We partner with schools, offices, cafés, NGOs, colleges, cultural groups, and event partners to bring more art into local spaces.
        </p>
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={wizard.totalSteps} 
          steps={[{ label: 'Organization' }, { label: 'Contact' }, { label: 'Partnership' }]}
          activeColor="bg-terracotta"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-16 px-4 md:px-0">
        <Card className="border-whisper bg-paper-dark rounded-[2rem] shadow-none">
          <CardContent className="p-8">
            <h3 className="font-bold text-lg md:text-xl text-ink tracking-tight font-serif mb-3">For Schools & Colleges</h3>
             <p className="text-base text-ink-light leading-relaxed">Hire guest faculty, organise specialized art workshops, or find judges for cultural fests.</p>
          </CardContent>
        </Card>
        <Card className="border-whisper bg-white rounded-[2rem] shadow-none">
          <CardContent className="p-8">
            <h3 className="font-bold text-lg md:text-xl text-ink tracking-tight font-serif mb-3">For Offices & Businesses</h3>
             <p className="text-base text-ink-light leading-relaxed">Team-building art workshops, office murals, or finding local art for your café walls.</p>
          </CardContent>
        </Card>
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

          <form onSubmit={handleSubmit}>
             <input type="text" name="_botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

             {/* Step 1: Organization Details */}
             {currentStep === 1 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Organization</h3>
                    <p className="text-ink-light">Who are you representing?</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Your Name *</label>
                      <Input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Organisation Name *</label>
                      <Input name="org" required value={formData.org} onChange={handleInputChange} placeholder="School, Company, NGO..." className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Your Role (Optional)</label>
                      <Input name="role" value={formData.role} onChange={handleInputChange} placeholder="E.g. Principal, HR Manager..." className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">City *</label>
                      <Input name="city" required value={formData.city} onChange={handleInputChange} placeholder="E.g. Kolkata" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
               </div>
             )}

             {/* Step 2: Contact */}
             {currentStep === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Contact Info</h3>
                    <p className="text-ink-light">How can we reach you?</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">WhatsApp / Phone *</label>
                    <Input name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Phone number" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Email Address (Optional)</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="hello@company.com" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
               </div>
             )}
             
             {/* Step 3: Partnership Details */}
             {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Partnership</h3>
                    <p className="text-ink-light">What are you looking to achieve together?</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Type of Collaboration *</label>
                    <select name="collabType" required value={formData.collabType} onChange={handleInputChange} className="flex h-14 w-full rounded-xl border border-whisper bg-paper px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none focus:bg-white transition-colors appearance-none">
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
                    <Textarea name="description" required value={formData.description} onChange={handleInputChange} placeholder="Tell us what you are looking to achieve..." className="min-h-[120px] rounded-xl border-whisper p-4 bg-paper focus:bg-white transition-colors" />
                  </div>
                   
                   <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Preferred Timeline (Optional)</label>
                      <Input name="timeline" value={formData.timeline} onChange={handleInputChange} placeholder="E.g. Next month, Ongoing..." className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Budget Range (Optional)</label>
                      <Input name="budget" value={formData.budget} onChange={handleInputChange} placeholder="Approximate budget in ₹" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                   </div>
                  
                  <div className="flex items-start gap-4 pt-6 border-t border-whisper">
                     <input id="consent" name="consent" type="checkbox" checked={formData.consent} onChange={handleInputChange} required className="mt-1 h-5 w-5 border-whisper text-ink focus:ring-ink focus:ring-offset-paper rounded" />
                     <label htmlFor="consent" className="text-sm font-medium text-ink leading-relaxed cursor-pointer">
                       I agree to be contacted to discuss this proposal. My details won't be made public. *
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
                ) : currentStep === wizard.totalSteps ? "Submit Proposal" : (
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
