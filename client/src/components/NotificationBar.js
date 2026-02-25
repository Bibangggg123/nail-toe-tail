import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import '../styles/NotificationBar.css';

function NotificationBar({ appointments }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('readNotifIds');
    return saved ? JSON.parse(saved) : [];
  });

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
                    onClick={() => markOneRead(notif.id)}
                  >
                    <div className="notif-icon">{notif.icon}</div>
                    <div className="notif-body">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-message">{notif.message}</p>
                      <p className="notif-time">{formatTime(notif.time)}</p>
                    </div>
                    {!readIds.includes(notif.id) && <div className="notif-unread-dot" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBar;