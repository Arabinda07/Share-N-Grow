import { Link } from 'react-router-dom';
import { HamburgerMenuIcon as Menu, SunIcon, MoonIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/use-theme';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-light/10 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/favicon.svg" alt="ShareNGrow Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-medium font-serif tracking-tighter text-ink">
                ShareNGrow
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-whisper rounded-xl shadow-lg py-2 flex flex-col z-50">
                  <Link to="/drawing-teachers" className="px-4 py-2 text-sm text-ink hover:bg-paper-dark hover:text-terracotta transition-colors" onClick={() => setIsServicesOpen(false)}>Drawing Teachers</Link>
                  <Link to="/wall-murals" className="px-4 py-2 text-sm text-ink hover:bg-paper-dark hover:text-terracotta transition-colors" onClick={() => setIsServicesOpen(false)}>Wall Murals</Link>
                  <Link to="/events-live-art" className="px-4 py-2 text-sm text-ink hover:bg-paper-dark hover:text-terracotta transition-colors" onClick={() => setIsServicesOpen(false)}>Live Event Art</Link>
                  <Link to="/collaborate" className="px-4 py-2 text-sm text-ink hover:bg-paper-dark hover:text-terracotta transition-colors" onClick={() => setIsServicesOpen(false)}>Collaborate</Link>
                </div>
              )}
            </div>

            <Link to="/directory" className="text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300">
              Directory
            </Link>
            <Link to="/showcase" className="text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300">
              Showcase
            </Link>
            <Link to="/faq" className="text-sm font-medium text-ink hover:text-terracotta transition-colors duration-300">
              FAQ
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-whisper bg-paper hover:bg-paper-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5 text-ink" /> : <MoonIcon className="w-5 h-5 text-ink" />}
            </button>
            <Link to="/join" className="text-sm font-medium text-ink hover:underline decoration-1 underline-offset-4 transition-colors duration-300">
              Apply as Artist
            </Link>
            <Link to="/hire">
              <Button size="sm" className="bg-ink hover:bg-ink-light text-white rounded-xl px-6 h-10 transition-all duration-300 ease-out active:scale-[0.98] shadow-none">Hire an Artist</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-whisper bg-paper hover:bg-paper-dark transition-colors text-ink"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button 
              className="p-2 text-ink-light"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6 text-ink" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-ink-light/10 bg-white px-6 py-6 pb-8 space-y-4 shadow-xl rounded-b-[2rem] max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <div className="text-sm font-bold text-ink-light uppercase tracking-wider mb-2">Services</div>
            <Link to="/drawing-teachers" className="block text-lg font-medium text-ink pl-4 py-2 border-l-2 border-whisper hover:border-terracotta transition-colors duration-300" onClick={() => setIsOpen(false)}>Drawing Teachers</Link>
            <Link to="/wall-murals" className="block text-lg font-medium text-ink pl-4 py-2 border-l-2 border-whisper hover:border-terracotta transition-colors duration-300" onClick={() => setIsOpen(false)}>Wall Murals</Link>
            <Link to="/events-live-art" className="block text-lg font-medium text-ink pl-4 py-2 border-l-2 border-whisper hover:border-terracotta transition-colors duration-300" onClick={() => setIsOpen(false)}>Live Event Art</Link>
            <Link to="/collaborate" className="block text-lg font-medium text-ink pl-4 py-2 border-l-2 border-whisper hover:border-terracotta transition-colors duration-300" onClick={() => setIsOpen(false)}>Collaborate</Link>
          </div>
          
          <div className="h-px w-full bg-whisper my-4"></div>

          <Link 
            to="/directory" 
            className="block text-lg font-medium text-ink w-full py-2 hover:text-terracotta transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Directory
          </Link>
          <Link 
            to="/showcase" 
            className="block text-lg font-medium text-ink w-full py-2 hover:text-terracotta transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Showcase
          </Link>
          <Link 
            to="/faq" 
            className="block text-lg font-medium text-ink w-full py-2 hover:text-terracotta transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          
          <div className="flex flex-col gap-3 pt-6">
            <Link to="/join" className="w-full" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full h-12 rounded-xl border-ink text-ink bg-transparent text-base">
                Apply as Artist
              </Button>
            </Link>
            <Link to="/hire" className="w-full" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-12 rounded-xl bg-ink hover:bg-ink-light text-white shadow-none text-base">
                Hire an Artist
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

