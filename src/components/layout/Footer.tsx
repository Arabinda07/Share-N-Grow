import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-paper-dark py-12 text-sm text-ink-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <span className="text-lg font-semibold font-serif text-ink block mb-3">ShareNGrow</span>
          <p className="max-w-xs leading-relaxed">
            A curated network connecting local artists with clients in West Bengal, India.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-ink">For Clients</h4>
          <Link to="/directory" className="hover:text-terracotta">Artist Directory</Link>
          <Link to="/hire" className="hover:text-terracotta">Hire an Artist</Link>
          <Link to="/drawing-teachers" className="hover:text-terracotta">Find a Drawing Teacher</Link>
          <Link to="/wall-murals" className="hover:text-terracotta">Request a Mural</Link>
          <Link to="/events-live-art" className="hover:text-terracotta">Book Live Artists</Link>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-ink">For Partners & Artists</h4>
          <Link to="/join" className="hover:text-terracotta">Apply as Artist</Link>
          <Link to="/collaborate" className="hover:text-terracotta">Collaborate with Us</Link>
          <Link to="/admin" className="hover:text-terracotta">Admin Login</Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-light">
         <p>© {new Date().getFullYear()} ShareNGrow. All rights reserved.</p>
         <p>Trusted local artists in Bengal.</p>
      </div>
    </footer>
  );
}
