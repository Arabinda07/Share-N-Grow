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

export function DrawingTeachers() {
  const wizard = useFormWizard({
    name: '', phone: '', city: '', area: '',
    age: '', mode: '', goal: '',
    timing: '', budget: '', notes: '',
    consent: false
  }, 3);

  const { formData, handleInputChange, currentStep, isSubmitting, isSuccess, error } = wizard;

  const validateStep = (step: number, data: typeof formData) => {
    if (step === 1) {
      if (!data.name || !data.phone || !data.city || !data.area) {
        return "Please fill out required fields before proceeding.";
      }
    }
    if (step === 2) {
      if (!data.age || !data.mode || !data.goal) {
         return "Please provide age, class mode, and goal.";
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
      service_needed: 'drawing-teacher',
      budget_range: formData.budget,
      description: `Child Age: ${formData.age}\nClass Mode: ${formData.mode}\nTiming: ${formData.timing}\nGoal: ${formData.goal}\nNotes: ${formData.notes}`,
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
          We'll review your request and message you on WhatsApp to suggest suitable teachers.
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-ink leading-tight mb-6">Find a drawing teacher for your child.</h1>
        <p className="text-lg md:text-xl text-ink-light leading-relaxed mb-8">
          Tell us where you are and when you want classes. We'll introduce you to an instructor who fits your schedule.
        </p>
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={wizard.totalSteps} 
          steps={[{ label: 'Parent' }, { label: 'Preferences' }, { label: 'Details' }]}
          activeColor="bg-terracotta"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 px-4 md:px-0">
        <Card className="border border-whisper bg-paper-dark rounded-2xl shadow-none">
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
        
        <Card className="border border-whisper bg-white rounded-2xl shadow-none">
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

      <div className="mb-12 rounded-2xl bg-paper p-6 md:p-8 border border-whisper flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
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

             {/* Step 1: Parent Details & Location */}
             {currentStep === 1 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Parent Details</h3>
                    <p className="text-ink-light">How can we contact you?</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Parent Name *</label>
                      <Input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
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
                      <label className="text-sm font-medium text-ink">Area / Locality *</label>
                      <Input name="area" required value={formData.area} onChange={handleInputChange} placeholder="E.g. Salt Lake" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
               </div>
             )}

             {/* Step 2: Class Preferences */}
             {currentStep === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Class Preferences</h3>
                    <p className="text-ink-light">Tell us about the student and required classes.</p>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-ink">Child's Age *</label>
                     <Input name="age" required value={formData.age} onChange={handleInputChange} placeholder="E.g. 7 years old" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Preferred Class Mode *</label>
                      <select name="mode" required value={formData.mode} onChange={handleInputChange} className="flex h-14 w-full rounded-xl border border-whisper bg-paper px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none focus:bg-white transition-colors appearance-none">
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
                      <select name="goal" required value={formData.goal} onChange={handleInputChange} className="flex h-14 w-full rounded-xl border border-whisper bg-paper px-4 py-2 text-base text-ink focus:ring-ink focus:outline-none focus:bg-white transition-colors appearance-none">
                        <option value="">Select primary goal...</option>
                        <option value="Hobby & Fun">Hobby & Fun</option>
                        <option value="School Support">School Support</option>
                        <option value="Beginner Basics">Beginner Basics</option>
                        <option value="Advanced / Competitions">Advanced / Competitions</option>
                      </select>
                    </div>
                  </div>
               </div>
             )}
             
             {/* Step 3: Details */}
             {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Timing & Notes</h3>
                    <p className="text-ink-light">Any specific schedule or requests?</p>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Preferred Days/Timing</label>
                      <Input name="timing" value={formData.timing} onChange={handleInputChange} placeholder="E.g. Weekends morning" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Monthly Budget (Optional)</label>
                      <Input name="budget" value={formData.budget} onChange={handleInputChange} placeholder="Approximate budget in ₹" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Additional Notes</label>
                    <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any specific requirements or things the teacher should know?" className="min-h-[120px] rounded-xl border-whisper p-4 bg-paper focus:bg-white transition-colors" />
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
                ) : currentStep === wizard.totalSteps ? "Request Teacher" : (
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

