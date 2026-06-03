import { Link } from 'react-router-dom';
import { FacebookLogo, InstagramLogo, WhatsappLogo, EnvelopeSimple } from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="border-t border-ink-light/10 bg-white py-16 text-sm text-ink-light mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid md:grid-cols-5 gap-12">
        <div className="col-span-1 md:col-span-2">
          <span className="text-xl font-bold font-serif text-ink tracking-tight block mb-4">ShareNGrow</span>
          <p className="max-w-xs leading-relaxed text-ink-light mb-6">
            A curated network connecting local artists with clients.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/sharengrowart" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-terracotta transition-colors" aria-label="Visit ShareNGrow on Facebook">
              <FacebookLogo className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/sharengrow/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-terracotta transition-colors" aria-label="Visit ShareNGrow on Instagram">
              <InstagramLogo className="w-6 h-6" />
            </a>
            <a href="https://chat.whatsapp.com/JtEre6AP4zaEXgJVu8edVe" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-terracotta transition-colors" aria-label="Join ShareNGrow WhatsApp Community">
              <WhatsappLogo className="w-6 h-6" />
            </a>
            <a href="mailto:sharengrowofficial@gmail.com" className="text-ink hover:text-terracotta transition-colors" aria-label="Email ShareNGrow directly">
              <EnvelopeSimple className="w-6 h-6" />
            </a>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-ink">Services</p>
          <Link to="/directory" className="hover:text-terracotta transition-colors">Artist Directory</Link>
          <Link to="/hire" className="hover:text-terracotta transition-colors">Request Custom Work</Link>
          <Link to="/drawing-teachers" className="hover:text-terracotta transition-colors">Drawing Teachers</Link>
          <Link to="/wall-murals" className="hover:text-terracotta transition-colors">Wall Murals</Link>
          <Link to="/events-live-art" className="hover:text-terracotta transition-colors">Live Event Art</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-ink">Network</p>
          <Link to="/join" className="hover:text-terracotta transition-colors">Join Us</Link>
          <Link to="/collaborate" className="hover:text-terracotta transition-colors">Collaborate</Link>
          <Link to="/faq" className="hover:text-terracotta transition-colors">FAQ</Link>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-semibold text-ink">Connect</p>
          <Link to="/contact" className="hover:text-terracotta transition-colors">Contact Us</Link>
          <a href="https://chat.whatsapp.com/JtEre6AP4zaEXgJVu8edVe" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">WhatsApp Community</a>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] mt-16 pt-8 border-t border-ink-light/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-light/70">
         <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
           <p>© {new Date().getFullYear()} ShareNGrow. All rights reserved.</p>
           <p>Trusted local artists.</p>
         </div>
         <div className="flex gap-6">
           <Link to="/privacy" className="hover:text-terracotta transition-colors">Privacy Policy</Link>
           <Link to="/terms" className="hover:text-terracotta transition-colors">Terms of Service</Link>
         </div>
      </div>
    </footer>
  );
}

