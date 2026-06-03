import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { hasSupabaseConfig } from '../lib/supabase';
import { Artist, SERVICES } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin } from '@phosphor-icons/react';
import { PersonIcon as User, ExclamationTriangleIcon as AlertCircle, ChevronDownIcon } from '@radix-ui/react-icons';
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
  }, [cityFilter, serviceFilter]);

  async function fetchArtists() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await api.fetchArtists({
        status: 'approved',
        city: cityFilter,
        service: serviceFilter
      });
      
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
        <h2 className="text-2xl font-bold font-serif tracking-tight mb-4 text-ink">Directory Not Ready</h2>
        <p className="text-ink-light">Please configure the database to view artists.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 lg:py-32 xl:px-8 max-w-[1400px] min-h-[90vh]">
      <div className="mb-14 md:mb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-serif tracking-tighter text-ink leading-[1.05]">Approved Artists</h1>
        <p className="mt-6 md:mt-8 text-xl md:text-2xl text-ink-light leading-snug">
          Browse vetted local artists available for work.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <div className="relative w-full sm:w-64">
          <select 
            className="w-full rounded-2xl border-2 border-whisper bg-white dark:bg-paper-dark px-6 py-4 text-base font-medium text-ink focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer pr-12"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="" className="text-ink bg-white dark:bg-paper-dark">All Cities</option>
            <option value="Kolkata" className="text-ink bg-white dark:bg-paper-dark">Kolkata</option>
            <option value="Durgapur" className="text-ink bg-white dark:bg-paper-dark">Durgapur</option>
            <option value="Asansol" className="text-ink bg-white dark:bg-paper-dark">Asansol</option>
            <option value="Siliguri" className="text-ink bg-white dark:bg-paper-dark">Siliguri</option>
            <option value="Howrah" className="text-ink bg-white dark:bg-paper-dark">Howrah</option>
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-ink" />
          </div>
        </div>
        
        <div className="relative w-full sm:w-64">
          <select 
            className="w-full rounded-2xl border-2 border-whisper bg-white dark:bg-paper-dark px-6 py-4 text-base font-medium text-ink focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer pr-12"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="" className="text-ink bg-white dark:bg-paper-dark">All Services</option>
            {SERVICES.map((service) => (
              <option key={service.id} value={service.id} className="text-ink bg-white dark:bg-paper-dark">{service.title}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-ink" />
          </div>
        </div>
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
            <Card key={artist.id} className="border border-whisper bg-white rounded-2xl overflow-hidden flex flex-col transition-all hover:bg-paper-dark shadow-none">
               {/* Cover Image Placeholder */}
               <div className="h-48 md:h-56 bg-paper relative overflow-hidden border-b border-whisper">
                 {/* In a real app, you'd fetch cover art. For now, solid color. */}
                 {artist.profile_image_url ? (
                   <img src={artist.profile_image_url} alt={artist.name} loading="lazy" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-ink-light/20 bg-paper-dark">
                     <User className="h-12 w-12 opacity-30" />
                   </div>
                 )}
               </div>
               
               <CardContent className="p-6 md:p-8 flex flex-col flex-grow bg-transparent">
                 <h2 className="text-xl md:text-2xl font-bold font-serif tracking-tight text-ink line-clamp-1">{artist.name}</h2>
                 <p className="flex items-center text-sm md:text-base text-ink-light mt-2 font-medium">
                    <MapPin className="mr-1.5 h-4 w-4 text-terracotta shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></MapPin>
                    <span className="truncate">{artist.city}{artist.area ? `, ${artist.area}` : ''}</span>
                 </p>
                 
                 <div className="flex flex-wrap gap-2 mt-5 md:mt-6">
                    {artist.mediums?.slice(0, 3).map((m) => (
                      <span key={m} className="px-3 py-1 rounded-full bg-paper border border-whisper text-ink font-medium tracking-wide text-xs truncate max-w-full">
                        {m}
                      </span>
                    ))}
                    {artist.mediums && artist.mediums.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-paper border border-whisper text-ink font-medium tracking-wide text-xs">+{artist.mediums.length - 3}</span>
                    )}
                 </div>
                 
                 <p className="mt-5 md:mt-6 text-base text-ink-light line-clamp-3 leading-relaxed flex-grow">
                   {artist.bio || "No bio provided."}
                 </p>
                 
                 <div className="mt-6 md:mt-8 pt-6 flex gap-3 border-t border-whisper">
                   <Link to={`/artist/${artist.slug || artist.id}`} className="flex-1">
                     <Button variant="outline" className="w-full h-12 rounded-xl bg-transparent border-whisper hover:bg-white text-ink shadow-none">View Profile</Button>
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
