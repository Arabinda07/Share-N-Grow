import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Artist } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { mapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ArtistsDirectory() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');

  useEffect(() => {
    if (hasSupabaseConfig) {
      fetchArtists();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchArtists() {
    setLoading(true);
    let query = supabase
      .from('artists')
      .select('*')
      .eq('status', 'approved');

    if (cityFilter) {
      query = query.eq('city', cityFilter);
    }
    
    // Simplification for MVP: frontend filtering for services since it's a many-to-many
    // In production, you'd join artist_services via Supabase
    
    const { data } = await query;
    if (data) {
      setArtists(data as Artist[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchArtists();
  }, [cityFilter]);

  if (!hasSupabaseConfig) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold font-serif mb-4 text-ink">Directory Not Ready</h2>
        <p className="text-ink-light">Please configure the database to view artists.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold font-serif tracking-tight text-ink sm:text-4xl">Approved Artists</h1>
        <p className="mt-4 text-lg text-ink-light">
          Browse vetted local artists available for work in Bengal.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select 
          className="rounded-md border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
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
          className="rounded-md border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta"
          disabled
        >
          <option value="">Filter by Service (Coming Soon)</option>
        </select>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
        </div>
      ) : artists.length === 0 ? (
        <div className="py-20 text-center bg-paper-dark rounded-lg border border-ink-light/20">
          <p className="text-ink-light">No artists found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => setCityFilter('')}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {artists.map((artist) => (
            <Card key={artist.id} className="border-ink-light/20 bg-white overflow-hidden flex flex-col hover:shadow-md transition-shadow">
               {/* Cover Image Placeholder */}
               <div className="h-48 bg-paper-dark relative overflow-hidden">
                 {/* In a real app, you'd fetch cover art. For now, solid color. */}
                 {artist.profile_image_url ? (
                   <img src={artist.profile_image_url} alt={artist.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-ink-light/50 bg-paper-dark">
                     <User className="h-12 w-12 opacity-50" />
                   </div>
                 )}
               </div>
               
               <CardContent className="pt-6 flex flex-col flex-grow">
                 <h2 className="text-xl font-bold font-serif text-ink">{artist.name}</h2>
                 <p className="flex items-center text-sm text-ink-light mt-1">
                    <mapPin className="mr-1 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></mapPin>
                    {artist.city}{artist.area ? `, ${artist.area}` : ''}
                 </p>
                 
                 <div className="flex flex-wrap gap-1.5 mt-4">
                    {artist.mediums?.slice(0, 3).map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded-full bg-paper-dark text-ink-light text-xs font-medium">
                        {m}
                      </span>
                    ))}
                    {artist.mediums && artist.mediums.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-paper-dark text-ink-light text-xs font-medium">+{artist.mediums.length - 3}</span>
                    )}
                 </div>
                 
                 <p className="mt-4 text-sm text-ink-light line-clamp-2">
                   {artist.bio || "No bio provided."}
                 </p>
                 
                 <div className="mt-auto pt-6 flex gap-3">
                   <Link to={`/artist/${artist.slug || artist.id}`} className="flex-1">
                     <Button variant="outline" className="w-full">View Profile</Button>
                   </Link>
                   <Link to={`/hire?artist=${artist.id}`} className="flex-1">
                     <Button variant="brand" className="w-full">Request</Button>
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
