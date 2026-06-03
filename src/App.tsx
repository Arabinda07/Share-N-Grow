/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/layout/Navbar'; 
import { Footer } from './components/layout/Footer';

// Lazy load pages for better performance (bundle splitting)
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Hire = lazy(() => import('./pages/Hire').then(module => ({ default: module.Hire })));
const Join = lazy(() => import('./pages/Join').then(module => ({ default: module.Join })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const DrawingTeachers = lazy(() => import('./pages/DrawingTeachers').then(module => ({ default: module.DrawingTeachers })));
const WallMurals = lazy(() => import('./pages/WallMurals').then(module => ({ default: module.WallMurals })));
const EventsLiveArt = lazy(() => import('./pages/EventsLiveArt').then(module => ({ default: module.EventsLiveArt })));
const Collaborate = lazy(() => import('./pages/Collaborate').then(module => ({ default: module.Collaborate })));
const ArtistsDirectory = lazy(() => import('./pages/ArtistsDirectory').then(module => ({ default: module.ArtistsDirectory })));
const ArtistProfile = lazy(() => import('./pages/ArtistProfile').then(module => ({ default: module.ArtistProfile })));
const FAQ = lazy(() => import('./pages/FAQ').then(module => ({ default: module.FAQ })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-terracotta rounded-full"></div>
      <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-200"></div>
      <div className="w-3 h-3 bg-terracotta rounded-full animation-delay-400"></div>
    </div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-paper font-serif text-ink relative">
          <Navbar />
          <main className="flex-grow overflow-x-hidden w-full max-w-full">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hire" element={<Hire />} />
                <Route path="/join" element={<Join />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/drawing-teachers" element={<DrawingTeachers />} />
                <Route path="/wall-murals" element={<WallMurals />} />
                <Route path="/events-live-art" element={<EventsLiveArt />} />
                <Route path="/collaborate" element={<Collaborate />} />
                <Route path="/directory" element={<ArtistsDirectory />} />
                <Route path="/artist/:id" element={<ArtistProfile />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
