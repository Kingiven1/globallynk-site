import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import MailingListPopup from './components/MailingListPopup';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Events from './pages/Events';
import Cohort from './pages/Cohort';
import Journey from './pages/Journey';
import Donate from './pages/Donate';
import AlumniDirectory from './pages/AlumniDirectory';
import Contact from './pages/Contact';
import BookDJ from './pages/BookDJ';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import CultureExchange from './pages/CultureExchange';
import CultureExchangeVote from './pages/CultureExchangeVote';
import MixLab from './pages/MixLab';
import Portal from './pages/Portal';
import AdminStudents from './pages/AdminStudents';
import AdminVotes from './pages/AdminVotes';
import AdminPartners from './pages/AdminPartners';
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
            <Route path="/book-dj" element={<BookDJ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/culture-exchange" element={<CultureExchange />} />
            <Route path="/culture-exchange/vote" element={<CultureExchangeVote />} />
            <Route path="/mix-lab" element={<MixLab />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <AdminStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/votes"
              element={
                <ProtectedRoute>
                  <AdminVotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/partners"
              element={
                <ProtectedRoute>
                  <AdminPartners />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
        <MailingListPopup />
      </BrowserRouter>
    </AuthProvider>
  );
}