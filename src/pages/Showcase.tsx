import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { hasSupabaseConfig } from '../lib/supabase';
import { Artist, Artwork } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { PersonIcon as User, ExclamationTriangleIcon as AlertCircle } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { MapPin, Star } from '@phosphor-icons/react';

export function Showcase() {
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [featuredArtworks, setFeaturedArtworks] = useState<(Artwork & { artist?: Artist })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasSupabaseConfig) {
      fetchShowcaseData();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchShowcaseData() {
    setLoading(true);
    setError(null);
    try {
      // Fetch Artists
      const { data: artistsData, error: artistsError } = await api.fetchArtists({
        status: 'approved',
        is_featured: true,
        limit: 6
      });

      if (artistsError) throw artistsError;
      
      if (artistsData) {
        setFeaturedArtists(artistsData as Artist[]);
      }

      // Fetch Artworks (Assuming artworks table and joining with artist)
      // Note: In Supabase, if a foreign key exists, we can do: select('*, artist:artists(*)')
      // Since it might not exist yet, we'll fetch artworks, then fetch their artists manually if needed,
      // or try the join syntax. Let's try join syntax and gracefully fallback.
      const { data: artworksData, error: artworksError } = await api.fetchFeaturedArtworks(10);
        
      if (artworksError) {
        // If table doesn't exist, just catch and ignore or throw depending on strictness
        console.warn('Could not fetch artworks. Table might be missing.', artworksError);
      } else if (artworksData) {
        setFeaturedArtworks(artworksData as (Artwork & { artist?: Artist })[]);
      }
      
    } catch (err: any) {
      console.error('Error fetching showcase:', err);
      // Don't fail the whole page just because artists fetched but artworks didn't
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper pb-20">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-bold font-serif tracking-tighter text-ink leading-[1.05] mb-6">
          Weekly Showcase
        </h1>
        <p className="text-xl md:text-2xl text-ink-light max-w-2xl leading-relaxed">
          Discover the most inspiring creations and top-rated artists on ShareNGrow this week.
        </p>
      </section>

      {/* Featured Artworks */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-24">
        <div className="flex items-center gap-3 mb-10 border-b border-whisper pb-4">
          <Star weight="fill" className="text-terracotta w-6 h-6" />
          <h2 className="text-2xl font-bold font-serif tracking-tight text-ink">Trending Artworks</h2>
        </div>
        
        {featuredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArtworks.map((art) => (
              <div key={art.id} className="group relative rounded-2xl overflow-hidden bg-white border border-whisper flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-dark">
                <img 
                  src={art.image_url} 
                  alt={art.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif tracking-tight text-ink mb-2">{art.title}</h3>
                <p className="text-ink-light line-clamp-2 mb-4">{art.description}</p>
                {art.artist && (
                  <div className="flex items-center justify-between pt-4 border-t border-whisper">
                    <span className="text-sm font-medium text-ink">By {art.artist.name}</span>
                    <Link to={`/artist/${art.artist.slug || art.artist.id}`} className="text-sm font-semibold text-terracotta hover:text-terracotta-dark transition-colors">
                      View Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-[2rem] border border-whisper">
            <p className="text-ink-light mb-4 text-lg">New trending artworks will appear here shortly.</p>
          </div>
        )}
      </section>

      {/* Top Artists (If configured and found) */}
      {hasSupabaseConfig && (
        <section className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10 border-b border-whisper pb-4">
             <Star weight="fill" className="text-terracotta w-6 h-6" />
             <h2 className="text-2xl font-bold font-serif tracking-tight text-ink">Top Artists of the Week</h2>
          </div>
          
          {loading ? (
             <div className="py-12 flex justify-center">
                <div className="flex space-x-2 animate-pulse">
                  <div className="w-3 h-3 bg-terracotta rounded-full"></div>
                  <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-200"></div>
                  <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-400"></div>
                </div>
            </div>
          ) : featuredArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtists.map((artist) => (
                <Link key={artist.id} to={`/artist/${artist.slug || artist.id}`} className="block group">
                  <Card className="border border-whisper bg-white rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-secondary-dark group-hover:shadow-xl group-hover:shadow-secondary-dark/20 shadow-none h-full flex flex-row items-center p-4 gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-paper-dark shrink-0">
                      {artist.profile_image_url ? (
                         <img src={artist.profile_image_url} alt={artist.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-ink-light/20 bg-paper">
                           <User className="h-8 w-8 opacity-40" />
                         </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold font-serif tracking-tight text-ink group-hover:text-terracotta transition-colors">{artist.name}</h3>
                      <p className="flex items-center text-sm text-ink-light mt-1 font-medium">
                         <MapPin className="mr-1.5 h-4 w-4 text-terracotta shrink-0" />
                         <span className="truncate">{artist.city}</span>
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-[2rem] border border-whisper">
              <p className="text-ink-light mb-4 text-lg">New featured artists will appear here shortly.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
