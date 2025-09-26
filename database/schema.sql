-- Skedify Database Schema

-- Create the database (run this separately if needed)
-- CREATE DATABASE skedify;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendars table
CREATE TABLE calendars (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session types table
CREATE TABLE session_types (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    unique_link UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enum type for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected');

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    session_type_id INTEGER REFERENCES session_types(id) ON DELETE CASCADE,
    booked_by_first_name VARCHAR(50) NOT NULL,
    booked_by_last_name VARCHAR(50) NOT NULL,
    booked_by_email VARCHAR(100),
    booked_by_phone VARCHAR(20),
    start_time TIMESTAMP NOT NULL,
    status booking_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ensure at least email or phone is provided
    CONSTRAINT check_contact_info CHECK (
        booked_by_email IS NOT NULL OR booked_by_phone IS NOT NULL
    )
);

-- Calendar events table
CREATE TABLE calendar_events (
    id SERIAL PRIMARY KEY,
    calendar_id INTEGER REFERENCES calendars(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_calendars_user_id ON calendars(user_id);
CREATE INDEX idx_session_types_user_id ON session_types(user_id);
CREATE INDEX idx_session_types_unique_link ON session_types(unique_link);
CREATE INDEX idx_bookings_session_type_id ON bookings(session_type_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_calendar_events_calendar_id ON calendar_events(calendar_id);
CREATE INDEX idx_calendar_events_booking_id ON calendar_events(booking_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);

-- Insert default calendar for each user (trigger)
CREATE OR REPLACE FUNCTION create_default_calendar()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO calendars (user_id, name, description)
    VALUES (NEW.id, 'My Calendar', 'Default calendar');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_calendar
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_calendar();