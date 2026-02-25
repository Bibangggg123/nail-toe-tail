import React, { useState } from 'react';
import '../styles/Calendar.css';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
];

const MAX_PER_DAY = 8;

function Calendar({ appointments }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

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
  const bookedTimes = selectedDateKey ? getBookedTimesForDate(selectedDateKey) : [];
  const bookingsForSelected = selectedDateKey ? getBookingsForDate(selectedDateKey) : [];

  return (
    <div className="calendar-page">
      <div className="calendar-header-banner">
        <h1>📅 Appointment Calendar</h1>
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
              </p>
              <div className="time-slots-grid">
                {TIME_SLOTS.map(slot => {
                  const isBooked = bookedTimes.includes(slot);
                  return (
                    <div key={slot} className={`time-slot-item ${isBooked ? 'booked' : 'free'}`}>
                      <span className="slot-time">{slot}</span>
                      <span className="slot-status">
                        {isBooked ? '🔴 Booked' : '🟢 Available'}
                      </span>
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
    </div>
  );
}

export default Calendar;