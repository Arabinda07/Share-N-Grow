import { supabase, hasSupabaseConfig } from './supabase';
import { Artist, Artwork } from '../types';

export const api = {
  // Join Requests
  async submitJoinRequest(data: any) {
    if (!hasSupabaseConfig) return { error: { message: 'Database not configured' } };
    return await supabase.from('join_requests').insert([data]);
  },

  // Inquiries
  async uploadPortfolio(fileName: string, file: File) {
    if (!hasSupabaseConfig) return { data: null, error: { message: 'Database not configured' } };
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('application-uploads')
        .upload(fileName, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data: publicUrlData } = supabase.storage
        .from('application-uploads')
        .getPublicUrl(fileName);

    return { data: { publicUrl: publicUrlData.publicUrl }, error: null };
  },

  async submitInquiry(data: any) {
    if (!hasSupabaseConfig) return { error: { message: 'Database not configured' } };
    return await supabase.from('inquiries').insert([data]);
  },

  // Collaboration Requests
  async submitCollaborationRequest(data: any) {
    if (!hasSupabaseConfig) return { error: { message: 'Database not configured' } };
    return await supabase.from('collaboration_requests').insert([data]);
  },

  // Artists
  async fetchArtists(filters?: { status?: string; is_featured?: boolean; limit?: number; city?: string; service?: string }) {
    if (!hasSupabaseConfig) return { data: [], error: null };
    
    let query = supabase.from('artists').select('*');
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.service === 'drawing-teacher') {
      query = query.eq('available_for_teaching', true);
    } else if (filters?.service === 'wall-mural' || filters?.service === 'live-event-art') {
      query = query.eq('available_for_commissions', true);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  },

  async fetchArtistBySlugOrId(identifier: string) {
    if (!hasSupabaseConfig) return { data: null, error: null };
    
    let query = supabase.from('artists').select('*').eq('status', 'approved');

    // Simple check: if it looks like a UUID we try matching ID, else try slug
    // For safety, we can query both with an OR, but Supabase standard PostgREST OR syntax is a bit trickier
    // Let's rely on standard eq for now and do two queries if needed, or if the identifier is uuid.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    if (isUuid) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('slug', identifier);
    }

    return await query.single();
  },

  // Artworks
  async fetchFeaturedArtworks(limit: number = 10) {
    if (!hasSupabaseConfig) return { data: [], error: null };
    
    return await supabase
      .from('artworks')
      .select('*, artist:artists(*)')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  // Admin Actions
  async verifyAdminAccess(userId: string) {
    if (!hasSupabaseConfig) return { data: null, error: { message: 'Database not configured' } };
    return await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
  },

  async fetchAdminInquiries() {
    if (!hasSupabaseConfig) return { data: [], error: null };
    return await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  },

  async fetchAdminJoinRequests() {
    if (!hasSupabaseConfig) return { data: [], error: null };
    return await supabase.from('join_requests').select('*').order('created_at', { ascending: false });
  },

  async updateJoinRequestStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    if (!hasSupabaseConfig) return { error: { message: 'Database not configured' } };
    return await supabase.from('join_requests').update({ status }).eq('id', id);
  },

  async updateInquiryStatus(id: string, status: 'new' | 'reviewed' | 'matched' | 'closed') {
    if (!hasSupabaseConfig) return { error: { message: 'Database not configured' } };
    return await supabase.from('inquiries').update({ status }).eq('id', id);
  }
};
