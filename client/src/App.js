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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [appointments, setAppointments] = useState([]);
  const [homeServiceRequests, setHomeServiceRequests] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) setAppointments(JSON.parse(saved));

    const savedHS = localStorage.getItem('homeServiceRequests');
    if (savedHS) setHomeServiceRequests(JSON.parse(savedHS));
  }, []);

  const saveAppointment = (appointment) => {
    const updated = [...appointments, {
      ...appointment,
      id: Date.now(),
      type: 'salon',
    }];
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  const deleteAppointment = (id) => {
    const updated = appointments.filter(apt => apt.id !== id);
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  const saveHomeService = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      type: 'homeservice',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [...homeServiceRequests, newRequest];
    setHomeServiceRequests(updated);
    localStorage.setItem('homeServiceRequests', JSON.stringify(updated));

    // Also add to appointments so it shows in My Appointments
    const allApts = [...appointments, newRequest];
    setAppointments(allApts);
    localStorage.setItem('appointments', JSON.stringify(allApts));
  };

  const confirmAppointment = (id) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'confirmed' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  const cancelAppointment = (id) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  // Combine all for notification bell
  const allNotifData = appointments;

  return (
    <div className="App">
      <Nav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        appointments={allNotifData}
      />

      <main className="main-content">
        {currentPage === 'home'         && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'services'     && <Services />}
        {currentPage === 'booking'      && <Booking saveAppointment={saveAppointment} setCurrentPage={setCurrentPage} appointments={appointments} />}
        {currentPage === 'appointments' && <Appointments appointments={appointments} deleteAppointment={deleteAppointment} confirmAppointment={confirmAppointment} cancelAppointment={cancelAppointment} />}
        {currentPage === 'calendar'     && <Calendar appointments={appointments} />}
        {currentPage === 'homeservice'  && <HomeService setCurrentPage={setCurrentPage} saveHomeService={saveHomeService} />}
        {currentPage === 'team'         && <Team setCurrentPage={setCurrentPage} />}
      </main>

      <Footer />
    </div>
  );
}

function Nav({ currentPage, setCurrentPage, appointments }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home',         label: 'Home' },
    { id: 'services',     label: 'Services' },
    { id: 'team',         label: 'Our Team' },
    { id: 'homeservice',  label: 'Home Service' },
    { id: 'booking',      label: 'Book Now' },
    { id: 'calendar',     label: 'Calendar' },
    { id: 'appointments', label: 'My Appointments' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon"></span>
          <span>Nail-Toe-Tail❤️</span>
        </div>

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
              className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
              onClick={() => { setCurrentPage(link.id); setMenuOpen(false); }}
            >
              {link.label}
            </button>
          ))}
          <div className="nav-notif">
            <NotificationBar appointments={appointments} />
          </div>
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