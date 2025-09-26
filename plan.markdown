# Comprehensive Plan for Building the Agentic Tool: Claude Scheduling App

## Project Overview

This project is to build a web application called "Skedify". It allows users to register, manage their calendars, generate unique public links for booking sessions, and approve/reject bookings. The app must be mobile-friendly, ensuring seamless usability on smartphones and tablets.

Key Features:

- User registration and authentication.
- Logged-in users can manage their calendars (view, add, edit, delete events).
- Users can create unique shareable links for specific session types (e.g., "Consultation", "Meeting") with a fixed duration (e.g., 30 minutes, 1 hour).
- Public users (no login required) can access the link and book a time slot by providing first name, last name, and either email or phone number.
- The calendar owner reviews and approves/rejects bookings.
- All bookings integrate into the owner's calendar upon approval.

Non-Functional Requirements:

- **Mobile-Friendly UI**: Optimized for smartphones and tablets with responsive layouts, touch-friendly controls, and fast performance.
- Secure authentication (JWT or sessions).
- Data validation and error handling.
- Basic notifications (e.g., email for approvals, but keep it simple for MVP).

## Tech Stack

- **Frontend**: React (with Hooks and Context for state management), Mantine UI library for components and styling (designed for mobile responsiveness with built-in support for adaptive layouts and touch interactions).
- **Backend**: Deno (lightweight runtime for JavaScript/TypeScript) with Oak framework for routing and middleware.
- **Database**: PostgreSQL for storing users, calendars, sessions, and bookings.
- **Authentication**: JWT (JSON Web Tokens) for secure sessions.
- **Other Tools**:
  - Deno's built-in support for TypeScript.
  - PostgreSQL driver: `postgres` module for Deno.
  - Environment variables for secrets (e.g., via `.env` file).
  - Package Manager: `pnpm` for frontend dependency management.
  - Deployment: Vercel for frontend (optimized for mobile delivery), Deno Deploy for backend, and a managed PostgreSQL like Supabase or Neon.

## Database Schema

Use PostgreSQL. Define the following tables (in SQL schema format for easy implementation):

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Use bcrypt for hashing
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calendars (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,  -- e.g., "Work Calendar"
    description TEXT
);

