import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Events from './pages/Events';
import Cohort from './pages/Cohort';
import Journey from './pages/Journey';
import Donate from './pages/Donate';
import AlumniDirectory from './pages/AlumniDirectory';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Portal from './pages/Portal';
import { page } from './styles/tokens';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div style={page}>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/cohort" element={<Cohort />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/alumni" element={<AlumniDirectory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}