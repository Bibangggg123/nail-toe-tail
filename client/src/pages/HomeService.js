import React, { useState } from 'react';
import '../styles/HomeService.css';

const HOME_SERVICE_FARE   = 150;
const HOME_SERVICE_CHARGE = 100;

const homeServices = [
  { id: 'classic-manicure', name: 'Classic Manicure',  price: 100,  duration: '1 hr' },
  { id: 'russian-manicure', name: 'Russian Manicure',  price: 100,  duration: '1 hr 30 min' },
  { id: 'gel-manicure',     name: 'Gel Manicure',      price: 250,  duration: '1 hr' },
  { id: 'acrylic-nails',    name: 'Acrylic Nails',     price: 550,  duration: '1 hr' },
  { id: 'nail-art',         name: 'Nail Art Design',   price: 100,  duration: '45 min' },
  { id: 'ombre-gradient',   name: 'Ombre Gradient',    price: 100,  duration: '45 min' },
  { id: 'classic-pedicure', name: 'Classic Pedicure',  price: 130,  duration: '1 hr' },
  { id: 'gel-pedicure',     name: 'Gel Pedicure',      price: 250,  duration: '1 hr' },
  { id: 'french-tips',      name: 'French Tips',       price: 100,  duration: '30 min' },
  { id: 'nail-repair',      name: 'Nail Repair',       price: 100,  duration: '20 min' },
  { id: 'lash-extension',   name: 'Lash Extension',    price: 550,  duration: '90 min' },
  { id: 'lash-firm',        name: 'Lash Firm',         price: 250,  duration: '60 min' },
  { id: 'foot-spa',         name: 'Foot Spa',          price: 380,  duration: '60 min' },
  { id: 'waxing',           name: 'Waxing',            price: 150,  duration: '30 min' },
];

