import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-terracotta text-white font-bold font-serif">
                S
              </div>
              <span className="text-xl font-semibold font-serif tracking-tight text-ink">
                ShareNGrow
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/directory" className="text-sm font-medium text-ink-light hover:text-terracotta transition-colors">
              Artists
            </Link>
            <Link to="/hire" className="text-sm font-medium text-ink-light hover:text-terracotta transition-colors">
              Hire an Artist
            </Link>
            <Link to="/join" className="text-sm font-medium text-ink-light hover:text-terracotta transition-colors">
              Apply as Artist
            </Link>
            <Link to="/hire">
              <Button variant="brand" size="sm">Get Started</Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-stone-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-paper-dark px-4 py-4 space-y-3 shadow-lg">
          <Link 
            to="/directory" 
            className="block text-base font-medium text-ink w-full p-2 hover:text-terracotta"
            onClick={() => setIsOpen(false)}
          >
            Artists
          </Link>
          <Link 
            to="/hire" 
            className="block text-base font-medium text-ink w-full p-2 hover:text-terracotta"
            onClick={() => setIsOpen(false)}
          >
            Hire an Artist
          </Link>
          <Link 
            to="/join" 
            className="block text-base font-medium text-ink w-full p-2 hover:text-terracotta"
            onClick={() => setIsOpen(false)}
          >
            Apply as Artist
          </Link>
          <Link to="/hire" onClick={() => setIsOpen(false)} className="block pt-2">
            <Button variant="brand" className="w-full">Get Started</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
