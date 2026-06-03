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
            <Link to="/" className="flex items-center gap-3">
              <img src="/favicon.svg" alt="ShareNGrow Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-medium font-sans tracking-tighter text-ink">
                ShareNGrow
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/directory" className="text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300">
              Directory
            </Link>
            <Link to="/hire" className="text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300">
              Hire Talent
            </Link>
            <Link to="/join" className="text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300">
              Apply as Artist
            </Link>
            <Link to="/faq" className="text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300">
              FAQ
            </Link>
            <Link to="/hire">
              <Button size="sm" className="bg-ink hover:bg-ink-light text-white rounded-xl px-6 h-10 transition-all duration-300 ease-out active:scale-[0.98] shadow-none">Get Started</Button>
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
        <div className="md:hidden border-t border-ink-light/10 bg-white px-6 py-6 space-y-4 shadow-xl rounded-b-[2rem]">
          <Link 
            to="/directory" 
            className="block text-lg font-medium text-ink w-full py-2 hover:text-terracotta transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Directory
          </Link>
          <Link 
            to="/hire" 
            className="block text-lg font-medium text-ink w-full py-2 hover:text-terracotta transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Hire Talent
          </Link>
          <Link 
            to="/join" 
            className="block text-lg font-medium text-ink w-full py-2 hover:text-terracotta transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Apply as Artist
          </Link>
          <Link 
            to="/faq" 
            className="block text-lg font-medium text-ink w-full py-2 hover:text-terracotta transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
        </div>
      )}
    </header>
  );
}

