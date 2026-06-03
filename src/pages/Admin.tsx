import React, { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Inquiry, JoinRequest } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ExclamationTriangleIcon as AlertCircle, CalendarIcon as Calendar } from '@radix-ui/react-icons';

export function Admin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      if (!hasSupabaseConfig) {
        setIsCheckingAuth(false);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        verifyAdminAccess(session.user.id);
      } else {
        setIsCheckingAuth(false);
        setLoading(false);
      }
    };

    checkSession();
  }, []); // Run once on mount

  const verifyAdminAccess = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error || !data) {
        console.error("Admin verification failed:", error);
        setAuthError("Account does not have admin privileges.");
        await supabase.auth.signOut();
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Error verifying admin status");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsCheckingAuth(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        setIsCheckingAuth(false);
        return;
      }

      if (data.user) {
        await verifyAdminAccess(data.user.id);
      }
    } catch (err) {
      setAuthError("Failed to sign in.");
      setIsCheckingAuth(false);
    }
  };

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    if (isAuthenticated && hasSupabaseConfig) {
      setLoading(true);
      Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('join_requests').select('*').order('created_at', { ascending: false })
      ]).then(([inquiriesRes, appsRes]) => {
        if (inquiriesRes.data) setInquiries(inquiriesRes.data);
        if (appsRes.data) setApplications(appsRes.data);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.from('join_requests').update({ status }).eq('id', id);
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
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
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
        <Card className="w-full overflow-hidden border-ink-light/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem]">
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
                className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus-visible:border-terracotta focus:ring-1 focus:ring-terracotta transition-shadow"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus-visible:border-terracotta focus:ring-1 focus:ring-terracotta transition-shadow"
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
                <p className="text-ink-light text-sm py-4">No inquiries found.</p>
              ) : inquiries.map((req) => (
                <Card key={req.id} className="border-ink-light/20 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem]">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg line-clamp-1 text-ink font-serif tracking-tight">{req.name}</h3>
                      <span className="rounded-full bg-paper-dark border border-ink-light/10 px-3 py-1 text-xs capitalize text-ink-light font-bold">
                        {req.status}
                      </span>
                    </div>
                    <div className="text-sm text-ink-light space-y-2 mb-6 flex-grow leading-relaxed">
                      <p><span className="font-medium text-ink">Phone:</span> {req.phone}</p>
                      <p><span className="font-medium text-ink">Service:</span> <span className="capitalize">{req.service_needed.replace(/-/g, ' ')}</span></p>
                      <p><span className="font-medium text-ink">Location:</span> {req.city}{req.area ? `, ${req.area}` : ''}</p>
                      <div className="mt-4 text-ink-light bg-paper-dark p-4 rounded-[1rem] border border-ink-light/10 whitespace-pre-wrap text-[13px] h-28 overflow-y-auto leading-relaxed">
                        {req.description}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-light/10">
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
                          {req.status === 'reviewed' && <button onClick={() => updateInquiryStatus(req.id, 'matched')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-terracotta text-white rounded-md hover:bg-terracotta-dark transition-all active:scale-95 shadow-sm">MATCHED</button>}
                          <button onClick={() => updateInquiryStatus(req.id, 'closed')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-paper-dark text-ink border border-ink-light/20 rounded-md hover:bg-paper transition-all active:scale-95">CLOSE</button>
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
                <p className="text-ink-light text-sm py-4">No applications found.</p>
              ) : applications.map((app) => (
                <Card key={app.id} className="border-ink-light/20 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem]">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg line-clamp-1 text-ink font-serif tracking-tight">{app.name}</h3>
                      <span className="rounded-full bg-paper border border-ink-light/10 px-3 py-1 text-xs capitalize text-ink-light font-bold">
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
                        <p className="mt-3 pt-2 border-t border-ink-light/10">
                          <a href={app.portfolio_links} target="_blank" rel="noreferrer" className="text-terracotta hover:text-terracotta-dark font-medium underline underline-offset-2 decoration-terracotta/30 hover:decoration-terracotta transition-colors">
                            View Portfolio Links
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-light/10">
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
