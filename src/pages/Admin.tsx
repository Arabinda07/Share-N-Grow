import React, { useState, useEffect } from 'react';
import { hasSupabaseConfig } from '../lib/supabase';
import { Inquiry, JoinRequest, AdminUser } from '../types';
import { api } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ExclamationTriangleIcon as AlertCircle, CalendarIcon as Calendar } from '@radix-ui/react-icons';
import { useAdminAuth } from '../hooks/useAdminAuth';

export function Admin() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'applications' | 'admins'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<JoinRequest[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const { 
    isAuthenticated, 
    isCheckingAuth, 
    authError, 
    setAuthError, 
    requiresPasswordUpdate,
    setRequiresPasswordUpdate,
    signIn, 
    signOut, 
    resetPassword,
    updatePassword
  } = useAdminAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresPasswordUpdate) {
      const success = await updatePassword(password);
      if (success) {
        setRequiresPasswordUpdate(false);
        setResetMessage('Password updated successfully. You are now logged in.');
        setPassword('');
        // Clean up hash from URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else if (isResetting) {
      const success = await resetPassword(email);
      if (success) {
        setResetMessage('Password reset link sent to your email.');
      }
    } else {
      await signIn(email, password);
    }
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
        api.fetchAdminJoinRequests(),
        api.fetchAdmins()
      ]).then(([inquiriesRes, appsRes, adminsRes]) => {
        if (inquiriesRes.data) setInquiries(inquiriesRes.data);
        if (appsRes.data) setApplications(appsRes.data);
        if (adminsRes.data) setAdmins(adminsRes.data);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  const updateApplicationStatus = async (app: JoinRequest, status: 'approved' | 'rejected') => {
    try {
      let error;
      if (status === 'approved') {
        const result = await api.approveJoinRequest(app);
        error = result.error;
      } else {
        const result = await api.updateJoinRequestStatus(app.id, status);
        error = result.error;
      }

      if (error) {
        alert("Failed to update status: " + error.message);
        return;
      }
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status } : a));
    } catch (e) {
      console.error(e);
      alert("Error updating application");
    }
  };

  const renderPortfolioLinks = (text: string | null) => {
    if (!text) return null;
    let linkText = text;
    let uploadedFileUrl = '';
    
    if (text.includes('\n\nUploaded File: ')) {
      const parts = text.split('\n\nUploaded File: ');
      linkText = parts[0].trim();
      uploadedFileUrl = parts[1].trim();
    } else if (text.startsWith('Uploaded File: ')) {
      linkText = '';
      uploadedFileUrl = text.replace('Uploaded File: ', '').trim();
    }

    return (
      <div className="mt-4 pt-4 border-t border-whisper flex flex-col gap-3">
         {linkText && (
            <div>
              <span className="font-semibold text-ink-light text-[10px] uppercase tracking-wider block mb-1">Portfolio Link</span>
              <a href={linkText.startsWith('http') ? linkText : `https://${linkText}`} target="_blank" rel="noreferrer" className="text-ink hover:text-ink-light font-medium underline underline-offset-2 decoration-ink/30 hover:decoration-ink transition-colors break-all text-sm">
                {linkText}
              </a>
            </div>
         )}
         {uploadedFileUrl && (
            <div>
               <span className="font-semibold text-ink-light text-[10px] uppercase tracking-wider block mb-1.5">Attachment</span>
               <a href={uploadedFileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-[12px] font-semibold bg-paper px-3 py-2 rounded-lg border border-whisper hover:bg-paper-dark transition-colors text-ink">
                 View Uploaded File
               </a>
            </div>
         )}
      </div>
    );
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

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    try {
      const { error } = await api.createAdminRecord(newAdminEmail, newAdminName);
      if (error) {
        alert("Failed to add admin: " + error.message);
        return;
      }
      setNewAdminEmail('');
      setNewAdminName('');
      const res = await api.fetchAdmins();
      if (res.data) setAdmins(res.data);
      alert("Admin user added. Ask them to use the 'Forgot Password' link to set their password.");
    } catch (e) {
      console.error(e);
      alert("Error adding admin");
    }
  };

  const handleUpdateAdminName = async (id: string, name: string) => {
     try {
       const { error } = await api.updateAdmin(id, { name });
       if (error) {
          alert('Failed to update name: ' + error.message);
          return;
       }
       setAdmins(prev => prev.map(a => a.id === id ? { ...a, name } : a));
     } catch (e) {
       console.error(e);
       alert("Error updating admin name");
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

  if (requiresPasswordUpdate) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
        <Card className="w-full overflow-hidden border-ink-light/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-2xl">
          <CardContent className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-center tracking-tight text-ink font-serif">
              Set New Password
            </h2>
            {authError && (
              <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                {authError}
              </div>
            )}
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <input 
                type="password" 
                placeholder="New Password" 
                className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus-visible:border-ink/20 focus:ring-1 focus:ring-ink/20 transition-shadow"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-ink text-sm font-medium text-white hover:bg-ink-light transition-all active:scale-[0.98] mt-2"
              >
                Update Password
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
        <Card className="w-full overflow-hidden border-ink-light/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-2xl">
          <CardContent className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-center tracking-tight text-ink font-serif">
              {isResetting ? "Reset Password" : "Admin Login"}
            </h2>
            {authError && (
              <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                {authError}
              </div>
            )}
            {resetMessage && (
              <div className="mb-4 text-xs font-semibold text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">
                {resetMessage}
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
              {!isResetting && (
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="flex h-12 w-full rounded-xl border border-ink-light/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus-visible:border-ink/20 focus:ring-1 focus:ring-ink/20 transition-shadow"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <button 
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-ink text-sm font-medium text-white hover:bg-ink-light transition-all active:scale-[0.98] mt-2"
              >
                {isResetting ? "Send Reset Link" : "Sign In"}
              </button>
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetting(!isResetting);
                    setAuthError(null);
                    setResetMessage('');
                  }}
                  className="text-xs text-ink-light hover:text-ink transition-colors font-medium"
                >
                  {isResetting ? "Back to Login" : "Forgot Password?"}
                </button>
              </div>
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
        <div className="space-y-8">
           <div className="flex space-x-1 sm:space-x-4 border-b border-ink-light/10 pb-4">
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'inquiries' ? 'bg-ink text-white shadow-sm' : 'text-ink-light hover:bg-paper-dark'}`}
              >
                 Inquiries ({inquiries.length})
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'applications' ? 'bg-ink text-white shadow-sm' : 'text-ink-light hover:bg-paper-dark'}`}
              >
                 Join Requests ({applications.length})
              </button>
              <button 
                onClick={() => setActiveTab('admins')}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'admins' ? 'bg-ink text-white shadow-sm' : 'text-ink-light hover:bg-paper-dark'}`}
              >
                 Admins
              </button>
           </div>
           
           {activeTab === 'inquiries' && (
             <section>
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
           )}

           {activeTab === 'applications' && (
             <section>
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
                         
                         {app.short_bio && (
                           <div className="bg-paper p-3 rounded-lg border border-whisper mt-2 text-[13px]">
                             <span className="font-medium text-ink block mb-1">Bio:</span>
                             <p className="line-clamp-3">{app.short_bio}</p>
                           </div>
                         )}
                         
                         {app.message && (
                           <div className="bg-paper-dark p-3 rounded-lg border border-whisper mt-2 text-[13px]">
                              <span className="font-medium text-ink block mb-1">Message:</span>
                              <p className="line-clamp-2">{app.message}</p>
                           </div>
                         )}

                         <div className="flex flex-wrap gap-2 mt-3 mb-1">
                            {app.available_for_paid_work && <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Paid Work</span>}
                            {app.available_for_home_teaching && <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Teaching</span>}
                            {app.available_for_travel && <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Travels</span>}
                         </div>

                         {renderPortfolioLinks(app.portfolio_links)}
                       </div>
                       <div className="flex items-center justify-between mt-auto pt-4 border-t border-whisper">
                         <div className="flex items-center text-xs text-ink-light/70 font-medium">
                           <Calendar className="mr-2 h-3.5 w-3.5 text-terracotta" />
                           {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                         </div>
                         {app.status === 'new' && (
                           <div className="flex gap-2">
                             <button onClick={() => updateApplicationStatus(app, 'approved')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-ink text-white rounded-md hover:bg-ink-light transition-all active:scale-95 shadow-sm">APPROVE</button>
                             <button onClick={() => updateApplicationStatus(app, 'rejected')} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all active:scale-95 border border-red-100">REJECT</button>
                           </div>
                         )}
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </section>
           )}

           {activeTab === 'admins' && (
             <section className="max-w-4xl mx-auto w-full">
                <Card className="border border-whisper bg-white shadow-sm rounded-2xl mb-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-ink font-serif tracking-tight mb-4 border-b border-whisper pb-3">Invite Admin</h3>
                    <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4 items-end">
                      <div className="flex-1 w-full relative">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-ink-light mb-1.5 block">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={newAdminEmail}
                          onChange={e => setNewAdminEmail(e.target.value)}
                          placeholder="admin@example.com"
                          className="h-10 w-full rounded-lg border border-ink-light/20 px-3 text-sm focus:border-ink/20 focus:outline-none focus:ring-1 focus:ring-ink/20"
                        />
                      </div>
                      <div className="flex-1 w-full relative">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-ink-light mb-1.5 block">Name</label>
                        <input 
                          type="text" 
                          value={newAdminName}
                          onChange={e => setNewAdminName(e.target.value)}
                          placeholder="Admin Name"
                          className="h-10 w-full rounded-lg border border-ink-light/20 px-3 text-sm focus:border-ink/20 focus:outline-none focus:ring-1 focus:ring-ink/20"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="h-10 px-6 rounded-lg bg-ink text-white text-sm font-semibold hover:bg-ink-light transition-all active:scale-95 whitespace-nowrap"
                      >
                        Add Admin
                      </button>
                    </form>
                    <p className="text-xs text-ink-light/70 mt-3 flex items-start gap-1.5">
                       <AlertCircle className="w-4 h-4 shrink-0 text-terracotta/70 mt-0.5" />
                       Inviting adds them to the directory. Direct them to the login page to use 'Forgot Password' to set their password (if already signed up) or sign up if new.
                    </p>
                  </CardContent>
                </Card>

                <h3 className="font-semibold text-lg text-ink font-serif tracking-tight mb-4">Admin Directory</h3>
                <div className="bg-white rounded-2xl border border-whisper overflow-hidden flex flex-col shadow-sm">
                   <div className="grid grid-cols-12 gap-4 p-4 border-b border-whisper bg-paper text-xs font-bold uppercase tracking-wider text-ink-light">
                      <div className="col-span-5">Admin Identity</div>
                      <div className="col-span-4">Role & Status</div>
                      <div className="col-span-3 text-right">Actions</div>
                   </div>
                   {admins.length === 0 ? (
                      <div className="p-8 text-center text-ink-light text-sm">No administrators configured. You might be using raw SQL?</div>
                   ) : admins.map(admin => (
                      <div key={admin.id} className="grid grid-cols-12 gap-4 p-4 border-b border-whisper items-center last:border-0 hover:bg-paper/30 transition-colors">
                         <div className="col-span-5 flex flex-col">
                            <input 
                               value={admin.name || ''}
                               onChange={e => handleUpdateAdminName(admin.id, e.target.value)}
                               placeholder="Add a name..."
                               className="font-semibold text-ink bg-transparent focus:bg-paper px-1 -ml-1 rounded transition-colors text-sm border-none focus:ring-1 focus:ring-ink/20 max-w-[200px]"
                            />
                            <span className="text-xs text-ink-light font-mono px-1 -ml-1 mt-0.5 opacity-80">{admin.email}</span>
                         </div>
                         <div className="col-span-4 flex flex-col gap-1 items-start justify-center">
                            <span className="bg-ink/5 text-ink border border-ink/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              {admin.role || 'Admin'}
                            </span>
                         </div>
                         <div className="col-span-3 flex justify-end">
                            {/* more actions could go here */}
                         </div>
                      </div>
                   ))}
                </div>
             </section>
           )}

        </div>
      )}
    </div>
  );
}
