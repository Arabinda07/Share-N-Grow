import React, { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Inquiry, JoinRequest } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ExclamationCircleIcon as AlertCircle, CalendarIcon as Calendar } from '@heroicons/react/24/outline';

export function Admin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authCode, setAuthCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode === 'share2026') {
      setIsAuthenticated(true);
    } else {
      alert("Invalid code");
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasSupabaseConfig) {
      Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('join_requests').select('*').order('created_at', { ascending: false })
      ]).then(([inquiriesRes, appsRes]) => {
        if (inquiriesRes.data) setInquiries(inquiriesRes.data);
        if (appsRes.data) setApplications(appsRes.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
        <Card className="w-full overflow-hidden border-ink-light/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem]">
          <CardContent className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-center tracking-tight text-ink font-sans">Admin Access</h2>
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <input 
                type="password" 
                placeholder="Enter access code" 
                className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus-visible:border-terracotta focus:ring-1 focus:ring-terracotta transition-shadow"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <button 
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-ink text-sm font-medium text-white hover:bg-ink-light transition-all active:scale-[0.98] mt-2"
              >
                View Dashboard
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="mb-8 text-4xl font-bold font-sans tracking-tight text-ink sm:text-5xl">Admin Dashboard</h1>

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
            <h2 className="mb-6 text-xl flex items-center font-semibold text-ink border-b border-ink-light/10 pb-4 font-sans tracking-tight">
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
                      <h3 className="font-semibold text-lg line-clamp-1 text-ink font-sans tracking-tight">{req.name}</h3>
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
                    <div className="flex items-center text-xs text-ink-light/70 mt-auto pt-4 border-t border-ink-light/10 font-medium">
                      <Calendar className="mr-2 h-3.5 w-3.5 text-terracotta" />
                      {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Applications */}
          <section>
            <h2 className="mb-6 text-xl flex items-center font-semibold text-ink border-b border-ink-light/10 pb-4 font-sans tracking-tight">
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
                      <h3 className="font-semibold text-lg line-clamp-1 text-ink font-sans tracking-tight">{app.name}</h3>
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
                    <div className="flex items-center text-xs text-ink-light/70 mt-auto pt-4 border-t border-ink-light/10 font-medium">
                      <Calendar className="mr-2 h-3.5 w-3.5 text-terracotta" />
                      {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
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
