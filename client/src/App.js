import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Services from './pages/Services';
import Team from './pages/Team';
import Booking from './pages/Booking';
import Appointments from './pages/Appointments';
import Calendar from './pages/Calendar';
import HomeService from './pages/HomeService';
import NotificationBar from './components/NotificationBar';
import { supabase } from './supabaseClient';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ── Role-based Access Control ───────────────────────────
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || 'client';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  
  // Admin PIN (change this to your desired PIN)
  const ADMIN_PIN = '1995';
  
  // Check role permissions
  const isAdmin = userRole === 'admin';
  const isClient = userRole === 'client';
  
  // Handle admin login
  const handleAdminLogin = () => {
    if (adminPin === ADMIN_PIN) {
      setUserRole('admin');
      sessionStorage.setItem('userRole', 'admin');
      setShowLoginModal(false);
      setAdminPin('');
      setPinError('');
      setCurrentPage('appointments');
    } else {
      setPinError('Incorrect PIN. Access denied.');
      setAdminPin('');
    }
  };
  
  // Handle logout (switch back to client role)
  const handleLogout = () => {
    setUserRole('client');
    sessionStorage.removeItem('userRole');
    setCurrentPage('home');
  };
  
  // Handle page navigation with role check
  const handlePageChange = (page) => {
    if (page === 'appointments' && !isAdmin) {
      setShowLoginModal(true);
      return;
    }
    setCurrentPage(page);
  };

  // ── Load appointments from Supabase ──────────────────────
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      // Map Supabase columns to app format
      const mapped = data.map(apt => ({
        id:               apt.id,
        name:             apt.name,
        email:            apt.email,
        phone:            apt.phone,
        service:          apt.service,
        specialist:       apt.specialist,
        date:             apt.date,
        time:             apt.time,
        notes:            apt.notes,
        status:           apt.status,
        type:             apt.type,
        createdAt:        apt.created_at,
        address:          apt.address,
        imagePreview:     apt.image_preview,
        grandTotal:       apt.grand_total,
        serviceTotal:     apt.service_total,
        hsServices:       apt.hs_services,
        hsServiceDetails: apt.hs_service_details,
      }));
      setAppointments(mapped);
    }
    setLoading(false);
  };

  // ── Save appointment to Supabase ─────────────────────────
  const saveAppointment = async (appointment) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        name:               appointment.name,
        email:              appointment.email,
        phone:              appointment.phone,
        service:            appointment.service,
        specialist:         appointment.specialist,
        date:               appointment.date,
        time:               appointment.time,
        notes:              appointment.notes,
        status:             appointment.status || 'pending',
        type:               appointment.type || 'salon',
        address:            appointment.address || null,
        image_preview:      appointment.imagePreview || null,
        grand_total:        appointment.grandTotal || null,
        service_total:      appointment.serviceTotal || null,
        hs_services:        appointment.hsServices || null,
        hs_service_details: appointment.hsServiceDetails || null,
      }])
      .select();

    if (error) {
      console.error('Error saving appointment:', error);
    } else {
      await fetchAppointments();
    }
  };

  // ── Confirm appointment ──────────────────────────────────
  const confirmAppointment = async (id) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed' })
      .eq('id', id);

    if (error) {
      console.error('Error confirming:', error);
    } else {
      await fetchAppointments();
    }
  };

  // ── Cancel appointment ───────────────────────────────────
  const cancelAppointment = async (id) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      console.error('Error cancelling:', error);
    } else {
      await fetchAppointments();
    }
  };

  // ── Delete appointment ───────────────────────────────────
  const deleteAppointment = async (id) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting:', error);
    } else {
      await fetchAppointments();
    }
  };

  // ── Save Home Service ────────────────────────────────────
  const saveHomeService = (request) => {
    const pendingHS = {
      type:             'homeservice',
      services:         request.services,
      serviceDetails:   request.serviceDetails,
      address:          request.address,
      note:             request.note,
      imagePreview:     request.imagePreview,
      grandTotal:       request.grandTotal,
      serviceTotal:     request.serviceTotal,
    };
    localStorage.setItem('pendingHomeService', JSON.stringify(pendingHS));
  };

  return (
    <div className="App">
      <Nav
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        appointments={appointments}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {loading ? (
          <div className="app-loading">
            <div className="app-loading-spinner" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {currentPage === 'home'         && <Home setCurrentPage={handlePageChange} />}
            {currentPage === 'services'     && <Services />}
            {currentPage === 'team'         && <Team setCurrentPage={handlePageChange} />}
            {currentPage === 'booking'      && <Booking saveAppointment={saveAppointment} setCurrentPage={handlePageChange} appointments={appointments} />}
            {currentPage === 'appointments' && isAdmin && <Appointments appointments={appointments} deleteAppointment={deleteAppointment} confirmAppointment={confirmAppointment} cancelAppointment={cancelAppointment} fetchAppointments={fetchAppointments} />}
            {currentPage === 'calendar'     && <Calendar appointments={appointments} />}
            {currentPage === 'homeservice'  && <HomeService setCurrentPage={handlePageChange} saveHomeService={saveHomeService} />}
          </>
        )}
      </main>
      
      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="role-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="role-modal" onClick={(e) => e.stopPropagation()}>
            <button className="role-modal-close" onClick={() => setShowLoginModal(false)}>✕</button>
            
            <div className="role-modal-header">
              <div className="role-modal-icon">🔐</div>
              <h2>Admin Access Required</h2>
              <p>This page is restricted to admin/owner only</p>
            </div>
            
            <div className="role-modal-body">
              <div className="role-info-box">
                <div className="role-info-item">
                  <span className="role-badge admin">Admin/Owner</span>
                  <p>Full access to appointment management, confirmations, and rescheduling</p>
                </div>
                <div className="role-info-item">
                  <span className="role-badge client">👤 Client</span>
                  <p>Can create appointment requests and book services</p>
                </div>
              </div>
              
              <div className="role-login-section">
                <label>Enter Admin PIN</label>
                <input
                  type="password"
                  className="role-pin-input"
                  placeholder="••••"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  maxLength={6}
                  autoFocus
                />
                {pinError && <p className="role-pin-error">{pinError}</p>}
                <button className="role-login-btn" onClick={handleAdminLogin}>
                  🔓 Unlock Admin Access
                </button>
              </div>
            </div>
            
            <div className="role-modal-footer">
              <p>You are currently logged in as: <strong>{userRole === 'admin' ? '👑 Admin' : '👤 Client'}</strong></p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function Nav({ currentPage, setCurrentPage, appointments, userRole, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isAdmin = userRole === 'admin';

  const navLinks = [
    { id: 'home',         label: 'Home',         showFor: 'all' },
    { id: 'services',     label: 'Services',     showFor: 'all' },
    { id: 'team',         label: 'Our Team',     showFor: 'all' },
    { id: 'homeservice',  label: 'Home Service', showFor: 'all' },
    { id: 'booking',      label: 'Book Now',     showFor: 'all' },
    { id: 'calendar',     label: 'Calendar',     showFor: 'all' },
    { id: 'appointments', label: isAdmin ? 'Appointments' : ' Admin', showFor: 'all' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon"></span>
          <span>Nail-Toe-Tail ❤️</span>
        </div>
        
        {/* Role indicator */}
        {isAdmin && (
          <div className="nav-role-badge">
            <span>Admin Mode</span>
          </div>
        )}

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`nav-link ${currentPage === link.id ? 'active' : ''} ${link.id === 'appointments' && !isAdmin ? 'admin-locked' : ''}`}
              onClick={() => { setCurrentPage(link.id); setMenuOpen(false); }}
            >
              {link.label}
            </button>
          ))}
          {isAdmin && (
            <button 
              className="nav-link nav-logout" 
              onClick={() => { onLogout(); setMenuOpen(false); }}
            >
              Logout
            </button>
          )}
          {isAdmin && (
            <div className="nav-notif">
              <NotificationBar appointments={appointments} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Nail-ToeTail nail studio. All rights reserved.</p>
        <div className="footer-links">
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default App;