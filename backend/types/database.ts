export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  created_at: Date;
}

export interface Calendar {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface SessionType {
  id: number;
  user_id: number;
  name: string;
  duration_minutes: number;
  unique_link: string;
  created_at: Date;
}

export interface Booking {
  id: number;
  session_type_id: number;
  booked_by_first_name: string;
  booked_by_last_name: string;
  booked_by_email?: string;
  booked_by_phone?: string;
  start_time: Date;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
}

export interface CalendarEvent {
  id: number;
  calendar_id: number;
  booking_id?: number;
  title: string;
  start_time: Date;
  end_time: Date;
  description?: string;
  created_at: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateCalendarRequest {
  name: string;
  description?: string;
}

export interface CreateSessionTypeRequest {
  name: string;
  duration_minutes: number;
}

export interface CreateBookingRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  start_time: string;
}

export interface CreateEventRequest {
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
}