import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
];

const MAX_PER_DAY = 8;

const SERVICES = {
  'classic-manicure': 'Classic Manicure',
  'russian-manicure': 'Russian Manicure',
  'gel-manicure':     'Gel Manicure',
  'acrylic-nails':    'Acrylic Nails',
  'nail-art':         'Nail Art Design',
  'ombre-gradient':   'Ombre Gradient',
  'classic-pedicure': 'Classic Pedicure',
  'gel-pedicure':     'Gel Pedicure',
  'french-tips':      'French Tips',
  'nail-repair':      'Nail Repair',
  'lash-extension':   'Lash Extension',
  'lash-firm':        'Lash Firm',
  'foot-spa':         'Foot Spa',
  'waxing':           'Waxing',
};

const SPECIALISTS = {
  rose:     'Rose',
  pangging: 'Pangging',
};

function Calendar({ appointments }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Auto-navigate to just-booked appointment
  useEffect(() => {
    const justBooked = localStorage.getItem('justBooked');
    if (justBooked && appointments.length > 0) {
      try {
        const { date, time, name } = JSON.parse(justBooked);
        localStorage.removeItem('justBooked');
        
        // Parse date and navigate to that month
        const [year, month, day] = date.split('-').map(Number);
        setCurrentYear(year);
        setCurrentMonth(month - 1); // JS months are 0-indexed
        setSelectedDate(day);
        
        // Find the matching appointment and open modal
        const matchingApt = appointments.find(
          apt => apt.date === date && apt.time === time && apt.name === name
        );
        if (matchingApt) {
          // Delay slightly to ensure state updates have completed
          setTimeout(() => {
            setSelectedAppointment(matchingApt);
            setShowDetailModal(true);
          }, 100);
        }
      } catch (e) {
        console.error('Error parsing justBooked data:', e);
        localStorage.removeItem('justBooked');
      }
    }
  }, [appointments]);

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const formatDateKey = (day) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  const getBookingsForDate = (dateKey) =>
    appointments.filter(apt => apt.date === dateKey && apt.status !== 'cancelled');

  const getBookedTimesForDate = (dateKey) =>
    getBookingsForDate(dateKey).map(apt => apt.time);

  const getDayStatus = (day) => {
    const dateKey = formatDateKey(day);
    const dateObj = new Date(currentYear, currentMonth, day);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (dateObj < todayStart) return 'past';
    const count = getBookingsForDate(dateKey).length;
    if (count >= MAX_PER_DAY) return 'full';
    if (count > 0) return 'partial';
    return 'available';
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;
  const bookingsForSelected = selectedDateKey ? getBookingsForDate(selectedDateKey) : [];

  // Helper functions for displaying appointment details
  const getServiceName = (id) => SERVICES[id] || id || 'Service';
  const getSpecialistName = (id) => SPECIALISTS[id] || id || 'Specialist';
  
  const formatFullDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };
  
  const getAppointmentForSlot = (slot) => {
    return bookingsForSelected.find(apt => apt.time === slot);
  };
  
  const handleSlotClick = (slot) => {
    const apt = getAppointmentForSlot(slot);
    if (apt) {
      setSelectedAppointment(apt);
      setShowDetailModal(true);
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return { text: '✓ Confirmed', class: 'confirmed' };
      case 'cancelled': return { text: '✕ Cancelled', class: 'cancelled' };
      default: return { text: '⏳ Pending', class: 'pending' };
    }
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header-banner">
        <h1>Appointment Calendar</h1>
        <p>Check available dates and time slots</p>
      </div>

      <div className="calendar-legend">
        <span className="legend-item"><span className="legend-dot available"></span> Available</span>
        <span className="legend-item"><span className="legend-dot partial"></span> Partially Booked</span>
        <span className="legend-item"><span className="legend-dot full"></span> Fully Booked ({MAX_PER_DAY} clients)</span>
        <span className="legend-item"><span className="legend-dot past"></span> Past</span>
      </div>

      <div className="calendar-main">
        <div className="calendar-left">
          <div className="calendar-nav">
            <button className="nav-btn" onClick={prevMonth}>&#8249;</button>
            <h2>{monthNames[currentMonth]} {currentYear}</h2>
            <button className="nav-btn" onClick={nextMonth}>&#8250;</button>
          </div>

          <div className="calendar-grid">
            {dayNames.map(d => (
              <div key={d} className="day-name">{d}</div>
            ))}
            {blanks.map((_, i) => <div key={`b-${i}`} className="day-blank" />)}
            {days.map(day => {
              const status = getDayStatus(day);
              const dateKey = formatDateKey(day);
              const count = getBookingsForDate(dateKey).length;
              const isSelected = selectedDate === day;
              return (
                <div
                  key={day}
                  className={`day-cell ${status} ${isSelected ? 'selected' : ''}`}
                  onClick={() => status !== 'past' && setSelectedDate(day)}
                >
                  <span className="day-number">{day}</span>
                  {status !== 'past' && (
                    <span className="day-count">{count}/{MAX_PER_DAY}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="calendar-right">
          {selectedDate ? (
            <>
              <h3 className="slots-title">
                Time Slots — {monthNames[currentMonth]} {selectedDate}, {currentYear}
              </h3>
              <p className="slots-subtitle">
                {bookingsForSelected.length} of {MAX_PER_DAY} slots booked
                {bookingsForSelected.length > 0 && (
                  <span className="slots-hint"> • Click on booked slots to view details</span>
                )}
              </p>
              <div className="time-slots-grid">
                {TIME_SLOTS.map(slot => {
                  const apt = getAppointmentForSlot(slot);
                  const isBooked = !!apt;
                  return (
                    <div 
                      key={slot} 
                      className={`time-slot-item ${isBooked ? 'booked clickable' : 'free'}`}
                      onClick={() => isBooked && handleSlotClick(slot)}
                    >
                      <div className="slot-main">
                        <span className="slot-time">{slot}</span>
                        {isBooked && apt && (
                          <span className="slot-client-name">
                            {apt.name || 'Client'}
                          </span>
                        )}
                      </div>
                      <div className="slot-right">
                        {isBooked && apt ? (
                          <>
                            <span className={`slot-badge ${getStatusBadge(apt.status).class}`}>
                              {getStatusBadge(apt.status).text}
                            </span>
                            <span className="slot-view-btn">View →</span>
                          </>
                        ) : (
                          <span className="slot-status free">Available</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="no-date-selected">
              <div className="no-date-icon">👆</div>
              <p>Click a date to view available time slots</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Appointment Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="cal-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cal-modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            
            <div className="cal-modal-header">
              <div className="cal-modal-icon">
                {selectedAppointment.type === 'homeservice' ? '🏠' : '💅'}
              </div>
              <div className="cal-modal-title-section">
                <h2>Appointment Details</h2>
                <p className="cal-modal-subtitle">
                  {selectedAppointment.type === 'homeservice' ? 'Home Service' : 'Salon Visit'}
                </p>
              </div>
              <span className={`cal-status-badge ${getStatusBadge(selectedAppointment.status).class}`}>
                {getStatusBadge(selectedAppointment.status).text}
              </span>
            </div>
            
            <div className="cal-modal-body">
              {/* Status Message */}
              <div className={`cal-status-message ${selectedAppointment.status}`}>
                {selectedAppointment.status === 'confirmed' ? (
                  <>
                    <span className="status-icon">✅</span>
                    <span>Your appointment has been <strong>confirmed</strong> by the admin!</span>
                  </>
                ) : selectedAppointment.status === 'cancelled' ? (
                  <>
                    <span className="status-icon">❌</span>
                    <span>This appointment has been <strong>cancelled</strong>.</span>
                  </>
                ) : (
                  <>
                    <span className="status-icon">⏳</span>
                    <span>Waiting for admin confirmation. We'll update you soon!</span>
                  </>
                )}
              </div>
              
              {/* Schedule Info */}
              <div className="cal-detail-section">
                <h3>📅 Schedule</h3>
                <div className="cal-detail-grid">
                  <div className="cal-detail-item">
                    <span className="cal-detail-label">Date</span>
                    <span className="cal-detail-value">{formatFullDate(selectedAppointment.date)}</span>
                  </div>
                  <div className="cal-detail-item">
                    <span className="cal-detail-label">Time</span>
                    <span className="cal-detail-value">{selectedAppointment.time || '—'}</span>
                  </div>
                </div>
              </div>
              
              {/* Client Info */}
              <div className="cal-detail-section">
                <h3>👤 Client Information</h3>
                <div className="cal-detail-grid">
                  <div className="cal-detail-item">
                    <span className="cal-detail-label">Name</span>
                    <span className="cal-detail-value">{selectedAppointment.name || '—'}</span>
                  </div>
                  <div className="cal-detail-item">
                    <span className="cal-detail-label">Phone</span>
                    <span className="cal-detail-value">{selectedAppointment.phone || '—'}</span>
                  </div>
                  <div className="cal-detail-item full">
                    <span className="cal-detail-label">Email</span>
                    <span className="cal-detail-value">{selectedAppointment.email || '—'}</span>
                  </div>
                </div>
              </div>
              
              {/* Service Info */}
              <div className="cal-detail-section">
                <h3>💅 Service Details</h3>
                <div className="cal-detail-grid">
                  {selectedAppointment.type === 'homeservice' ? (
                    <>
                      <div className="cal-detail-item full">
                        <span className="cal-detail-label">Services</span>
                        <span className="cal-detail-value">
                          {selectedAppointment.hsServiceDetails?.map(s => s.name).join(', ') || '—'}
                        </span>
                      </div>
                      <div className="cal-detail-item">
                        <span className="cal-detail-label">Service Total</span>
                        <span className="cal-detail-value">₱{selectedAppointment.serviceTotal?.toLocaleString()}.00</span>
                      </div>
                      <div className="cal-detail-item">
                        <span className="cal-detail-label">Grand Total</span>
                        <span className="cal-detail-value highlight">₱{selectedAppointment.grandTotal?.toLocaleString()}.00</span>
                      </div>
                    </>
                  ) : (
                    <div className="cal-detail-item">
                      <span className="cal-detail-label">Service</span>
                      <span className="cal-detail-value">{getServiceName(selectedAppointment.service)}</span>
                    </div>
                  )}
                  <div className="cal-detail-item">
                    <span className="cal-detail-label">Specialist</span>
                    <span className="cal-detail-value">{getSpecialistName(selectedAppointment.specialist)}</span>
                  </div>
                </div>
              </div>
              
              {/* Address (Home Service) */}
              {selectedAppointment.type === 'homeservice' && selectedAppointment.address && (
                <div className="cal-detail-section">
                  <h3>📍 Address</h3>
                  <p className="cal-detail-address">{selectedAppointment.address}</p>
                </div>
              )}
              
              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="cal-detail-section">
                  <h3>📝 Notes</h3>
                  <p className="cal-detail-notes">{selectedAppointment.notes}</p>
                </div>
              )}
              
              {/* Design Image */}
              {selectedAppointment.imagePreview && (
                <div className="cal-detail-section">
                  <h3>🎨 Nail Design Reference</h3>
                  <div className="cal-design-wrapper">
                    <img 
                      src={selectedAppointment.imagePreview} 
                      alt="Nail design" 
                      className="cal-design-img"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="cal-modal-footer">
              <button className="cal-close-btn" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;