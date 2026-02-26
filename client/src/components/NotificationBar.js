import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import '../styles/NotificationBar.css';

// Service and Specialist name maps
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

function NotificationBar({ appointments }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('readNotifIds');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Detail modal state
  const [selectedApt, setSelectedApt] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(null);

  useEffect(() => {
    const notifs = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    appointments.forEach(apt => {
      if (apt.status === 'cancelled') return;

      const createdAt = new Date(apt.createdAt);
      const minutesAgo = (Date.now() - createdAt.getTime()) / 60000;

      // 🏠 Home Service Request notification
      if (apt.type === 'homeservice' && minutesAgo < 1440) {
        notifs.push({
          id: `hs-${apt.id}`,
          type: 'homeservice',
          icon: '🏠',
          title: 'New Home Service Request!',
          message: `${apt.name || 'A client'} requested home service at ${apt.address ? apt.address.substring(0, 40) + '...' : 'their address'}`,
          time: createdAt,
          aptId: apt.id
        });
      }

      // 🆕 New Booking notification
      if (apt.type === 'salon' && minutesAgo < 1440) {
        notifs.push({
          id: `new-${apt.id}`,
          type: 'new',
          icon: '🆕',
          title: 'New Booking!',
          message: `${apt.name} booked ${apt.service ? apt.service.replace(/-/g, ' ') : 'a service'} on ${apt.date} at ${apt.time}`,
          time: createdAt,
          aptId: apt.id
        });
      }

      // ⏰ Tomorrow reminder
      if (apt.date) {
        const aptDate = new Date(apt.date + 'T00:00:00');
        const diffDays = Math.ceil((aptDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          notifs.push({
            id: `remind-${apt.id}`,
            type: 'reminder',
            icon: '⏰',
            title: 'Appointment Tomorrow!',
            message: `${apt.name} has an appointment tomorrow at ${apt.time}`,
            time: new Date(),
            aptId: apt.id
          });
        }

        if (diffDays === 0) {
          notifs.push({
            id: `today-${apt.id}`,
            type: 'today',
            icon: '📅',
            title: 'Appointment Today!',
            message: `${apt.name} has an appointment today at ${apt.time}`,
            time: new Date(),
            aptId: apt.id
          });
        }
      }
    });

    notifs.sort((a, b) => b.time - a.time);
    setNotifications(notifs);
    const unread = notifs.filter(n => !readIds.includes(n.id)).length;
    setUnreadCount(unread);
  }, [appointments, readIds]);

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem('readNotifIds', JSON.stringify(allIds));
    setUnreadCount(0);
  };

  const markOneRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      localStorage.setItem('readNotifIds', JSON.stringify(updated));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    setIsOpen(false);
  };

  const formatTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1)    return 'Just now';
    if (diff < 60)   return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };
  
  // Handle notification click - open detail modal
  const handleNotificationClick = (notif) => {
    markOneRead(notif.id);
    const apt = appointments.find(a => a.id === notif.aptId);
    if (apt) {
      setSelectedApt(apt);
      setShowDetailModal(true);
      setIsOpen(false);
    }
  };
  
  // Helper functions for detail modal
  const getServiceName = (id) => SERVICES[id] || id || 'Service';
  const getSpecialistName = (id) => SPECIALISTS[id] || id || 'Specialist';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="detail-badge confirmed">✓ Confirmed</span>;
      case 'cancelled': return <span className="detail-badge cancelled">✕ Cancelled</span>;
      default: return <span className="detail-badge pending">⏳ Pending</span>;
    }
  };

  return (
    <div className="notif-wrapper">
      <button
        className="notif-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Icon icon="ic:baseline-notifications-active" width="28" height="28" color="#fff" />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notif-backdrop" onClick={() => setIsOpen(false)} />
          <div className="notif-panel">
            <div className="notif-panel-header">
              <h3><Icon icon="material-symbols:notifications-unread" width="20" height="20" style={{verticalAlign: 'middle', marginRight: '6px'}} />Notifications</h3>
              <div className="notif-header-actions">
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllRead}>Mark all read</button>
                )}
                {notifications.length > 0 && (
                  <button className="clear-btn" onClick={clearAll}>Clear all</button>
                )}
              </div>
            </div>

            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <span>🎉</span>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`notif-item ${notif.type} ${readIds.includes(notif.id) ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="notif-icon">{notif.icon}</div>
                    <div className="notif-body">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-message">{notif.message}</p>
                      <p className="notif-time">{formatTime(notif.time)}</p>
                    </div>
                    <div className="notif-view-btn">View →</div>
                    {!readIds.includes(notif.id) && <div className="notif-unread-dot" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Appointment Detail Modal */}
      {showDetailModal && selectedApt && (
        <div className="detail-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="detail-modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            
            <div className="detail-modal-header">
              <div className="detail-modal-icon">
                {selectedApt.type === 'homeservice' ? '🏠' : '💅'}
              </div>
              <div>
                <h2>
                  {selectedApt.type === 'homeservice' ? 'Home Service Booking' : 'Salon Appointment'}
                </h2>
                <p className="detail-modal-subtitle">
                  Booked {formatTime(selectedApt.createdAt)}
                </p>
              </div>
              {getStatusBadge(selectedApt.status)}
            </div>
            
            <div className="detail-modal-body">
              {/* Client Information */}
              <div className="detail-section">
                <h3>👤 Client Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{selectedApt.name || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{selectedApt.phone || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedApt.email || '—'}</span>
                  </div>
                </div>
              </div>
              
              {/* Service Details */}
              <div className="detail-section">
                <h3>💅 Service Details</h3>
                <div className="detail-grid">
                  {selectedApt.type === 'homeservice' ? (
                    <>
                      <div className="detail-item full-width">
                        <span className="detail-label">Services</span>
                        <span className="detail-value">
                          {selectedApt.hsServiceDetails?.map(s => s.name).join(', ') || '—'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Service Total</span>
                        <span className="detail-value">₱{selectedApt.serviceTotal?.toLocaleString()}.00</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Grand Total</span>
                        <span className="detail-value highlight">₱{selectedApt.grandTotal?.toLocaleString()}.00</span>
                      </div>
                    </>
                  ) : (
                    <div className="detail-item">
                      <span className="detail-label">Service</span>
                      <span className="detail-value">{getServiceName(selectedApt.service)}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Specialist</span>
                    <span className="detail-value">{getSpecialistName(selectedApt.specialist)}</span>
                  </div>
                </div>
              </div>
              
              {/* Schedule */}
              <div className="detail-section">
                <h3>📅 Schedule</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{formatDate(selectedApt.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{selectedApt.time || '—'}</span>
                  </div>
                </div>
              </div>
              
              {/* Address (Home Service only) */}
              {selectedApt.type === 'homeservice' && selectedApt.address && (
                <div className="detail-section">
                  <h3>📍 Address</h3>
                  <p className="detail-address">{selectedApt.address}</p>
                </div>
              )}
              
              {/* Notes */}
              {selectedApt.notes && (
                <div className="detail-section">
                  <h3>📝 Notes</h3>
                  <p className="detail-notes">{selectedApt.notes}</p>
                </div>
              )}
              
              {/* Design Image (Home Service) */}
              {selectedApt.imagePreview && (
                <div className="detail-section">
                  <h3>🎨 Nail Design Reference</h3>
                  <div className="detail-image-wrapper">
                    <img 
                      src={selectedApt.imagePreview} 
                      alt="Nail design" 
                      className="detail-image"
                      onClick={() => setImageZoom(selectedApt.imagePreview)}
                    />
                    <button 
                      className="detail-zoom-btn"
                      onClick={() => setImageZoom(selectedApt.imagePreview)}
                    >
                      🔍 View Full Size
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Image Zoom Modal */}
      {imageZoom && (
        <div className="image-zoom-overlay" onClick={() => setImageZoom(null)}>
          <div className="image-zoom-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-zoom-close" onClick={() => setImageZoom(null)}>✕</button>
            <img src={imageZoom} alt="Nail design full" className="image-zoom-img" />
            <p className="image-zoom-caption">🎨 Client's Nail Design Reference</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBar;