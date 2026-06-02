import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Artist } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { mapPin, User, CheckCircle2, Instagram, Facebook } from 'lucide-react';

export function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtist() {
      if (!hasSupabaseConfig || !id) {
        setLoading(false);
        return;
      }

      // First try to fetch by slug, if failed or if id is clearly a UUID, fallback
      let query = supabase.from('artists').select('*').eq('status', 'approved');
      
      // Basic UUID check
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (isUUID) {
         query = query.eq('id', id);
      } else {
         query = query.eq('slug', id);
      }
      
      const { data, error } = await query.single();
      
      if (data) {
        setArtist(data as Artist);
      }
      setLoading(false);
    }

    fetchArtist();
  }, [id]);


  if (loading) {
    return (
      <div className="py-32 flex justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto py-32 px-4 text-center">
        <h2 className="text-2xl font-bold font-serif mb-4 text-ink">Artist Not Found</h2>
        <p className="text-ink-light mb-8">The artist you are looking for does not exist or has not been approved yet.</p>
        <Link to="/directory">
          <Button variant="outline">Browse Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-5xl">
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        {/* Main Content */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
             <div className="h-32 w-32 shrink-0 rounded-full bg-paper-dark overflow-hidden shadow-sm">
                {artist.profile_image_url ? (
                   <img src={artist.profile_image_url} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                   <div className="h-full w-full flex items-center justify-center bg-paper-dark text-ink-light/50">
                     <User className="h-16 w-16 opacity-50" />
                   </div>
                )}
             </div>
             <div>
               <h1 className="text-4xl font-bold font-serif tracking-tight text-ink">{artist.name}</h1>
               <p className="flex items-center text-ink-light mt-2 text-lg">
                  <mapPin className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></mapPin>
                  {artist.city}{artist.area ? `, ${artist.area}` : ''}
               </p>
               <div className="flex items-center gap-4 mt-4">
                  {artist.instagram_url && (
                    <a href={artist.instagram_url} target="_blank" rel="noreferrer" className="text-ink-light/50 hover:text-terracotta">
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
               </div>
             </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <h3 className="text-xl font-semibold mb-2 text-ink border-b border-ink-light/20 pb-2">About</h3>
            <p className="text-ink-light whitespace-pre-wrap">{artist.bio || "No biography provided."}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-ink border-b border-ink-light/20 pb-2">Mediums</h3>
            <div className="flex flex-wrap gap-2">
              {artist.mediums?.length > 0 ? (
                 artist.mediums.map(m => (
                    <span key={m} className="px-3 py-1 rounded-full bg-paper-dark text-ink-light text-sm font-medium border border-ink-light/20">
                      {m}
                    </span>
                 ))
              ) : (
                 <span className="text-ink-light/50">Not specified.</span>
              )}
            </div>
          </div>
          
           <div>
            <h3 className="text-xl font-semibold mb-4 text-ink border-b border-ink-light/20 pb-2">Languages</h3>
             <div className="flex flex-wrap gap-2">
              {artist.languages?.length > 0 ? (
                 artist.languages.map(l => (
                    <span key={l} className="px-3 py-1 rounded-md bg-paper text-ink-light text-sm border border-ink-light/20">
                      {l}
                    </span>
                 ))
              ) : (
                 <span className="text-ink-light/50">Not specified.</span>
              )}
            </div>
          </div>

          <div>
             <h3 className="text-xl font-semibold mb-4 text-ink border-b border-ink-light/20 pb-2">Portfolio Samples</h3>
             <div className="bg-paper p-8 rounded-lg border border-ink-light/20 text-center text-ink-light/50">
               Portfolio images will be displayed here once uploaded and approved.
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-ink-light/20 bg-white shadow-sm sticky top-24">
            <CardContent className="p-6">
               <h3 className="font-semibold text-lg mb-4 text-ink">Availability</h3>
               <ul className="space-y-3 mb-6">
                 <li className="flex items-start">
                   {artist.available_for_commissions ? 
                     <CheckCircle2 className="h-5 w-5 text-pine mr-2 shrink-0 mt-0.5" /> :
                     <div className="h-5 w-5 rounded-full border-2 border-ink-light/30 mr-2 shrink-0 mt-0.5" />
                   }
                   <span className={artist.available_for_commissions ? "text-ink" : "text-ink-light"}>Available for custom commissions or projects</span>
                 </li>
                 <li className="flex items-start">
                   {artist.available_for_teaching ? 
                     <CheckCircle2 className="h-5 w-5 text-pine mr-2 shrink-0 mt-0.5" /> :
                     <div className="h-5 w-5 rounded-full border-2 border-ink-light/30 mr-2 shrink-0 mt-0.5" />
                   }
                   <span className={artist.available_for_teaching ? "text-ink" : "text-ink-light"}>Available for teaching and workshops</span>
                 </li>
                 <li className="flex items-start">
                   {artist.available_for_travel ? 
                     <CheckCircle2 className="h-5 w-5 text-pine mr-2 shrink-0 mt-0.5" /> :
                     <div className="h-5 w-5 rounded-full border-2 border-ink-light/30 mr-2 shrink-0 mt-0.5" />
                   }
                   <span className={artist.available_for_travel ? "text-ink" : "text-ink-light"}>Available to travel within Bengal for work</span>
                 </li>
               </ul>
               
               <div className="space-y-3 pt-6 border-t border-ink-light/20">
                  <Link to={`/hire?artist=${artist.id}`} className="block w-full">
                    <Button variant="brand" className="w-full">Request Introduction</Button>
                  </Link>
                  <p className="text-xs text-ink-light/50 text-center leading-relaxed">
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
