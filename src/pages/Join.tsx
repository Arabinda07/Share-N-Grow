import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { CheckCircledIcon as CheckCircle2, ExclamationTriangleIcon as AlertCircle } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

export function Join() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Store form data between steps
  const [formData, setFormData] = useState({
    name: '', contact: '', email: '', city: '', area: '', 
    mediums: '', portfolio: '', social: '', bio: '', message: '',
    paid_work: false, home_teaching: false, travel: false, 
    consent_public: false, consent_art: false
  });
  const [services, setServices] = useState<string[]>([]);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);

  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setServices(prev => 
      checked ? [...prev, service] : prev.filter(s => s !== service)
    );
  };

  const nextStep = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!formData.name || !formData.contact || !formData.city || !formData.area) {
        setError("Please fill in all required fields.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.mediums || services.length === 0) {
        setError("Please provide your mediums and select at least one service.");
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
    
    if (!formData.consent_public || !formData.consent_art) {
        setError("Please agree to the consent terms to proceed.");
        return;
    }

    setError(null);

    if (!hasSupabaseConfig) {
      setError("Database is not configured. (Developer: check Supabase credentials)");
      return;
    }

    // Bot check could be done via a hidden field
    const formElement = e.currentTarget;
    const botCheck = (formElement.elements.namedItem('_botcheck') as HTMLInputElement)?.value;
    if (botCheck) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    
    // Process File Upload if provided
    let uploadedFileUrl = "";
    if (portfolioFile && portfolioFile.size > 0) {
      if (portfolioFile.size > 5 * 1024 * 1024) {
        setError("File size must be under 5MB.");
        setIsSubmitting(false);
        return;
      }
      const fileExt = portfolioFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('application-uploads')
        .upload(fileName, portfolioFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError("Failed to upload portfolio file. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('application-uploads')
        .getPublicUrl(fileName);
        
      uploadedFileUrl = publicUrlData.publicUrl;
    }

    const mediumsArr = formData.mediums ? formData.mediums.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    let portfolioText = formData.portfolio;
    if (uploadedFileUrl) {
       portfolioText = portfolioText ? `${portfolioText}\n\nUploaded File: ${uploadedFileUrl}` : `Uploaded File: ${uploadedFileUrl}`;
    }

    const data = {
      name: formData.name,
      phone: formData.contact,
      email: formData.email,
      city: formData.city,
      area: formData.area,
      mediums: mediumsArr,
      service_interest: services,
      portfolio_links: portfolioText,
      social_links: formData.social,
      short_bio: formData.bio,
      available_for_paid_work: formData.paid_work,
      available_for_home_teaching: formData.home_teaching,
      available_for_travel: formData.travel,
      consent_profile_public: formData.consent_public,
      consent_artwork_public: formData.consent_art,
      message: formData.message,
    };

    const { error: dbError } = await supabase.from('join_requests').insert([data]);
    setIsSubmitting(false);

    if (dbError) {
      console.error(dbError);
      setError("Something went wrong submitting your application. Please try again.");
    } else {
      setIsSuccess(true);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 py-20 text-center">
        <CheckCircle2 className="mb-6 h-16 w-16 text-pine" />
        <h2 className="mb-4 text-3xl font-bold font-serif text-ink tracking-tight">We've got your application.</h2>
        <p className="mx-auto mb-8 max-w-md text-ink-light">
          We'll review your details and message you on WhatsApp to talk about the next steps.
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
        <title>Apply as Artist | ShareNGrow</title>
        <meta name="description" content="Apply to join our vetted community of local drawing teachers, muralists, and live event artists." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/join" />
      </Helmet>
      
      <div className="mb-12">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tighter text-ink leading-[1.1] font-serif mb-4">Apply as an Artist</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mt-8 max-w-sm">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 h-2 rounded-full bg-whisper overflow-hidden flex">
              <div 
                className={`h-full bg-ink transition-all duration-500 ease-out`}
                style={{ width: currentStep >= step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-sm mt-2">
            <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-ink' : 'text-ink-light'}`}>Basics</span>
            <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-ink' : 'text-ink-light'}`}>Art</span>
            <span className={`text-xs font-medium ${currentStep >= 3 ? 'text-ink' : 'text-ink-light'}`}>Details</span>
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

          <form onSubmit={handleSubmit}>
            <input type="text" name="_botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Let's start with the basics</h3>
                  <p className="text-ink-light">How can we contact you?</p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Full Name *</label>
                    <Input name="name" required value={formData.name} onChange={handleInputChange} placeholder="E.g. Arijit Sen" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">WhatsApp Number *</label>
                    <Input name="contact" required value={formData.contact} onChange={handleInputChange} placeholder="+91" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Email Address (Optional)</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
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

            {/* Step 2: Art */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Tell us about your art</h3>
                  <p className="text-ink-light">What do you do and where can we see it?</p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Mediums you work with *</label>
                    <Input name="mediums" required value={formData.mediums} onChange={handleInputChange} placeholder="E.g., Acrylic, Watercolour, Charcoal" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-medium text-ink block">Services you can offer (Select all that apply) *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'drawing-teacher', label: 'Drawing teacher' },
                      { id: 'wall-mural', label: 'Mural artist' },
                      { id: 'live-event-art', label: 'Live event artist' },
                      { id: 'workshop', label: 'Workshop facilitator' },
                      { id: 'portrait-custom-artwork', label: 'Portrait / Custom artist' },
                      { id: 'other', label: 'Other' },
                    ].map(service => (
                      <label key={service.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${services.includes(service.id) ? 'border-ink bg-ink/5' : 'border-whisper bg-paper hover:bg-paper-dark'}`}>
                         <input 
                           type="checkbox" 
                           checked={services.includes(service.id)} 
                           onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                           className="rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper h-5 w-5" 
                          />
                         <span className="text-sm font-medium text-ink">{service.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-ink">Portfolio Link</label>
                      <Input name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="Google Drive, Behance, or Website URL" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                  </div>
                  
                  <div className="space-y-2 pt-2 relative">
                      <label className="text-sm font-medium text-ink">Or Upload a Portfolio File <span className="text-ink-light font-normal">(PDF/Image max 5MB)</span></label>
                      <div className="relative">
                          <Input 
                            type="file" 
                            name="portfolio_file" 
                            accept=".pdf,.jpeg,.jpg,.png" 
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setPortfolioFile(e.target.files[0]);
                                } else {
                                    setPortfolioFile(null);
                                }
                            }}
                            className="rounded-xl border-whisper file:mr-4 file:rounded-full file:border-0 file:bg-white file:border-whisper file:border-solid file:border file:px-4 file:py-1.5 file:text-sm file:font-semibold hover:file:bg-paper-dark transition-all cursor-pointer h-14 pt-2.5 text-ink-light bg-paper focus:bg-white" 
                          />
                      </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Instagram / Facebook Link</label>
                    <Input name="social" value={formData.social} onChange={handleInputChange} placeholder="https://instagram.com/yourhandle" className="rounded-xl border-whisper h-14 bg-paper focus:bg-white transition-colors" />
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="font-semibold text-2xl text-ink font-serif tracking-tight mb-2">Final touches</h3>
                  <p className="text-ink-light">Bio, availability, and consent.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Short Bio</label>
                    <Textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us a bit about yourself and your artistic journey (Optional but recommended)..." className="min-h-[120px] rounded-xl border-whisper p-4 bg-paper focus:bg-white transition-colors" />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-ink block">Availability</label>
                  <div className="space-y-3 bg-paper p-5 rounded-2xl border border-whisper">
                     <div className="flex items-start gap-4">
                        <input type="checkbox" id="paid_work" name="paid_work" checked={formData.paid_work} onChange={handleInputChange} className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                        <label htmlFor="paid_work" className="text-sm font-medium text-ink leading-relaxed cursor-pointer">I am available to take on paid client work.</label>
                      </div>
                      <div className="flex items-start gap-4">
                        <input type="checkbox" id="home_teaching" name="home_teaching" checked={formData.home_teaching} onChange={handleInputChange} className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                        <label htmlFor="home_teaching" className="text-sm font-medium text-ink leading-relaxed cursor-pointer">I am available for home-visit teaching (if applying as teacher).</label>
                      </div>
                      <div className="flex items-start gap-4">
                        <input type="checkbox" id="travel" name="travel" checked={formData.travel} onChange={handleInputChange} className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                        <label htmlFor="travel" className="text-sm font-medium text-ink leading-relaxed cursor-pointer">I am willing to travel outside my immediate area for projects.</label>
                      </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-whisper">
                    <div className="flex items-start gap-4">
                      <input type="checkbox" id="consent_public" name="consent_public" checked={formData.consent_public} onChange={handleInputChange} required className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="consent_public" className="text-sm text-ink-light leading-relaxed cursor-pointer">I consent to having my public profile published on ShareNGrow if approved. <strong className="font-medium text-ink">(Private phone/email will not be shown).</strong> *</label>
                    </div>
                    <div className="flex items-start gap-4">
                      <input type="checkbox" id="consent_art" name="consent_art" checked={formData.consent_art} onChange={handleInputChange} required className="mt-1 h-5 w-5 rounded border-whisper text-ink focus:ring-ink focus:ring-offset-paper" />
                      <label htmlFor="consent_art" className="text-sm text-ink-light leading-relaxed cursor-pointer">I consent to having my submitted artwork samples published on my profile. *</label>
                    </div>
                </div>
                
                 <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-ink">Message to Admins (Optional)</label>
                    <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Anything else we should know?" className="rounded-xl border-whisper min-h-[100px] p-4 bg-paper focus:bg-white transition-colors" />
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
                className={`h-14 flex-1 text-base bg-ink hover:bg-ink-light text-white rounded-xl transition-all duration-300 ease-out active:scale-[0.98] ${currentStep === 1 ? 'w-full' : ''}`} 
                disabled={isSubmitting || !hasSupabaseConfig}
              >
                {isSubmitting ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                ) : currentStep === totalSteps ? (
                   "Submit Application"
                ) : (
                  <>Next Step <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
       <div className="mt-8 rounded-[1.5rem] bg-paper p-6 border border-whisper text-center">
        <p className="text-ink-light text-sm leading-relaxed">
          Applying doesn't guarantee a spot. We review applications personally to make sure the network stays reliable for both artists and clients. We're looking for clear examples of your work and a professional approach.
        </p>
      </div>
    </div>
  );
}
