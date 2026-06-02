/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Hire } from './pages/Hire';
import { Join } from './pages/Join';
import { Admin } from './pages/Admin';
import { DrawingTeachers } from './pages/DrawingTeachers';
import { WallMurals } from './pages/WallMurals';
import { EventsLiveArt } from './pages/EventsLiveArt';
import { Collaborate } from './pages/Collaborate';
import { ArtistsDirectory } from './pages/ArtistsDirectory';
import { ArtistProfile } from './pages/ArtistProfile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-paper font-sans text-ink">
        <Navbar />
        <main className="flex-grow">
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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
