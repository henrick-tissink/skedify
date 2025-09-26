export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Calendar {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  calendar_id: number;
  booking_id?: number;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  created_at: string;
}

export interface SessionType {
  id: number;
  user_id: number;
  name: string;
  duration_minutes: number;
  unique_link: string;
  description?: string;
  created_at: string;
}

export interface Booking {
  id: number;
  session_type_id: number;
  booked_by_first_name: string;
  booked_by_last_name: string;
  booked_by_email?: string;
  booked_by_phone?: string;
  start_time: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}