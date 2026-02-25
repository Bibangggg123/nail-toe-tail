# Nail Salon Booking App - Quick Start Guide

## 🎉 Welcome to Your Nail Salon Booking App!

Your beautiful, fully functional nail salon appointment booking website is ready with:
- ✨ Modern pink color scheme
- 📱 100% Mobile responsive
- 🎯 Multi-step booking system
- 👩‍💼 Team specialist profiles
- 💅 Service categories and pricing
- 📅 Calendar & time slot selection
- 💾 Persistent appointment storage

## 🚀 Getting Started

### Step 1: Install Dependencies

Open a terminal in the project root folder and run:

```bash
npm run install-all
```

This will install all required packages for both frontend and backend.

### Step 2: Start the Application

From the project root, run:

```bash
npm start
```

This will start both:
- **Frontend** (React): http://localhost:3000
- **Backend** (Express): http://localhost:5000

Wait for both services to start, then open http://localhost:3000 in your browser.

## 📖 Usage Guide

### Home Page
- Hero section with appointment booking CTA
- Service preview (6 main services)
- Team specialist preview
- Why choose us section

### Services Page
- Browse all 10+ services
- Filter by category (Manicure, Pedicure, Nail Art, Care)
- See pricing and duration for each service

### Team Page
- View all 6 specialist profiles
- See ratings (4.4-4.9 stars)
- Check specialties for each member
- Quick book button per specialist

### Booking Page
- **Step 1**: Enter personal info (name, email, phone)
- **Step 2**: Select service and specialist, add notes
- **Step 3**: Pick date and time, review, confirm
- Confirmation message after successful booking

### My Appointments
- View all your booked appointments
- See all appointment details
- Cancel appointments if needed

## 🎨 Color Scheme Used

- Primary Pink: `#d98ba4`
- Light Pink: `#f5d5e3`
- Dark Pink: `#b8647a`
- Accent Pink: `#e8b3d3`

## 📱 Responsive Breakpoints

The app is fully responsive:
- Desktop: 1200px+ (full layout)
- Tablet: 768px-1199px (optimized layout)
- Mobile: 480px-767px (mobile layout)
- Small Mobile: Below 480px (compact layout)

## 🔌 API Endpoints

The backend provides these endpoints:

**Appointments:**
- GET /api/appointments - All appointments
- POST /api/appointments - Create appointment
- DELETE /api/appointments/:id - Cancel appointment

**Reference Data:**
- GET /api/services - All services
- GET /api/specialists - All specialists
- GET /api/time-slots - Available time slots
- GET /api/health - Server health check

## 💾 Data Persistence

- Appointments are saved in your browser's localStorage
- No database setup required
- Data persists across browser sessions
- Perfect for demo and testing

## 🛠️ Running Services Separately

If you want to run frontend or backend only:

```bash
# Frontend only (runs on port 3000)
npm run client

# Backend only (runs on port 5000)
npm run server
```

## ⚠️ Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

**Frontend:** Kill process on port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Backend:** Kill process on port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependencies Not Installing

```bash
# Clear npm cache and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm cache clean --force
npm run install-all
```

### Application Not Starting

1. Check if Node.js is installed: `node --version`
2. Check if npm is installed: `npm --version`
3. Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
4. Restart the app: Stop with Ctrl+C, then run `npm start` again

## 📂 Project Structure

```
nail-salon-booking/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/           # 5 page components
│   │   ├── styles/          # 5 CSS files
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/
│   ├── server.js            # Express API server
│   ├── .env                 # Configuration
│   └── package.json
├── README.md
└── package.json             # Root configuration
```

## ✨ Features Included

✅ 5 main pages (Home, Services, Team, Booking, My Appointments)
✅ 10+ unique services with pricing
✅ 6 specialist profiles with ratings
✅ Multi-step booking form with validation
✅ 17 time slots (9 AM - 5 PM)
✅ Appointment management (create, view, cancel)
✅ Mobile hamburger menu
✅ Progress indicator on booking form
✅ Appointment summary review
✅ Success confirmation messages
✅ Responsive design with 4 breakpoints
✅ Local storage persistence
✅ Express API backend
✅ CORS enabled
✅ Error handling

## 🔮 Next Steps

Ready to enhance your app? Consider:

1. **Database Integration**: Connect MongoDB for persistent storage
2. **User Authentication**: Add login/signup with JWT
3. **Email Notifications**: Send confirmation emails
4. **Payment Processing**: Add Stripe integration
5. **Admin Dashboard**: Manage schedules and appointments
6. **SMS Reminders**: Send appointment reminders
7. **Reviews System**: Let customers leave ratings
8. **Availability**: Block unavailable time slots
9. **Deployment**: Deploy to Heroku, Vercel, or AWS
10. **Analytics**: Track bookings and popular services

## 📞 Support

For issues or questions:
1. Check the README.md file
2. Check browser console for errors (F12)
3. Check server console output
4. Verify all dependencies installed: `npm run install-all`

## 🎯 Testing Checklist

Before launching, test these:

- [ ] Home page loads with all sections
- [ ] Navigation menu works on mobile (hamburger)
- [ ] Services page displays all services with filtering
- [ ] Team page shows all specialists with ratings
- [ ] Booking form completes all 3 steps
- [ ] Appointment shows in "My Appointments"
- [ ] Can cancel an appointment
- [ ] Page is responsive on mobile (use F12 developer tools)
- [ ] Colors match the pink scheme
- [ ] No console errors (F12 > Console)
- [ ] Backend health check works: http://localhost:5000/api/health

## 🚀 Performance Tips

- Clear browser cache if styles don't update
- Use incognito mode to start fresh
- Check DevTools Network tab if API calls fail
- Reduce browser extensions during testing
- Close other tabs to free up memory

---

**Status**: ✅ Ready to Use
**Created**: 2024
**Version**: 1.0.0

Happy Booking! 💅✨
