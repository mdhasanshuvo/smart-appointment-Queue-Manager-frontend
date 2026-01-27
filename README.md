# Smart Appointment & Queue Manager - Frontend

A modern, production-ready React frontend for managing appointments, staff availability, and waiting queues with real-time conflict detection and analytics.

## 🚀 Features

- **User Authentication**
  - Email/password signup and login
  - Demo login for quick testing
  - JWT-based authentication with protected routes
  
- **Staff Management**
  - Create, update, and delete staff members
  - Track service types and availability status
  - Monitor daily capacity and appointment load
  
- **Service Management**
  - Define services with duration and staff requirements
  - CRUD operations with validation
  
- **Appointment Booking**
  - Real-time conflict detection
  - Automatic queue placement when staff unavailable
  - Date/time selection with staff assignment
  - Complete, no-show, and cancel status updates
  
- **Waiting Queue Management**
  - Visual queue positions (1st, 2nd, 3rd...)
  - Assign appointments from queue to available staff
  - Automatic position updates
  
- **Dashboard Analytics**
  - Real-time appointment statistics
  - Staff load visualization
  - Activity logs with timestamps
  - Queue overview

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: CSS3 (Responsive design)

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend API running (see backend repository)

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

For production, update to your deployed backend URL:

```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app/api/v1
```

## 🚀 Installation

```bash
npm install
```

## 💻 Development

Run the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 👀 Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx       # Main layout with navigation
│   ├── Modal.jsx        # Reusable modal component
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   ├── Spinner.jsx      # Loading indicator
│   └── Toast.jsx        # Notification system
├── context/             # React Context providers
│   └── AuthContext.jsx  # Authentication state management
├── pages/               # Page components
│   ├── Login.jsx        # Login page
│   ├── Signup.jsx       # Registration page
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Staff.jsx        # Staff management
│   ├── Services.jsx     # Service management
│   ├── Appointments.jsx # Appointment booking
│   └── Queue.jsx        # Queue management
├── services/            # API service layer
│   ├── api.js           # Axios instance with interceptors
│   └── index.js         # All service functions
├── App.jsx              # Main app component with routing
└── main.jsx             # App entry point
```

## 🔐 Authentication Flow

1. User logs in → JWT token stored in localStorage
2. Axios interceptor adds token to all requests
3. Protected routes check authentication
4. 401 responses redirect to login

## 🎨 Key Components

### Layout
Provides consistent navigation and page structure for all authenticated pages.

### Modal
Reusable modal for forms (staff, services, appointments creation/editing).

### Toast Notifications
User feedback for success/error states with auto-dismiss.

### Protected Route
Wrapper component that redirects unauthenticated users to login.

## 📡 API Integration

All API calls go through the service layer:

- `authService` - Authentication operations
- `staffService` - Staff CRUD operations
- `serviceService` - Service CRUD operations
- `appointmentService` - Appointment management
- `queueService` - Queue operations
- `dashboardService` - Analytics data
- `activityLogService` - Activity logs

## 🌐 Deployment (Netlify)

### Option 1: Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

### Option 2: Git Integration

1. Push code to GitHub
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variable: `VITE_API_BASE_URL`
5. Deploy

### SPA Routing

Netlify configuration is included in `netlify.toml` for proper SPA routing.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### CORS Errors
Ensure backend `FRONTEND_URL` environment variable matches your frontend URL.

### 404 on Refresh
Make sure `netlify.toml` is deployed (handles SPA routing).

### API Connection Issues
Verify `VITE_API_BASE_URL` is set correctly in `.env` file.

## 📝 License

MIT

## 🔗 Related Repositories

- [Backend API](https://github.com/mdhasanshuvo/smart-appointment-queue-manager-backend)

## 👨‍💻 Demo Credentials

Use the "Demo Login" button on the login page for instant access without registration.
