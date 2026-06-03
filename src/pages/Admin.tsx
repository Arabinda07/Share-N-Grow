import React, { useState, useEffect } from 'react';
import { hasSupabaseConfig } from '../lib/supabase';
import { Inquiry, JoinRequest } from '../types';
import { api } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ExclamationTriangleIcon as AlertCircle, CalendarIcon as Calendar } from '@radix-ui/react-icons';
import { useAdminAuth } from '../hooks/useAdminAuth';

export function Admin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, isCheckingAuth, authError, signIn, signOut } = useAdminAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleLogOut = async () => {
    await signOut();
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    if (isAuthenticated && hasSupabaseConfig) {
      setLoading(true);
      Promise.all([
        api.fetchAdminInquiries(),
        api.fetchAdminJoinRequests()
      ]).then(([inquiriesRes, appsRes]) => {
        if (inquiriesRes.data) setInquiries(inquiriesRes.data);
        if (appsRes.data) setApplications(appsRes.data);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await api.updateJoinRequestStatus(id, status);
      if (error) {
        alert("Failed to update status: " + error.message);
        return;
      }
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    } catch (e) {
      console.error(e);
      alert("Error updating application");
    }
  };

  const updateInquiryStatus = async (id: string, status: 'reviewed' | 'matched' | 'closed') => {
    try {
      const { error } = await api.updateInquiryStatus(id, status);
      if (error) {
        alert("Failed to update status: " + error.message);
        return;
      }
      setInquiries(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    } catch (e) {
      console.error(e);
      alert("Error updating inquiry");
    }
  };

  if (!hasSupabaseConfig) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <div className="flex max-w-md items-start gap-3 rounded-md bg-red-50 p-4 text-red-900 border border-red-200">
           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
           <div>
             <p className="text-base font-semibold">Supabase is not configured.</p>
             <p className="mt-1 text-sm">Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your settings to view data.</p>
           </div>
         </div>
      </div>
    );
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-terracotta rounded-full"></div>
          <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-200"></div>
          <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
        <Card className="w-full overflow-hidden border-ink-light/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-2xl">
          <CardContent className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-center tracking-tight text-ink font-serif">Admin Login</h2>
            {authError && (
              <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                {authError}
              </div>
            )}
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Admin Email" 
                className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus-visible:border-ink/20 focus:ring-1 focus:ring-ink/20 transition-shadow"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus-visible:border-ink/20 focus:ring-1 focus:ring-ink/20 transition-shadow"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-ink text-sm font-medium text-white hover:bg-ink-light transition-all active:scale-[0.98] mt-2"
              >
                Sign In
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-serif tracking-tight text-ink sm:text-5xl">Admin Dashboard</h1>
        <button 
          onClick={handleLogOut}
          className="rounded-xl px-4 py-2 border border-ink-light/20 text-sm font-medium hover:bg-paper-dark transition-colors"
        >
          Sign Out
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
            <div className="flex space-x-2 animate-pulse">
              <div className="w-3 h-3 bg-terracotta rounded-full"></div>
              <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-200"></div>
              <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-400"></div>
            </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Inquiries */}
          <section>
            <h2 className="mb-6 text-xl flex items-center font-semibold text-ink border-b border-ink-light/10 pb-4 font-serif tracking-tight">
              Recent Client Inquiries
              <span className="ml-3 rounded-full bg-paper-dark px-3 py-1 text-xs font-bold text-terracotta border border-ink-light/10">
                {inquiries.length} requests
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inquiries.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 py-12 text-center rounded-3xl border border-dashed border-whisper bg-white/50">
                  <p className="text-ink-light font-medium">No client inquiries found.</p>
                </div>
              ) : inquiries.map((req) => (
                <Card key={req.id} className="border border-whisper bg-white shadow-none rounded-2xl">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg line-clamp-1 text-ink font-serif tracking-tight">{req.name}</h3>
                      <span className="rounded-full bg-paper-dark border border-whisper px-3 py-1 text-xs capitalize text-ink-light font-bold">
                        {req.status}
                      </span>
                    </div>
                    <div className="text-sm text-ink-light space-y-2 mb-6 flex-grow leading-relaxed">
                      <p><span className="font-medium text-ink">Phone:</span> {req.phone}</p>
                      <p><span className="font-medium text-ink">Service:</span> <span className="capitalize">{req.service_needed.replace(/-/g, ' ')}</span></p>
                      <p><span className="font-medium text-ink">Location:</span> {req.city}{req.area ? `, ${req.area}` : ''}</p>
                      <div className="mt-4 text-ink-light bg-paper-dark p-4 rounded-[1rem] border border-whisper whitespace-pre-wrap text-[13px] h-28 overflow-y-auto leading-relaxed">
                        {req.description}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-whisper">
                      <div className="flex items-center text-xs text-ink-light/70 font-medium">
                        <Calendar className="mr-2 h-3.5 w-3.5 text-terracotta" />
                        {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                      </div>
                      {req.status === 'new' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateInquiryStatus(req.id, 'reviewed')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-ink text-white rounded-md hover:bg-ink-light transition-all active:scale-95 shadow-sm">REVIEWED</button>
                        </div>
                      )}
                      {(req.status === 'reviewed' || req.status === 'matched') && (
                        <div className="flex gap-2">
                          {req.status === 'reviewed' && <button onClick={() => updateInquiryStatus(req.id, 'matched')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-ink border border-ink text-white rounded-md hover:bg-ink-light transition-all active:scale-95 shadow-sm">MATCHED</button>}
                          <button onClick={() => updateInquiryStatus(req.id, 'closed')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-paper-dark text-ink border border-whisper rounded-md hover:bg-paper transition-all active:scale-95">CLOSE</button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Applications */}
          <section>
            <h2 className="mb-6 text-xl flex items-center font-semibold text-ink border-b border-ink-light/10 pb-4 font-serif tracking-tight">
              Artist Join Requests
              <span className="ml-3 rounded-full bg-paper border border-ink-light/10 px-3 py-1 text-xs font-bold text-ink-light">
                {applications.length} applied
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 py-12 text-center rounded-3xl border border-dashed border-whisper bg-white/50">
                  <p className="text-ink-light font-medium">No artist applications found.</p>
                </div>
              ) : applications.map((app) => (
                <Card key={app.id} className="border border-whisper bg-white shadow-none rounded-2xl">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg line-clamp-1 text-ink font-serif tracking-tight">{app.name}</h3>
                      <span className="rounded-full bg-paper border border-whisper px-3 py-1 text-xs capitalize text-ink-light font-bold">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-sm text-ink-light space-y-2 mb-6 flex-grow leading-relaxed">
                      <p><span className="font-medium text-ink">Location:</span> {app.city}{app.area ? `, ${app.area}` : ''}</p>
                      <p><span className="font-medium text-ink">Contact:</span> {app.phone}</p>
                      <p className="line-clamp-2">
                        <span className="font-medium text-ink">Services: </span> 
                        {app.service_interest?.join(', ') || 'None specified'}
                      </p>
                      <p className="line-clamp-2">
                        <span className="font-medium text-ink">Mediums: </span> 
                        {app.mediums?.join(', ') || 'None specified'}
                      </p>
                      {app.portfolio_links && (
                        <p className="mt-3 pt-2 border-t border-whisper">
                          <a href={app.portfolio_links} target="_blank" rel="noreferrer" className="text-ink hover:text-ink-light font-medium underline underline-offset-2 decoration-ink/30 hover:decoration-ink transition-colors">
                            View Portfolio Links
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-whisper">
                      <div className="flex items-center text-xs text-ink-light/70 font-medium">
                        <Calendar className="mr-2 h-3.5 w-3.5 text-terracotta" />
                        {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                      </div>
                      {app.status === 'new' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateApplicationStatus(app.id, 'approved')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-ink text-white rounded-md hover:bg-ink-light transition-all active:scale-95 shadow-sm">APPROVE</button>
                          <button onClick={() => updateApplicationStatus(app.id, 'rejected')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all active:scale-95 border border-red-100">REJECT</button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
