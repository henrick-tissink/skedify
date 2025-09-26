# Skedify - Scheduling Application

A modern, mobile-friendly scheduling application built with React and Deno that allows users to manage calendars, create session types, and accept bookings through unique public links.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Calendar Management**: Create and manage multiple calendars with events
- **Session Types**: Define bookable session types with custom duration and unique links
- **Public Booking**: Visitors can book sessions through public links without authentication
- **Booking Management**: Approve or reject booking requests with calendar integration
- **Mobile-Friendly**: Responsive design optimized for smartphones and tablets

## Tech Stack

### Backend (Deno)
- **Runtime**: Deno with TypeScript
- **Framework**: Oak for HTTP routing and middleware
- **Database**: PostgreSQL with native postgres driver
- **Authentication**: JWT tokens with bcrypt password hashing
- **API**: RESTful API design

### Frontend (React)
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Mantine for responsive, mobile-friendly components
- **Routing**: React Router for client-side navigation
- **State Management**: React Context for authentication
- **HTTP Client**: Axios for API communication

## Project Structure

```
Skedify/
├── backend/
│   ├── routes/          # API route handlers
│   ├── models/          # Database models and queries
│   ├── middlewares/     # Authentication and other middleware
│   ├── types/           # TypeScript type definitions
│   ├── db.ts           # Database connection
│   └── server.ts       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context providers
│   │   ├── api/         # API client configuration
│   │   └── types/       # TypeScript interfaces
│   └── public/         # Static assets
└── database/
    └── schema.sql      # Database schema
```

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) (v1.40+)
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) package manager
- [PostgreSQL](https://postgresql.org/) (v13+)

### Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE skedify;
   ```

2. Run the database schema:
   ```bash
   psql -d skedify -f database/schema.sql
   ```

3. Copy environment files:
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   ```

4. Update the `.env` file with your database credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/skedify
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

### Backend Development

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the development server:
   ```bash
   deno task dev
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user

### Calendars (Authenticated)
- `GET /calendars` - List user's calendars
- `POST /calendars` - Create calendar
- `GET /calendars/:id` - Get calendar details
- `PUT /calendars/:id` - Update calendar
- `DELETE /calendars/:id` - Delete calendar
- `GET /calendars/:id/events` - List calendar events
- `POST /calendars/:id/events` - Add event to calendar

### Session Types (Authenticated)
- `GET /session-types` - List user's session types
- `POST /session-types` - Create session type
- `GET /session-types/:id` - Get session type details
- `PUT /session-types/:id` - Update session type
- `DELETE /session-types/:id` - Delete session type

### Bookings
- `GET /book/:uniqueLink` - Get session details and available slots (public)
- `POST /book/:uniqueLink` - Create booking (public)
- `GET /bookings` - List bookings for user's sessions (authenticated)
- `PUT /bookings/:id/approve` - Approve booking (authenticated)
- `PUT /bookings/:id/reject` - Reject booking (authenticated)

## Mobile Optimization

The application is built with mobile-first design principles:

- **Responsive Layout**: Uses CSS Grid and Flexbox for adaptive layouts
- **Touch-Friendly Controls**: Large tap targets (44x44px minimum)
- **Collapsible Navigation**: Mobile burger menu for space efficiency
- **Optimized Forms**: Stacked inputs on mobile, grouped on desktop
- **Performance**: Lazy loading and efficient API calls for mobile networks

## Deployment

### Production Database
Use a managed PostgreSQL service like:
- [Supabase](https://supabase.com/) (recommended)
- [Neon](https://neon.tech/)
- [Railway](https://railway.app/)

### Backend Deployment
Deploy to [Deno Deploy](https://deno.com/deploy):

1. Push your code to a Git repository
2. Connect your repository to Deno Deploy
3. Set environment variables in the Deno Deploy dashboard
4. Deploy automatically on push

### Frontend Deployment
Deploy to [Vercel](https://vercel.com/):

1. Connect your Git repository to Vercel
2. Set build command: `pnpm build`
3. Set output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-api-domain.com`
5. Deploy automatically on push

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details