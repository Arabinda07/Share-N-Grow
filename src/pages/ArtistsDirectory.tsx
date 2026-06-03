import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Artist } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPinIcon as MapPin, UserIcon as User, ExclamationCircleIcon as AlertCircle } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function ArtistsDirectory() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');

  useEffect(() => {
    if (hasSupabaseConfig) {
      fetchArtists();
    } else {
      setLoading(false);
    }
  }, [cityFilter]);

  async function fetchArtists() {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('artists')
        .select('*')
        .eq('status', 'approved');

      if (cityFilter) {
        query = query.eq('city', cityFilter);
      }
      
      // Simplification for MVP: frontend filtering for services since it's a many-to-many
      // In production, you'd join artist_services via Supabase
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      if (data) {
        setArtists(data as Artist[]);
      }
    } catch (err: any) {
      console.error('Error fetching artists:', err);
      setError(err.message || 'Failed to load artists. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (!hasSupabaseConfig) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold font-sans tracking-tight mb-4 text-ink">Directory Not Ready</h2>
        <p className="text-ink-light">Please configure the database to view artists.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-[1400px] min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-sans tracking-tight text-ink sm:text-5xl">Approved Artists</h1>
        <p className="mt-4 text-lg text-ink-light max-w-2xl">
          Browse vetted local artists available for work in Bengal.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <select 
          className="rounded-xl border border-ink-light/20 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta shadow-sm"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Durgapur">Durgapur</option>
          <option value="Asansol">Asansol</option>
          <option value="Siliguri">Siliguri</option>
          <option value="Howrah">Howrah</option>
        </select>
        
        {/* Placeholder for service filter - would require joins in real query */}
        <select 
          className="rounded-xl border border-ink-light/20 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta shadow-sm opacity-60 cursor-not-allowed"
          disabled
        >
          <option value="">Filter by Service (Coming Soon)</option>
        </select>
      </div>

      {loading ? (
        <div className="py-32 flex justify-center">
            <div className="flex space-x-2 animate-pulse">
              <div className="w-3 h-3 bg-terracotta rounded-full"></div>
              <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-200"></div>
              <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-400"></div>
            </div>
        </div>
      ) : error ? (
        <div className="py-12 px-6 text-center bg-red-50 rounded-[2rem] border border-red-100 flex flex-col items-center max-w-2xl mx-auto">
          <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <Button onClick={fetchArtists} variant="outline" className="bg-white border-red-200 text-red-700 hover:bg-red-50 rounded-full px-6">Try Again</Button>
        </div>
      ) : artists.length === 0 ? (
        <div className="py-20 text-center bg-paper-dark rounded-[2rem] border border-ink-light/10">
          <p className="text-ink-light mb-4">No artists found matching your criteria.</p>
          <Button variant="outline" className="bg-white rounded-full border-ink-light/20" onClick={() => setCityFilter('')}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 md:gap-8">
          {artists.map((artist) => (
            <Card key={artist.id} className="border border-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden flex flex-col transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1">
               {/* Cover Image Placeholder */}
               <div className="h-56 bg-paper-dark relative overflow-hidden">
                 {/* In a real app, you'd fetch cover art. For now, solid color. */}
                 {artist.profile_image_url ? (
                   <img src={artist.profile_image_url} alt={artist.name} loading="lazy" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-ink-light/20 bg-gradient-to-br from-paper-dark to-ink-light/5">
                     <User className="h-16 w-16 opacity-30" />
                   </div>
                 )}
               </div>
               
               <CardContent className="p-8 flex flex-col flex-grow bg-white">
                 <h2 className="text-2xl font-bold font-sans tracking-tight text-ink line-clamp-1">{artist.name}</h2>
                 <p className="flex items-center text-sm text-ink-light mt-2 font-medium">
                    <MapPin className="mr-1.5 h-4 w-4 text-terracotta shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></MapPin>
                    <span className="truncate">{artist.city}{artist.area ? `, ${artist.area}` : ''}</span>
                 </p>
                 
                 <div className="flex flex-wrap gap-2 mt-6">
                    {artist.mediums?.slice(0, 3).map((m) => (
                      <span key={m} className="px-3 py-1 rounded-full bg-terracotta/10 text-terracotta uppercase tracking-wider text-[10px] font-bold truncate max-w-full">
                        {m}
                      </span>
                    ))}
                    {artist.mediums && artist.mediums.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-paper uppercase tracking-wider text-ink text-[10px] font-bold">+{artist.mediums.length - 3}</span>
                    )}
                 </div>
                 
                 <p className="mt-6 text-base text-ink-light line-clamp-3 leading-relaxed">
                   {artist.bio || "No bio provided."}
                 </p>
                 
                 <div className="mt-8 pt-6 flex gap-3 border-t border-ink-light/10">
                   <Link to={`/artist/${artist.slug || artist.id}`} className="flex-1">
                     <Button variant="outline" className="w-full h-12 rounded-xl bg-transparent border-ink-light/20 hover:bg-paper-dark shadow-none">View Profile</Button>
                   </Link>
                   <Link to={`/hire?artist=${artist.id}`} className="flex-1">
                     <Button className="w-full h-12 rounded-xl bg-ink hover:bg-ink-light text-white shadow-none transition-transform active:scale-[0.98]">Request</Button>
                   </Link>
                 </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
