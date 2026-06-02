import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Inquiry, JoinRequest } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Calendar } from 'lucide-react';

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
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <input 
                type="password" 
                placeholder="Enter access code" 
                className="rounded-md border border-stone-300 p-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <button 
                type="submit"
                className="rounded-md bg-stone-900 p-2 text-white hover:bg-stone-800"
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
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-stone-900">Admin Dashboard</h1>

      {loading ? (
        <div className="text-stone-500">Loading data...</div>
      ) : (
        <div className="space-y-12">
          {/* Inquiries */}
          <section>
            <h2 className="mb-4 text-xl flex items-center font-semibold text-stone-900 border-b border-stone-200 pb-2">
              Recent Client Inquiries
              <span className="ml-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                {inquiries.length} requests
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inquiries.length === 0 ? (
                <p className="text-stone-500 text-sm py-4">No inquiries found.</p>
              ) : inquiries.map((req) => (
                <Card key={req.id} className="border-stone-200 shadow-none">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{req.name}</h3>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs capitalize text-stone-600 font-medium">
                        {req.status}
                      </span>
                    </div>
                    <div className="text-sm text-stone-600 space-y-1 mb-4 flex-grow">
                      <p><span className="font-medium text-stone-800">Phone:</span> {req.phone}</p>
                      <p><span className="font-medium text-stone-800">Service:</span> <span className="capitalize">{req.service_needed.replace(/-/g, ' ')}</span></p>
                      <p><span className="font-medium text-stone-800">Location:</span> {req.city}{req.area ? `, ${req.area}` : ''}</p>
                      <div className="mt-2 text-stone-700 bg-stone-50 p-2 rounded border border-stone-100 whitespace-pre-wrap text-xs h-24 overflow-y-auto">
                        {req.description}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-stone-400 mt-auto pt-4">
                      <Calendar className="mr-1.5 h-3 w-3" />
                      {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Applications */}
          <section>
            <h2 className="mb-4 text-xl flex items-center font-semibold text-stone-900 border-b border-stone-200 pb-2">
              Artist Join Requests
              <span className="ml-3 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
                {applications.length} applied
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {applications.length === 0 ? (
                <p className="text-stone-500 text-sm py-4">No applications found.</p>
              ) : applications.map((app) => (
                <Card key={app.id} className="border-stone-200 shadow-none">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{app.name}</h3>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs capitalize text-stone-600 font-medium">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-sm text-stone-600 space-y-1 mb-4 flex-grow">
                      <p><span className="font-medium text-stone-800">Location:</span> {app.city}{app.area ? `, ${app.area}` : ''}</p>
                      <p><span className="font-medium text-stone-800">Contact:</span> {app.phone}</p>
                      <p className="line-clamp-1">
                        <span className="font-medium text-stone-800">Services: </span> 
                        {app.service_interest?.join(', ') || 'None specified'}
                      </p>
                      <p className="line-clamp-1">
                        <span className="font-medium text-stone-800">Mediums: </span> 
                        {app.mediums?.join(', ') || 'None specified'}
                      </p>
                      {app.portfolio_links && (
                        <p className="mt-2">
                          <a href={app.portfolio_links} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">
                            View Portfolio Links
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-stone-400 mt-auto pt-4">
                      <Calendar className="mr-1.5 h-3 w-3" />
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
