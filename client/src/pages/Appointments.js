import React, { useState } from 'react';
import '../styles/Appointments.css';

const SPECIALISTS = {
  rose:     'Rose',
  pangging: 'Pangging',
};

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

function Appointments({ appointments, deleteAppointment, confirmAppointment, cancelAppointment }) {
  const [activeTab,   setActiveTab]   = useState('all');
  const [filterSpec,  setFilterSpec]  = useState('all');
  const [reschedId,   setReschedId]   = useState(null);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('');
  const [imageModal,  setImageModal]  = useState(null);

  const TIME_SLOTS = [
    '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
    '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
    '1:00 PM','1:30 PM','2:00 PM','2:30 PM',
    '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM'
  ];

  const today = new Date().toISOString().split('T')[0];

  const getServiceName    = (id) => SERVICES[id]    || id || 'Service';
  const getSpecialistName = (id) => SPECIALISTS[id] || id || 'Specialist';

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const isUpcoming = (apt) => {
    if (!apt.date) return false;
    const aptDate = new Date(apt.date + 'T00:00:00');
    const tod     = new Date(); tod.setHours(0,0,0,0);
    return aptDate >= tod && apt.status !== 'cancelled';
  };

  const isPast = (apt) => {
    if (!apt.date) return false;
    const aptDate = new Date(apt.date + 'T00:00:00');
    const tod     = new Date(); tod.setHours(0,0,0,0);
    return aptDate < tod;
  };

  // ── Reschedule ────────────────────────────────────────────
  const handleReschedSave = (id) => {
    if (!reschedDate || !reschedTime) {
      alert('Please select both date and time.');
      return;
    }
    // Update in localStorage
    const saved = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updated = saved.map(apt =>
      apt.id === id
        ? { ...apt, date: reschedDate, time: reschedTime, status: 'pending' }
        : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updated));
    window.location.reload(); // reload to reflect changes
  };

  // ── Specialist stats ──────────────────────────────────────
  const roseTotal      = appointments.filter(a => a.specialist === 'rose'     && a.status !== 'cancelled').length;
  const panggingTotal  = appointments.filter(a => a.specialist === 'pangging' && a.status !== 'cancelled').length;
  const roseUpcoming   = appointments.filter(a => a.specialist === 'rose'     && isUpcoming(a)).length;
  const panggingUpcoming = appointments.filter(a => a.specialist === 'pangging' && isUpcoming(a)).length;
  const rosePast       = appointments.filter(a => a.specialist === 'rose'     && isPast(a)).length;
  const panggingPast   = appointments.filter(a => a.specialist === 'pangging' && isPast(a)).length;

  // ── Filter ────────────────────────────────────────────────
  let filtered = [...appointments];
  if (activeTab === 'upcoming') filtered = filtered.filter(isUpcoming);
  if (activeTab === 'past')     filtered = filtered.filter(isPast);
  if (activeTab === 'homeservice') filtered = filtered.filter(a => a.type === 'homeservice');
  if (filterSpec !== 'all')     filtered = filtered.filter(a => a.specialist === filterSpec);
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getStatusBadge = (apt) => {
    if (apt.status === 'cancelled')  return <span className="apt-badge cancelled">✕ Cancelled</span>;
    if (apt.status === 'confirmed')  return <span className="apt-badge confirmed">✓ Confirmed</span>;
    if (isPast(apt))                 return <span className="apt-badge completed">✓ Completed</span>;
    return <span className="apt-badge pending">⏳ Pending</span>;
  };

  return (
    <div className="appointments-page">

      <div className="appointments-header">
        <h1>My Appointments</h1>
        <p>View and manage your booked appointments</p>
      </div>

      {/* ── Specialist Stats ── */}
      <div className="spec-stats-wrapper">
        <h2 className="spec-stats-title">👩 Specialist Overview</h2>
        <div className="spec-stats-grid">

          <div className="spec-stat-card rose">
            <div className="spec-stat-header">
              <span className="spec-stat-avatar">👩</span>
              <div>
                <p className="spec-stat-name">Rose</p>
                <p className="spec-stat-role">Senior Nail & Beauty Specialist</p>
              </div>
            </div>
            <div className="spec-stat-numbers">
              <div className="spec-stat-item">
                <p className="spec-stat-num">{roseTotal}</p>
                <p className="spec-stat-label">Total</p>
              </div>
              <div className="spec-stat-divider" />
              <div className="spec-stat-item">
                <p className="spec-stat-num upcoming">{roseUpcoming}</p>
                <p className="spec-stat-label">Upcoming</p>
              </div>
              <div className="spec-stat-divider" />
              <div className="spec-stat-item">
                <p className="spec-stat-num past">{rosePast}</p>
                <p className="spec-stat-label">Completed</p>
              </div>
            </div>
            <button
              className="spec-filter-btn"
              onClick={() => setFilterSpec(filterSpec === 'rose' ? 'all' : 'rose')}
            >
              {filterSpec === 'rose' ? '✕ Clear Filter' : "🔍 View Rose's Clients"}
            </button>
          </div>

          <div className="spec-stat-card pangging">
            <div className="spec-stat-header">
              <span className="spec-stat-avatar">👱‍♀️</span>
              <div>
                <p className="spec-stat-name">Pangging</p>
                <p className="spec-stat-role">Beauty & Spa Specialist</p>
              </div>
            </div>
            <div className="spec-stat-numbers">
              <div className="spec-stat-item">
                <p className="spec-stat-num">{panggingTotal}</p>
                <p className="spec-stat-label">Total</p>
              </div>
              <div className="spec-stat-divider" />
              <div className="spec-stat-item">
                <p className="spec-stat-num upcoming">{panggingUpcoming}</p>
                <p className="spec-stat-label">Upcoming</p>
              </div>
              <div className="spec-stat-divider" />
              <div className="spec-stat-item">
                <p className="spec-stat-num past">{panggingPast}</p>
                <p className="spec-stat-label">Completed</p>
              </div>
            </div>
            <button
              className="spec-filter-btn"
              onClick={() => setFilterSpec(filterSpec === 'pangging' ? 'all' : 'pangging')}
            >
              {filterSpec === 'pangging' ? '✕ Clear Filter' : "🔍 View Pangging's Clients"}
            </button>
          </div>

        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="appointments-container">
        <div className="apt-controls">
          <div className="apt-tabs">
            {[
              { id: 'all',         label: `All (${appointments.length})` },
              { id: 'upcoming',    label: `Upcoming (${appointments.filter(isUpcoming).length})` },
              { id: 'homeservice', label: `🏠 Home Service (${appointments.filter(a => a.type === 'homeservice').length})` },
              { id: 'past',        label: `Completed (${appointments.filter(isPast).length})` },
            ].map(tab => (
              <button
                key={tab.id}
                className={`apt-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filterSpec !== 'all' && (
            <div className="active-filter-badge">
              Filtering: {getSpecialistName(filterSpec)}
              <button onClick={() => setFilterSpec('all')}>✕</button>
            </div>
          )}
        </div>

        {/* ── Appointment List ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h2>No Appointments Found</h2>
            <p>No appointments in this category yet.</p>
          </div>
        ) : (
          <div className="appointments-list">
            {filtered.map(apt => {
              const past       = isPast(apt);
              const cancelled  = apt.status === 'cancelled';
              const confirmed  = apt.status === 'confirmed';
              const isHS       = apt.type === 'homeservice';
              const isRescheduling = reschedId === apt.id;

              return (
                <div
                  key={apt.id}
                  className={`appointment-card ${past ? 'past-card' : ''} ${cancelled ? 'cancelled-card' : ''} ${isHS ? 'hs-card-apt' : ''}`}
                >
                  <div className="appointment-content">

                    {/* Header */}
                    <div className="appointment-header">
                      <div className="apt-header-left">
                        {isHS
                          ? <h3>🏠 Home Service</h3>
                          : <h3>{getServiceName(apt.service)}</h3>
                        }
                        {getStatusBadge(apt)}
                        {isHS && <span className="hs-type-badge">Home Service</span>}
                      </div>
                      <span className="appointment-date">
                        📅 {formatDate(apt.date)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="appointment-details">
                      <div className="detail-row">
                        <span className="label">👤 Client</span>
                        <span className="value">{apt.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">📞 Phone</span>
                        <span className="value">{apt.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">👩 Specialist</span>
                        <span className="value">{getSpecialistName(apt.specialist)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">⏰ Time</span>
                        <span className="value">{apt.time}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">📧 Email</span>
                        <span className="value">{apt.email}</span>
                      </div>

                      {/* Home Service extra details */}
                      {isHS && (
                        <>
                          <div className="detail-row full-width">
                            <span className="label">📍 Address</span>
                            <span className="value">{apt.address}</span>
                          </div>
                          <div className="detail-row full-width">
                            <span className="label">💅 Services</span>
                            <span className="value">
                              {apt.hsServiceDetails?.map(s => s.name).join(', ') || '—'}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="label">💳 Total</span>
                            <span className="value hs-total">₱{apt.grandTotal?.toLocaleString()}.00</span>
                          </div>
                          {apt.notes && (
                            <div className="detail-row full-width">
                              <span className="label">📝 Notes</span>
                              <span className="value">{apt.notes}</span>
                            </div>
                          )}
                          {/* Design Image */}
                          {apt.imagePreview && (
                            <div className="detail-row full-width">
                              <span className="label">🎨 Design</span>
                              <div className="apt-design-wrapper">
                                <img
                                  src={apt.imagePreview}
                                  alt="Nail design"
                                  className="apt-design-thumb"
                                  onClick={() => setImageModal(apt.imagePreview)}
                                />
                                <button
                                  className="apt-view-img-btn"
                                  onClick={() => setImageModal(apt.imagePreview)}
                                >
                                  🔍 View Full
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {apt.notes && !isHS && (
                        <div className="detail-row">
                          <span className="label">📝 Notes</span>
                          <span className="value">{apt.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Action Buttons ── */}
                  {!past && !cancelled && (
                    <div className="appointment-actions">

                      {/* Confirm */}
                      {!confirmed && (
                        <button
                          className="btn btn-confirm"
                          onClick={() => confirmAppointment(apt.id)}
                        >
                          ✓ Confirm
                        </button>
                      )}

                      {/* Re-schedule */}
                      {!isRescheduling ? (
                        <button
                          className="btn btn-resched"
                          onClick={() => {
                            setReschedId(apt.id);
                            setReschedDate(apt.date || '');
                            setReschedTime(apt.time || '');
                          }}
                        >
                          📅 Re-schedule
                        </button>
                      ) : (
                        <div className="resched-panel">
                          <p className="resched-title">📅 Choose New Schedule</p>
                          <input
                            type="date"
                            className="resched-date-input"
                            min={today}
                            value={reschedDate}
                            onChange={e => setReschedDate(e.target.value)}
                          />
                          <div className="resched-time-grid">
                            {TIME_SLOTS.map(slot => (
                              <button
                                key={slot}
                                type="button"
                                className={`resched-time-btn ${reschedTime === slot ? 'selected' : ''}`}
                                onClick={() => setReschedTime(slot)}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                          <div className="resched-actions">
                            <button
                              className="btn btn-confirm"
                              onClick={() => handleReschedSave(apt.id)}
                            >
                              ✓ Save New Schedule
                            </button>
                            <button
                              className="btn btn-secondary-sm"
                              onClick={() => setReschedId(null)}
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Cancel */}
                      {!isRescheduling && (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            if (window.confirm('Cancel this appointment?')) {
                              cancelAppointment(apt.id);
                            }
                          }}
                        >
                          ✕ Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Image Modal ── */}
      {imageModal && (
        <div className="img-modal-backdrop" onClick={() => setImageModal(null)}>
          <div className="img-modal-content" onClick={e => e.stopPropagation()}>
            <button className="img-modal-close" onClick={() => setImageModal(null)}>✕</button>
            <img src={imageModal} alt="Nail design" className="img-modal-img" />
            <p className="img-modal-caption">🎨 Client's Nail Design Reference</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Appointments;