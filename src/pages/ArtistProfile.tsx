import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { hasSupabaseConfig } from '../lib/supabase';
import { Artist } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PersonIcon as User, CheckCircledIcon as CheckCircle2, ExclamationTriangleIcon as AlertCircle } from '@radix-ui/react-icons';
import { MapPin, Palette } from '@phosphor-icons/react';

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtist() {
      if (!hasSupabaseConfig || !id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await api.fetchArtistBySlugOrId(id);
        
        if (fetchError) {
          // If no rows found, we just set artist to null and let the empty state handle it
          if (fetchError.code !== 'PGRST116') {
             throw fetchError;
          }
        } else if (data) {
          setArtist(data as Artist);
        }
      } catch (err: any) {
        console.error('Error fetching artist:', err);
        setError(err.message || 'Failed to load artist profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchArtist();
  }, [id]);


  if (loading) {
    return (
      <div className="py-32 flex justify-center">
         <div className="flex space-x-2 animate-pulse">
           <div className="w-3 h-3 bg-terracotta rounded-full"></div>
           <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-200"></div>
           <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-400"></div>
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-32 px-4 text-center">
        <div className="py-12 px-6 bg-red-50 rounded-[2rem] border border-red-100 flex flex-col items-center max-w-2xl mx-auto">
          <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
          <h2 className="text-xl font-bold font-serif tracking-tight mb-2 text-red-900">Something went wrong</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="bg-white border-red-200 text-red-700 hover:bg-red-50 rounded-full px-6">Reload Page</Button>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto py-32 px-4 text-center">
        <h2 className="text-2xl font-bold font-serif tracking-tight mb-4 text-ink">Artist Not Found</h2>
        <p className="text-ink-light mb-8">The artist you are looking for does not exist or has not been approved yet.</p>
        <Link to="/directory">
          <Button variant="outline" className="rounded-full px-6 shadow-none">Browse Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-5xl min-h-screen">
      <div className="grid gap-12 md:grid-cols-[1fr_340px]">
        {/* Main Content */}
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              <div className="h-40 w-40 shrink-0 rounded-3xl bg-paper overflow-hidden shadow-none border border-whisper">
                {artist.profile_image_url ? (
                   <img src={artist.profile_image_url} alt={artist.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                   <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-paper to-whisper text-ink-light/20">
                     <User className="h-16 w-16 opacity-30" />
                   </div>
                )}
             </div>
             <div>
               <h1 className="text-4xl font-bold font-serif tracking-tight text-ink sm:text-5xl">{artist.name}</h1>
               <p className="flex items-center font-medium text-ink-light mt-3 text-lg">
                  <MapPin className="mr-2 h-5 w-5 text-terracotta" />
                  {artist.city}{artist.area ? `, ${artist.area}` : ''}
               </p>
               <div className="flex items-center gap-4 mt-6">
                  {artist.instagram_url && (
                    <a href={artist.instagram_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-paper hover:bg-paper-dark text-ink-light hover:text-terracotta transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
               </div>
             </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <h3 className="text-2xl font-semibold mb-4 text-ink font-serif tracking-tight">Biography</h3>
            <p className="text-lg text-ink-light whitespace-pre-wrap leading-relaxed">{artist.bio || "No biography provided."}</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-ink font-serif">Mediums</h3>
              <div className="flex flex-wrap gap-2">
                {artist.mediums?.length > 0 ? (
                   artist.mediums.map(m => (
                      <span key={m} className="px-4 py-1.5 rounded-full bg-paper uppercase tracking-wider text-ink text-[11px] font-bold">
                        {m}
                      </span>
                   ))
                ) : (
                   <span className="text-ink-light/50">Not specified.</span>
                )}
              </div>
            </div>
            
             <div>
              <h3 className="text-lg font-semibold mb-4 text-ink font-serif">Languages</h3>
               <div className="flex flex-wrap gap-2">
                {artist.languages?.length > 0 ? (
                   artist.languages.map(l => (
                      <span key={l} className="px-4 py-1.5 rounded-full bg-paper text-ink-light text-sm font-medium">
                        {l}
                      </span>
                   ))
                ) : (
                   <span className="text-ink-light/50">Not specified.</span>
                )}
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-2xl font-semibold mb-6 text-ink font-serif tracking-tight">Portfolio Samples</h3>
             <div className="bg-paper p-12 rounded-2xl border border-whisper text-center text-ink-light flex flex-col items-center justify-center min-h-[300px]">
               <div className="h-16 w-16 mb-4 rounded-xl bg-white border border-whisper flex items-center justify-center shadow-sm">
                 <Palette className="h-8 w-8 opacity-20" />
               </div>
               <p className="text-lg">Portfolio images will be displayed here once uploaded and approved.</p>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border border-whisper bg-white rounded-2xl shadow-none sticky top-24">
            <CardContent className="p-8">
               <h3 className="font-semibold text-xl mb-6 text-ink tracking-tight font-serif">Availability</h3>
               <ul className="space-y-5 mb-8">
                 <li className="flex items-start">
                   {artist.available_for_commissions ? 
                     <CheckCircle2 className="h-5 w-5 text-terracotta mr-3 shrink-0 mt-0.5" /> :
                     <div className="h-5 w-5 rounded-full border-2 border-whisper mr-3 shrink-0 mt-0.5" />
                   }
                   <span className={artist.available_for_commissions ? "text-ink font-medium leading-tight" : "text-ink-light leading-tight"}>Available for custom commissions or projects</span>
                 </li>
                 <li className="flex items-start">
                   {artist.available_for_teaching ? 
                     <CheckCircle2 className="h-5 w-5 text-terracotta mr-3 shrink-0 mt-0.5" /> :
                     <div className="h-5 w-5 rounded-full border-2 border-whisper mr-3 shrink-0 mt-0.5" />
                   }
                   <span className={artist.available_for_teaching ? "text-ink font-medium leading-tight" : "text-ink-light leading-tight"}>Available for teaching and workshops</span>
                 </li>
                 <li className="flex items-start">
                   {artist.available_for_travel ? 
                     <CheckCircle2 className="h-5 w-5 text-terracotta mr-3 shrink-0 mt-0.5" /> :
                     <div className="h-5 w-5 rounded-full border-2 border-whisper mr-3 shrink-0 mt-0.5" />
                   }
                   <span className={artist.available_for_travel ? "text-ink font-medium leading-tight" : "text-ink-light leading-tight"}>Available to travel for work</span>
                 </li>
               </ul>
               
               <div className="space-y-4 pt-6 border-t border-whisper">
                  <Link to={`/hire?artist=${artist.id}`} className="block w-full">
                    <Button size="lg" className="w-full h-16 text-lg bg-ink hover:bg-ink-light text-white rounded-2xl shadow-none transition-transform active:scale-[0.98]">Request Introduction</Button>
                  </Link>
                  <p className="text-sm text-ink-light text-center leading-relaxed">
                    ShareNGrow personally reviews requests and connects you with the artist via WhatsApp. Contact details remain private.
                  </p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
