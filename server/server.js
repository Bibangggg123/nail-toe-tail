const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default PORT
const PORT = process.env.PORT || 5000;

// In-memory storage for appointments (for local testing)
let appointments = [];

// Routes
// Get all appointments
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// Create appointment
app.post('/api/appointments', (req, res) => {
  const appointment = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  appointments.push(appointment);
  res.status(201).json(appointment);
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  const appointment = appointments.find(apt => apt.id === parseInt(req.params.id));
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  res.json(appointment);
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const index = appointments.findIndex(apt => apt.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  const deleted = appointments.splice(index, 1);
  res.json(deleted[0]);
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const appointment = appointments.find(apt => apt.id === parseInt(req.params.id));
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  Object.assign(appointment, req.body);
  res.json(appointment);
});

// Services endpoint
app.get('/api/services', (req, res) => {
  const services = [
    { id: 'classic-manicure', name: 'Classic Manicure', price: 25, duration: '30 min' },
    { id: 'gel-manicure', name: 'Gel Manicure', price: 35, duration: '45 min' },
    { id: 'acrylic-nails', name: 'Acrylic Nails', price: 40, duration: '60 min' },
    { id: 'nail-art', name: 'Nail Art Design', price: 30, duration: '45 min' },
    { id: 'pedicure', name: 'Pedicure', price: 30, duration: '45 min' },
    { id: 'french-tips', name: 'French Tips', price: 25, duration: '30 min' }
  ];
  res.json(services);
});

// Specialists endpoint
app.get('/api/specialists', (req, res) => {
  const specialists = [
    { id: 'janet', name: 'Janet Jones', role: 'Senior Hair & Nail Specialist', rating: 4.5 },
    { id: 'sarah', name: 'Sarah Williams', role: 'Senior Nail Artist', rating: 4.8 },
    { id: 'emma', name: 'Emma Davis', role: 'Gel Specialist', rating: 4.6 },
    { id: 'lisa', name: 'Lisa Anderson', role: 'Beauty Specialist', rating: 4.7 },
    { id: 'maria', name: 'Maria Chen', role: 'Acrylic Specialist', rating: 4.9 },
    { id: 'jessica', name: 'Jessica Brown', role: 'Nail Care Technician', rating: 4.4 }
  ];
  res.json(specialists);
});

// Time slots endpoint
app.get('/api/time-slots', (req, res) => {
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];
  res.json(timeSlots);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Nail-ToeTail nail studio API - Welcome' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
});