function HomeService({ setCurrentPage, saveHomeService }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [uploadedImage, setUploadedImage]       = useState(null);
  const [imagePreview, setImagePreview]         = useState(null);
  const [uploadError, setUploadError]           = useState('');
  const [address, setAddress]                   = useState('');
  const [note, setNote]                         = useState('');
  const [submitted, setSubmitted]               = useState(false);

  // ── Service selection ─────────────────────────────────────
  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getSelectedDetails = () =>
    homeServices.filter(s => selectedServices.includes(s.id));

  const serviceTotal = getSelectedDetails().reduce((sum, s) => sum + s.price, 0);
  const grandTotal   = serviceTotal + HOME_SERVICE_FARE + HOME_SERVICE_CHARGE;

  // ── Image upload ──────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadError('');
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB.');
      return;
    }

    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setUploadError('');
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      alert('Please select at least one service.');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your address.');
      return;
    }

    // Save home service details to localStorage
    // para ma-access sa Booking page (Book Now)
    const pendingHS = {
      type: 'homeservice',
      services: selectedServices,
      serviceDetails: getSelectedDetails(),
      address: address.trim(),
      note: note.trim(),
      imagePreview: imagePreview,
      grandTotal: grandTotal,
      serviceTotal: serviceTotal,
    };
    localStorage.setItem('pendingHomeService', JSON.stringify(pendingHS));

    setSubmitted(true);
    // Redirect to Book Now para mabutang ang name, email, phone, specialist, date, time
    setTimeout(() => setCurrentPage('booking'), 2000);
  };

  // ── Submitted state ───────────────────────────────────────
  if (submitted) {
    return (
      <div className="hs-page">
        <div className="hs-success">
          <div className="hs-success-icon"></div>
          <h2>Details Saved!</h2>
          <p>
            Redirecting to <strong>Book Now</strong> to complete your<br />
            name, schedule, and specialist...
          </p>
          <div className="hs-success-loader">
            <div className="hs-loader-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hs-page">

      {/* Header */}
      <div className="hs-header">
        <h1> Home Service</h1>
        <p>We come to you! Enjoy premium nail services at your doorstep</p>
      </div>

      {/* Steps indicator */}
      <div className="hs-steps-banner">
        <div className="hs-step active">
          <span className="hs-step-num">1</span>
          <span className="hs-step-label">Choose Services & Address</span>
        </div>
        <div className="hs-step-arrow">→</div>
        <div className="hs-step">
          <span className="hs-step-num">2</span>
          <span className="hs-step-label">Book Now (Name & Schedule)</span>
        </div>
        <div className="hs-step-arrow">→</div>
        <div className="hs-step">
          <span className="hs-step-num">3</span>
          <span className="hs-step-label">Confirmed!</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="hs-info-banner">
        <div className="hs-info-item">
          <span className="hs-info-icon"></span>
          <div>
            <p className="hs-info-label">Transportation Fare</p>
            <p className="hs-info-value">₱{HOME_SERVICE_FARE.toLocaleString()}.00</p>
          </div>
        </div>
        <div className="hs-info-divider" />
        <div className="hs-info-item">
          <span className="hs-info-icon"></span>
          <div>
            <p className="hs-info-label">Home Service Charge</p>
            <p className="hs-info-value">₱{HOME_SERVICE_CHARGE.toLocaleString()}.00</p>
          </div>
        </div>
        <div className="hs-info-divider" />
        <div className="hs-info-item">
          <span className="hs-info-icon"></span>
          <div>
            <p className="hs-info-label">Additional Charges</p>
            <p className="hs-info-value">₱{(HOME_SERVICE_FARE + HOME_SERVICE_CHARGE).toLocaleString()}.00 total</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="hs-form">
        <div className="hs-body">

          {/* LEFT — Service Selection + Upload */}
          <div className="hs-left">
            <div className="hs-card">
              <h2 className="hs-card-title"> Select Services</h2>
              <p className="hs-card-subtitle">Choose one or more services</p>

              <div className="hs-services-list">
                {homeServices.map(svc => {
                  const isSelected = selectedServices.includes(svc.id);
                  return (
                    <div
                      key={svc.id}
                      className={`hs-service-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleService(svc.id)}
                    >
                      <div className="hs-service-check">
                        {isSelected ? '✅' : <span className="hs-empty-check" />}
                      </div>
                      <div className="hs-service-info">
                        <p className="hs-service-name">{svc.name}</p>
                        <p className="hs-service-duration">⏱️ {svc.duration}</p>
                      </div>
                      <p className="hs-service-price">₱{svc.price.toLocaleString()}.00</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Design Upload */}
            <div className="hs-card">
              <h2 className="hs-card-title"> Upload Nail Design (Optional)</h2>
              <p className="hs-card-subtitle">Upload your desired nail design photo</p>

              {!imagePreview ? (
                <label className="hs-upload-area">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <div className="hs-upload-icon">📸</div>
                  <p className="hs-upload-text">Click to upload your design</p>
                  <p className="hs-upload-hint">JPG, PNG, WEBP — max 5MB</p>
                </label>
              ) : (
                <div className="hs-preview-wrapper">
                  <img src={imagePreview} alt="Design preview" className="hs-preview-img" />
                  <div className="hs-preview-info">
                    <p className="hs-preview-name">📎 {uploadedImage?.name}</p>
                    <p className="hs-preview-size">
                      {uploadedImage ? (uploadedImage.size / 1024).toFixed(0) : 0} KB
                    </p>
                    <button
                      type="button"
                      className="hs-remove-btn"
                      onClick={removeImage}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              )}
              {uploadError && <p className="hs-upload-error">⚠️ {uploadError}</p>}
            </div>
          </div>

          {/* RIGHT — Address + Summary + Submit */}
          <div className="hs-right">

            {/* Address */}
            <div className="hs-card">
              <h2 className="hs-card-title">📍 Your Address</h2>
              <p className="hs-card-subtitle">Where should we go?</p>

              <div className="hs-form-group">
                <label>Complete Address *</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House No., Street, Barangay, City"
                  rows={3}
                  required
                />
              </div>

              <div className="hs-form-group">
                <label>Additional Notes (Optional)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Near the sari-sari store, landmark, etc."
                  rows={2}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="hs-card hs-summary-card">
              <h2 className="hs-card-title">📋 Order Summary</h2>

              {selectedServices.length === 0 ? (
                <p className="hs-no-services">No services selected yet</p>
              ) : (
                <>
                  <div className="hs-summary-list">
                    {getSelectedDetails().map(svc => (
                      <div key={svc.id} className="hs-summary-row">
                        <span>{svc.name}</span>
                        <span>₱{svc.price.toLocaleString()}.00</span>
                      </div>
                    ))}
                  </div>

                  <div className="hs-summary-divider" />

                  <div className="hs-summary-row muted">
                    <span> Transportation Fare</span>
                    <span>₱{HOME_SERVICE_FARE.toLocaleString()}.00</span>
                  </div>
                  <div className="hs-summary-row muted">
                    <span> Home Service Charge</span>
                    <span>₱{HOME_SERVICE_CHARGE.toLocaleString()}.00</span>
                  </div>

                  <div className="hs-summary-divider" />

                  <div className="hs-summary-total">
                    <span> Total</span>
                    <span>₱{grandTotal.toLocaleString()}.00</span>
                  </div>
                </>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="hs-submit-btn"
              disabled={selectedServices.length === 0}
            >
              Next: Complete Booking →
            </button>

            <p className="hs-submit-note">
              ✏️ You will fill in your <strong>name, schedule & specialist</strong> on the next step.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HomeService;