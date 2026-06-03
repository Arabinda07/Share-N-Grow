import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-ink-light/10 bg-white py-16 text-sm text-ink-light mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <span className="text-xl font-bold font-sans text-ink tracking-tight block mb-4">ShareNGrow</span>
          <p className="max-w-xs leading-relaxed text-ink-light">
            A curated network connecting local artists with clients.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-ink">Services</h4>
          <Link to="/directory" className="hover:text-terracotta transition-colors">Artist Directory</Link>
          <Link to="/hire" className="hover:text-terracotta transition-colors">Request Custom Work</Link>
          <Link to="/drawing-teachers" className="hover:text-terracotta transition-colors">Drawing Teachers</Link>
          <Link to="/wall-murals" className="hover:text-terracotta transition-colors">Wall Murals</Link>
          <Link to="/events-live-art" className="hover:text-terracotta transition-colors">Live Event Art</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-ink">Partners</h4>
          <Link to="/join" className="hover:text-terracotta transition-colors">Apply as Artist</Link>
          <Link to="/collaborate" className="hover:text-terracotta transition-colors">Collaborate</Link>
          <Link to="/faq" className="hover:text-terracotta transition-colors">FAQ</Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] mt-16 pt-8 border-t border-ink-light/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-light/70">
         <p>© {new Date().getFullYear()} ShareNGrow. All rights reserved.</p>
         <p>Trusted local artists.</p>
      </div>
    </footer>
  );
}

