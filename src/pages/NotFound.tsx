import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Helmet } from 'react-helmet-async';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <Helmet>
        <title>Page Not Found | ShareNGrow</title>
      </Helmet>
      
      <div className="h-24 w-24 mb-8 text-ink/20 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-24-84a12,12,0,1,1,12-12A12,12,0,0,1,104,132Zm48,0a12,12,0,1,1,12-12A12,12,0,0,1,152,132Zm22.75,34.42a8,8,0,0,1-10.33,4.83,40.11,40.11,0,0,0-72.84,0,8,8,0,0,1-15.16-6.5,56.12,56.12,0,0,1,101.5-1.5,8,8,0,0,1,3.17-10.33A8.09,8.09,0,0,1,174.75,166.42Z" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-6 tracking-tight">
        Lost in the gallery.
      </h1>
      
      <p className="text-xl text-ink-light max-w-[40ch] mb-10">
        We couldn't find the page you were looking for. The link may be broken, or the page may have been removed.
      </p>
      
      <Link to="/">
        <Button size="lg" className="h-14 px-8 text-lg rounded-xl">
          Return to directory
        </Button>
      </Link>
    </div>
  );
}
