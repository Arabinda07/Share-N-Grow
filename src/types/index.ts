export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  area: string | null;
  service_needed: string;
  budget_range: string | null;
  deadline: string | null;
  description: string;
  reference_url: string | null;
  status: 'new' | 'reviewed' | 'matched' | 'closed';
  selected_artist_id: string | null;
  created_at: string;
};

export type JoinRequest = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  area: string | null;
  mediums: string[];
  service_interest: string[];
  portfolio_links: string | null;
  social_links: string | null;
  short_bio: string | null;
  available_for_paid_work: boolean;
  available_for_home_teaching: boolean;
  available_for_travel: boolean;
  consent_profile_public: boolean;
  consent_artwork_public: boolean;
  message: string | null;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
};

export type Artist = {
  id: string;
  name: string;
  slug: string;
  city: string;
  area: string | null;
  bio: string | null;
  profile_image_url: string | null;
  languages: string[];
  mediums: string[];
  instagram_url: string | null;
  portfolio_links?: string | null;
  available_for_commissions: boolean;
  available_for_teaching: boolean;
  available_for_travel: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  is_featured?: boolean;
};

export type Artwork = {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
  is_featured: boolean;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
};

export const SERVICES = [
  {
    id: 'drawing-teacher',
    title: 'Drawing Teachers for Children',
    description: 'Find trusted local artists to teach drawing to your children at home or online.',
    icon: 'palette'
  },
  {
    id: 'wall-mural',
    title: 'Wall Murals',
    description: 'Custom murals for cafés, offices, schools, homes, and local businesses.',
    icon: 'brush'
  },
  {
    id: 'live-event-art',
    title: 'Live Event Art & Sketching',
    description: 'Hire artists for live wedding sketching and event art.',
    icon: 'users'
  }
];