CREATE TABLE session_types (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,  -- e.g., "1-on-1 Consultation"
    duration_minutes INTEGER NOT NULL,  -- e.g., 30
    unique_link UUID UNIQUE NOT NULL DEFAULT gen_random_uuid()  -- Generated unique link ID
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    session_type_id INTEGER REFERENCES session_types(id) ON DELETE CASCADE,
    booked_by_first_name VARCHAR(50) NOT NULL,
    booked_by_last_name VARCHAR(50) NOT NULL,
    booked_by_email VARCHAR(100),  -- Optional if phone provided
    booked_by_phone VARCHAR(20),   -- Optional if email provided
    start_time TIMESTAMP NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calendar_events (
    id SERIAL PRIMARY KEY,
    calendar_id INTEGER REFERENCES calendars(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,  -- Link to booking if from public link
    title VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    description TEXT
);
```

Notes:

- Ensure at least one of email or phone is provided in bookings (enforce via backend validation).
- Use indexes on foreign keys and frequently queried fields (e.g., user_id, start_time).
- For unique links, the URL can be `/book/{unique_link}`.

## Backend (Deno)

Use Deno with Oak for a simple REST API. Structure the project as:

- `server.ts`: Main entry point.
- `routes/`: Controllers for users, calendars, sessions, bookings.
- `models/`: Database models and queries.
- `middlewares/`: Auth middleware.
- `db.ts`: Database connection pool.

### Key APIs (REST Endpoints)

1. **Authentication**:

   - POST `/register`: { username, email, password, first_name, last_name } → Create user, hash password.
   - POST `/login`: { email, password } → Return JWT token.

2. **Calendars (Authenticated)**:

   - GET `/calendars`: List user's calendars.
   - POST `/calendars`: { name, description } → Create calendar.
   - GET `/calendars/:id`: Get calendar details and events.
   - PUT `/calendars/:id`: Update calendar.
   - DELETE `/calendars/:id`: Delete calendar.
   - GET `/calendars/:id/events`: List events.
   - POST `/calendars/:id/events`: { title, start_time, end_time, description } → Add manual event.

3. **Session Types (Authenticated)**:

   - GET `/session-types`: List user's session types.
   - POST `/session-types`: { name, duration_minutes } → Create and generate unique_link.
   - GET `/session-types/:id`: Get details.
   - PUT `/session-types/:id`: Update.
   - DELETE `/session-types/:id`: Delete.

4. **Public Booking (No Auth)**:

   - GET `/book/:unique_link`: Get session details (type, duration, available slots based on owner's calendar).
   - POST `/book/:unique_link`: { first_name, last_name, email?, phone?, start_time } → Create pending booking. Validate that at least email or phone is provided. Check for conflicts in owner's calendar.

5. **Bookings (Authenticated)**:
   - GET `/bookings`: List pending/approved/rejected bookings for user's sessions.
   - PUT `/bookings/:id/approve`: Approve booking → Add to calendar as event.
   - PUT `/bookings/:id/reject`: Reject booking.

### Implementation Notes

- Use JWT for auth: Middleware to verify token on protected routes.
- Database: Use `deno.land/x/postgres` for connections.
- Handle conflicts: When booking, query calendar_events for overlapping times.
- Available slots: For public booking page, generate available times (e.g., next 30 days, in 15-min increments, excluding existing events).
- Error Handling: Standard HTTP errors (400 for validation, 401 for auth, etc.).
- Security: Sanitize inputs, use prepared statements to prevent SQL injection.
- Mobile Consideration: Ensure API responses are lightweight (e.g., paginate large calendar/event data) to reduce load times on mobile devices.

## Frontend (React + Mantine)

Use Vite with `pnpm` for setup. Mantine for UI components, ensuring mobile-friendliness through responsive design, touch-friendly controls, and performance optimization.

Structure:

- `src/App.tsx`: Routing with React Router.
- `src/components/`: Reusable components (e.g., CalendarView, BookingForm).
- `src/pages/`: Pages like Login, Register, Dashboard, PublicBook.
- `src/context/`: AuthContext for user state and token.
- `src/api/`: Axios or fetch wrappers for backend calls.

### Key Pages/Components

1. **Auth Pages**:

   - **Register**: Form with username, email, password, first/last name. Use Mantine `Form` with responsive styling (e.g., `max-width: 100%`, stack inputs vertically on mobile).
   - **Login**: Email/password form. Store JWT in localStorage/Context. Ensure inputs are large enough for touch interaction (min 48px height per Mantine guidelines).

2. **Dashboard (Authenticated)**:

   - **Sidebar**: Use Mantine `Burger` component for a collapsible mobile menu. On mobile, collapse by default; on desktop, show as a fixed sidebar.
   - **Calendar Management**: List calendars in a Mantine `Card` grid (1-column on mobile, 2+ on desktop). Use Mantine's `Calendar` or `@mantine/dates` DayPicker for event viewing, optimized for touch (large tap targets, swipe gestures).
   - **Session Types**: Display as a scrollable list (`SimpleGrid` with single-column mobile layout). Copyable links with Mantine `CopyButton`. Form for creating sessions uses `Modal` (full-screen on mobile).
   - **Bookings**: Use Mantine `Table` for pending bookings (stacked layout on mobile via `display: block`). Approve/Reject buttons in a `Group` component, sized for touch (min 44px x 44px).

3. **Public Booking Page**:
   - Accessed via `/book/:unique_link`.
   - Display session name and duration in a centered `Text` component (responsive font sizes via Mantine theme).
   - Calendar picker: Use `@mantine/dates` DayPicker, configured for single-date selection with touch-friendly controls (e.g., large buttons, scrollable time slots).
   - Form: First/last name, email or phone (use `TextInput` with validation). Stack vertically on mobile, ensure labels are clear and inputs are touch-friendly.
   - Submit: Use Mantine `Button` with loading state, full-width on mobile for easy tapping.
   - Success message: Use Mantine `Notification` or `Alert` for feedback, auto-dismissing on mobile to avoid clutter.

### Mobile-Friendly Implementation Notes

- **Responsive Design**:
  - Use Mantine's `responsive` utilities (e.g., `SimpleGrid` with `cols={{ base: 1, sm: 2 }}` for adaptive layouts).
  - Apply CSS media queries for fine-tuning (e.g., `@media (max-width: 600px)` to adjust padding, font sizes).
  - Set viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
- **Touch Optimization**:
  - Ensure all interactive elements (buttons, links) have a minimum touch target of 44x44px (Mantine buttons default to touch-friendly sizes).
  - Use Mantine's `ActionIcon` for compact controls (e.g., Approve/Reject) with sufficient padding.
  - Enable swipe gestures for calendar navigation (supported by `@mantine/dates`).
- **Performance**:
  - Lazy-load non-critical components (e.g., calendar view) using React's `Suspense` and `lazy`.
  - Optimize images (if any) with `srcset` for mobile bandwidth.
  - Use React Query to cache API responses, reducing mobile data usage.
- **Accessibility**:
  - Ensure ARIA labels for screen readers (Mantine components include ARIA support).
  - High-contrast text and focus states for mobile accessibility (use Mantine theme's `focusRing`).
- **Testing**:
  - Test on multiple screen sizes (e.g., iPhone SE, iPad, Galaxy S series) using browser dev tools or services like BrowserStack.
  - Verify touch interactions (tap, swipe) and responsiveness in Chrome DevTools' mobile emulator.
  - Check performance with Lighthouse (aim for mobile performance score >80).

### General Frontend Notes

- **State Management**: Use React Context for auth; React Query for data fetching/caching.
- **Routing**: Protected routes for authenticated pages (use a HOC or custom hook).
- **UI Polish**: Use Mantine's theme for consistent colors, typography (e.g., `rem` units for scalable fonts).
- **Calendar Integration**: Use `@mantine/dates` for date pickers and calendars, with mobile-optimized props (e.g., `allowSingleDateInRange` for simple selection).

## Development Plan

1. **Setup**:

   - Initialize Deno backend: `deno init`, add Oak and postgres.
   - Setup PostgreSQL: Local dev with Docker or installed instance.
   - Initialize React frontend: `pnpm create vite claude-frontend --template react-ts`, add Mantine, React Router, Axios. Configure MantineProvider with a mobile-optimized theme (e.g., smaller base font size for mobile).

2. **Backend First**:

   - Implement DB schema and connection.
   - Auth routes.
   - Calendar and event routes.
   - Session types and booking routes.

3. **Frontend**:

   - Auth pages with responsive forms.
   - Dashboard with mobile-friendly sidebar and calendar.
   - Public booking page with touch-friendly calendar and form.
   - Integrate APIs, ensuring lightweight responses for mobile.

4. **Testing**:

   - Unit tests: Deno's built-in testing for backend; Jest for frontend.
   - Manual: Test registration, link generation, public booking, approve/reject on mobile devices (iOS/Android).
   - Mobile-specific: Test responsiveness, touch interactions, and performance (use Lighthouse).

5. **Deployment**:

   - Backend: Deno Deploy.
   - Frontend: Vercel (proxy API calls, optimize for mobile delivery with CDN).
   - Database: Supabase (free tier).

6. **Edge Cases**:
   - Timezone handling: Store times in UTC, convert in UI (use `@mantine/dates` timezone support).
   - Conflicts: Prevent double-booking.
   - Validation: Email/phone formats, enforced in UI and API.
   - Scalability: Basic for MVP; add pagination for large datasets to improve mobile performance.

This plan provides a complete blueprint with explicit mobile-friendly considerations. Feed this Markdown to Claude AI to generate the code step-by-step, starting with backend setup and prioritizing mobile-optimized frontend components.
