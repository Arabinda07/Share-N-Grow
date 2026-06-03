import { Link } from 'react-router-dom';
import { Bars3Icon as Menu } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-light/10 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white font-bold font-sans">
                S
              </div>
              <span className="text-xl font-bold font-sans tracking-tight text-ink">
                ShareNGrow
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/directory" className="text-sm font-medium text-ink hover:text-terracotta transition-colors">
              Directory
            </Link>
            <Link to="/hire" className="text-sm font-medium text-ink hover:text-terracotta transition-colors">
              Hire Talent
            </Link>
            <Link to="/join" className="text-sm font-medium text-ink hover:text-terracotta transition-colors">
              Apply as Artist
            </Link>
            <Link to="/faq" className="text-sm font-medium text-ink hover:text-terracotta transition-colors">
              FAQ
            </Link>
            <Link to="/hire">
              <Button size="sm" className="bg-ink hover:bg-ink-light text-white rounded-full transition-transform active:scale-[0.98] shadow-none">Get Started</Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-ink-light"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-ink-light/10 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link 
            to="/directory" 
            className="block text-base font-medium text-ink w-full p-2 hover:text-terracotta transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Directory
          </Link>
          <Link 
            to="/hire" 
            className="block text-base font-medium text-ink w-full p-2 hover:text-terracotta transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Hire Talent
          </Link>
          <Link 
            to="/join" 
            className="block text-base font-medium text-ink w-full p-2 hover:text-terracotta transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Apply as Artist
          </Link>
          <Link 
            to="/faq" 
            className="block text-base font-medium text-ink w-full p-2 hover:text-terracotta transition-colors"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          <Link to="/hire" onClick={() => setIsOpen(false)} className="block pt-2">
            <Button className="w-full bg-ink hover:bg-ink-light text-white rounded-full transition-transform active:scale-[0.98] shadow-none">Get Started</Button>
          </Link>
        </div>
      )}
    </header>
  );
}

