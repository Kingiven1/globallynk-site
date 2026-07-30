import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Cohort from './pages/Cohort';
import Journey from './pages/Journey';
import Donate from './pages/Donate';
import AlumniDirectory from './pages/AlumniDirectory';
import { page } from './styles/tokens';

// NOTE: Gated portal routes (/portal, /portal/instructor, etc.) and the
// public per-DJ profile route (/dj/:slug) get added once Supabase auth
// and the dj_profiles table are wired up. This file only covers the
// public marketing site agreed on for phase 1.
export default function App() {
  return (
    <BrowserRouter>
      <div style={page}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/cohort" element={<Cohort />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/alumni" element={<AlumniDirectory />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
