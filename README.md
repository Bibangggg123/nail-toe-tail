# Nail Salon Appointment Booking System

A beautiful, fully functional web and mobile-responsive appointment booking system for a nail salon with a modern pink color scheme.

## Features

- 🎨 Modern, responsive design with pink color scheme
- 📱 Fully mobile-responsive interface
- 💅 Service browsing and selection
- 👩‍💼 Team specialist profiles with ratings
- 📅 Calendar-based appointment booking
- ⏰ Time slot selection
- 🔔 Appointment management (view, cancel)
- 💾 Local storage for appointments
- 🎯 Multi-step booking process
- ⭐ Rating system for specialists

## Tech Stack

### Frontend
- React 18
- CSS3 with responsive design
- React Hooks for state management
- Local Storage API

### Backend
- Node.js
- Express.js
- CORS enabled

## Project Structure

```
nail-salon-booking/
├── client/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   ├── Services.js
│   │   │   ├── Team.js
│   │   │   ├── Booking.js
│   │   │   └── Appointments.js
│   │   ├── styles/        # CSS files
│   │   │   ├── Home.css
│   │   │   ├── Services.css
│   │   │   ├── Team.css
│   │   │   ├── Booking.css
│   │   │   └── Appointments.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                # Node.js Backend
│   ├── server.js
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   # Root dependencies
   npm install

   # Frontend dependencies
   cd client
   npm install

   # Backend dependencies
   cd ../server
   npm install
   ```

## Running the Application

### Development Mode (Both Frontend and Backend)

From the root directory:
```bash
npm start
```

This runs both the React app (port 3000) and Express server (port 5000) concurrently.

### Running Separately

**Frontend only:**
```bash
npm run client
```
Starts React on http://localhost:3000

**Backend only:**
```bash
npm run server
```
Starts server on http://localhost:5000

## Responsive Breakpoints

- **Desktop**: 1200px and up
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## Color Scheme

- Primary Pink: `#d98ba4`
- Light Pink: `#f5d5e3`
- Dark Pink: `#b8647a`
- Accent Pink: `#e8b3d3`
- Text Dark: `#333`
- Text Light: `#666`

## Features by Page

### Home
- Hero section with call-to-action
- Service preview with 6 main services
- Team specialist preview
- Features showcase
- CTA section

### Services
- Browse all available services
- Filter by category (All, Manicure, Pedicure, Nail Art, Care)
- View service details, duration, and pricing

### Team
- View all specialist profiles
- Rating system (4.4-4.9 stars)
- Review counts
- Specialty tags
- Quick booking button per specialist

### Booking
- Multi-step form (3 steps)
- Step 1: Personal information
- Step 2: Service and specialist selection
- Step 3: Date and time selection
- Visual appointment summary
- Time slot availability

### My Appointments
- View all booked appointments
- Appointment details (client, service, specialist, time)
- Cancel appointments with confirmation
- Empty state when no appointments

## API Endpoints (Backend)

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Reference Data
- `GET /api/services` - Get all services
- `GET /api/specialists` - Get all specialists
- `GET /api/time-slots` - Get available time slots
- `GET /api/health` - Health check

## Usage

1. **Navigate to Home** - View overview of services
2. **Browse Services** - Click "Services" to see all offerings
3. **Meet Team** - Check out specialists and their specialties
4. **Book Appointment** - Click "Book Now" to start 3-step booking process
5. **View Appointments** - See and manage your booked appointments

## Features Implemented

✅ Responsive design
✅ Pink color scheme
✅ Service browsing
✅ Team profiles
✅ Appointment booking form
✅ Time slot selection
✅ Appointment management
✅ Local storage persistence
✅ Mobile navigation with hamburger menu
✅ Back-end API structure
✅ Progress indicator for booking
✅ Confirmation messages
✅ Error handling

## Future Enhancements

- Database integration (MongoDB)
- User authentication
- Email notifications
- Payment integration
- Review and rating system
- Staff availability calendar
- SMS confirmations
- Admin dashboard
- Analytics

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized CSS with mobile-first approach
- Efficient React rendering
- Local storage for instant data persistence
- Fast API responses

## License

MIT License

## Contact

For inquiries about the Nails Beauty Salon Booking System, please contact our team.

---

Happy Booking! 💅✨
