import React, { useState } from 'react';
import '../styles/Booking.css';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM',  '1:30 PM',  '2:00 PM',  '2:30 PM',
  '3:00 PM',  '3:30 PM',  '4:00 PM',  '4:30 PM', '5:00 PM'
];

const MAX_PER_DAY = 8;

function Booking({ saveAppointment, setCurrentPage, appointments }) {

  // ── Check kung naay pending Home Service ──────────────────
  const pendingHS = (() => {
    try {
      const d = localStorage.getItem('pendingHomeService');
      return d ? JSON.parse(d) : null;
    } catch { return null; }
  })();

  const isHomeService = !!pendingHS;

  const [formData, setFormData] = useState({
    name:       '',
    email:      '',
    phone:      '',
    service:    isHomeService ? 'home-service' : '',
    specialist: '',
    date:       '',
    time:       '',
    notes:      isHomeService ? (pendingHS?.note || '') : '',
  });

  const [step,      setStep]      = useState(1);
  const [success,   setSuccess]   = useState(false);
  const [dateError, setDateError] = useState('');

  const services = [
    { id: 'classic-manicure', name: 'Classic Manicure',  price: '100.00' },
    { id: 'russian-manicure', name: 'Russian Manicure',  price: '100.00' },
    { id: 'gel-manicure',     name: 'Gel Manicure',      price: '250.00' },
    { id: 'acrylic-nails',    name: 'Acrylic Nails',     price: '550.00' },
    { id: 'nail-art',         name: 'Nail Art Design',   price: '100.00' },
    { id: 'ombre-gradient',   name: 'Ombre Gradient',    price: '100.00' },
    { id: 'classic-pedicure', name: 'Classic Pedicure',  price: '130.00' },
    { id: 'gel-pedicure',     name: 'Gel Pedicure',      price: '250.00' },
    { id: 'french-tips',      name: 'French Tips',       price: '100.00' },
    { id: 'nail-repair',      name: 'Nail Repair',       price: '100.00' },
    { id: 'lash-extension',   name: 'Lash Extension',    price: '550.00' },
    { id: 'lash-firm',        name: 'Lash Firm',         price: '250.00' },
    { id: 'foot-spa',         name: 'Foot Spa',          price: '380.00' },
    { id: 'waxing',           name: 'Waxing',            price: '150.00' },
  ];

  const specialists = [
    { id: 'rose',     name: 'Rose',     role: 'Senior Nail & Beauty Specialist' },
    { id: 'pangging', name: 'Pangging', role: 'Beauty & Spa Specialist' },
  ];

  // ── Availability helpers ──────────────────────────────────
  const getBookingsForDate = (dateKey) =>
    (appointments || []).filter(
      apt => apt.date === dateKey && apt.status !== 'cancelled'
    );

  const getBookedTimesForDate = (dateKey) =>
    getBookingsForDate(dateKey).map(apt => apt.time);

  const isDayFull = (dateKey) =>
    getBookingsForDate(dateKey).length >= MAX_PER_DAY;

  const isTimeBooked = (dateKey, time) =>
    getBookedTimesForDate(dateKey).includes(time);

  const getRemainingSlots = (dateKey) =>
    MAX_PER_DAY - getBookingsForDate(dateKey).length;

  // ── Date validation ───────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];

  const handleDateChange = (e) => {
    const val = e.target.value;
    setDateError('');
    setFormData(prev => ({ ...prev, date: val, time: '' }));
    if (val && isDayFull(val)) {
      setDateError('This date is fully booked (8/8 clients). Please choose another date.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 3) {
      if (!formData.time) {
        alert('Please select a time slot.');
        return;
      }
      if (isDayFull(formData.date)) {
        setDateError('This date is fully booked. Please choose another date.');
        return;
      }
      if (isTimeBooked(formData.date, formData.time)) {
        alert('This time slot is already taken. Please choose another time.');
        return;
      }

      if (isHomeService && pendingHS) {
        // Save as Home Service appointment with all details
        saveAppointment({
          ...formData,
          type:             'homeservice',
          status:           'pending',
          createdAt:        new Date().toISOString(),
          hsServices:       pendingHS.services,
          hsServiceDetails: pendingHS.serviceDetails,
          address:          pendingHS.address,
          imagePreview:     pendingHS.imagePreview,
          grandTotal:       pendingHS.grandTotal,
          serviceTotal:     pendingHS.serviceTotal,
        });
        localStorage.removeItem('pendingHomeService');
      } else {
        saveAppointment({
          ...formData,
          type:      'salon',
          status:    'pending',
          createdAt: new Date().toISOString(),
        });
      }

      setSuccess(true);
      setTimeout(() => setCurrentPage('appointments'), 2500);

    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => step > 1 && setStep(s => s - 1);

  const selectedService   = services.find(s => s.id === formData.service);
  const selectedSpecialist = specialists.find(s => s.id === formData.specialist);

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{isHomeService ? '🏠 Complete Home Service Booking' : 'Book Your Appointment'}</h1>
        <p>{isHomeService ? 'Fill in your details to confirm your home service' : 'Schedule your perfect nail appointment'}</p>
      </div>

      {/* Home Service Banner */}
      {isHomeService && (
        <div className="hs-active-banner">
          <span>🏠</span>
          <div>
            <p className="hs-banner-title">Home Service Request</p>
            <p className="hs-banner-services">
              {pendingHS.serviceDetails?.map(s => s.name).join(', ')}
            </p>
            <p className="hs-banner-addr">📍 {pendingHS.address}</p>
          </div>
          <p className="hs-banner-total">₱{pendingHS.grandTotal?.toLocaleString()}.00</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          {isHomeService
            ? '🏠 Home Service booked! Redirecting to your appointments...'
            : '✓ Appointment booked! Redirecting to your appointments...'}
        </div>
      )}

      <div className="booking-container">
        {/* Progress Steps */}
        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span><p>Personal Info</p>
          </div>
          <div className={`progress-line ${step > 1 ? 'active' : ''}`} />
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span><p>Specialist</p>
          </div>
          <div className={`progress-line ${step > 2 ? 'active' : ''}`} />
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span><p>Date & Time</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <div className="form-step">
              <h2>Tell Us About Yourself</h2>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text" id="name" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Juan Dela Cruz" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="09XX-XXX-XXXX" required
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Service & Specialist ── */}
          {step === 2 && (
            <div className="form-step">
              <h2>{isHomeService ? 'Choose Your Specialist' : 'Choose Service & Specialist'}</h2>

              {/* Service Dropdown — HIDDEN kung Home Service */}
              {!isHomeService && (
                <div className="form-group">
                  <label htmlFor="service">Service *</label>
                  <select
                    id="service" name="service"
                    value={formData.service} onChange={handleChange} required
                  >
                    <option value="">Select a service...</option>
                    {services.map(svc => (
                      <option key={svc.id} value={svc.id}>
                        {svc.name} — ₱{svc.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Home Service — show selected services summary */}
              {isHomeService && (
                <div className="hs-services-recap">
                  <p className="hs-recap-title">🏠 Your Selected Home Services:</p>
                  <div className="hs-recap-list">
                    {pendingHS.serviceDetails?.map(svc => (
                      <div key={svc.id} className="hs-recap-item">
                        <span>{svc.name}</span>
                        <span>₱{svc.price.toLocaleString()}.00</span>
                      </div>
                    ))}
                    <div className="hs-recap-divider" />
                    <div className="hs-recap-item muted">
                      <span>🚗 Transportation Fare</span>
                      <span>₱150.00</span>
                    </div>
                    <div className="hs-recap-item muted">
                      <span>💼 Home Service Charge</span>
                      <span>₱100.00</span>
                    </div>
                    <div className="hs-recap-divider" />
                    <div className="hs-recap-item total">
                      <span>💳 Total</span>
                      <span>₱{pendingHS.grandTotal?.toLocaleString()}.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Specialist Cards */}
              <div className="form-group">
                <label>Specialist *</label>
                <div className="specialist-cards">
                  {specialists.map(spec => (
                    <div
                      key={spec.id}
                      className={`specialist-card ${formData.specialist === spec.id ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, specialist: spec.id }))}
                    >
                      <div className="spec-avatar">
                        {spec.id === 'rose' ? '👩' : '👱‍♀️'}
                      </div>
                      <div className="spec-info">
                        <p className="spec-name">{spec.name}</p>
                        <p className="spec-role">{spec.role}</p>
                      </div>
                      {formData.specialist === spec.id && (
                        <span className="spec-check">✓</span>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="text" name="specialist"
                  value={formData.specialist}
                  onChange={() => {}}
                  required style={{ display: 'none' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Special Requests (Optional)</label>
                <textarea
                  id="notes" name="notes"
                  value={formData.notes} onChange={handleChange}
                  placeholder="Any special requests or preferred nail design?"
                  rows="3"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Date & Time ── */}
          {step === 3 && (
            <div className="form-step">
              <h2>Select Date & Time</h2>

              <div className="form-group">
                <label htmlFor="date">Preferred Date *</label>
                <input
                  type="date" id="date" name="date"
                  value={formData.date} onChange={handleDateChange}
                  min={today} required
                />
                {dateError && <p className="field-error">⚠️ {dateError}</p>}
                {formData.date && !isDayFull(formData.date) && (
                  <p className="slots-remaining">
                    ✅ {getRemainingSlots(formData.date)} slot{getRemainingSlots(formData.date) !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>

              {formData.date && !isDayFull(formData.date) && (
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <div className="time-slots-grid">
                    {TIME_SLOTS.map(slot => {
                      const booked   = isTimeBooked(formData.date, slot);
                      const selected = formData.time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`time-slot-btn ${booked ? 'booked' : 'free'} ${selected ? 'selected' : ''}`}
                          onClick={() => !booked && setFormData(prev => ({ ...prev, time: slot }))}
                          disabled={booked}
                        >
                          {slot}
                          {booked    && <span> 🔴</span>}
                          {selected  && !booked && <span> ✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="time-legend">
                    <span className="legend-free">🟢 Available</span>
                    <span className="legend-booked">🔴 Booked</span>
                  </div>
                </div>
              )}

              {/* Appointment Summary */}
              {formData.date && formData.time && (
                <div className="appointment-summary">
                  <h3>📋 Appointment Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-row">
                      <span className="summary-label">👤 Name</span>
                      <span className="summary-value">{formData.name}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">📞 Phone</span>
                      <span className="summary-value">{formData.phone}</span>
                    </div>

                    {/* Show home service details OR regular service */}
                    {isHomeService ? (
                      <>
                        <div className="summary-row">
                          <span className="summary-label">🏠 Type</span>
                          <span className="summary-value">Home Service</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">💅 Services</span>
                          <span className="summary-value">
                            {pendingHS.serviceDetails?.map(s => s.name).join(', ')}
                          </span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">📍 Address</span>
                          <span className="summary-value">{pendingHS.address}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">💳 Total</span>
                          <span className="summary-value">₱{pendingHS.grandTotal?.toLocaleString()}.00</span>
                        </div>
                      </>
                    ) : (
                      <div className="summary-row">
                        <span className="summary-label">💅 Service</span>
                        <span className="summary-value">
                          {selectedService ? `${selectedService.name} — ₱${selectedService.price}` : '—'}
                        </span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span className="summary-label">👩 Specialist</span>
                      <span className="summary-value">
                        {selectedSpecialist ? selectedSpecialist.name : '—'}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">📅 Date</span>
                      <span className="summary-value">{formData.date}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">⏰ Time</span>
                      <span className="summary-value">{formData.time}</span>
                    </div>
                    {formData.notes && (
                      <div className="summary-row">
                        <span className="summary-label">📝 Notes</span>
                        <span className="summary-value">{formData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="form-buttons">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                ← Back
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={step === 3 && (!!dateError || isDayFull(formData.date))}
            >
              {step === 3
                ? isHomeService ? '🏠 Confirm Home Service' : '✓ Confirm Booking'
                : 'Next →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Booking;