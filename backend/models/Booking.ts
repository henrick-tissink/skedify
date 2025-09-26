import { pool } from "../db.ts";
import type { Booking, CreateBookingRequest } from "../types/database.ts";

export class BookingModel {
  static async findBySessionTypeUserId(userId: number): Promise<Booking[]> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Booking>(
        `SELECT b.* FROM bookings b
         JOIN session_types st ON b.session_type_id = st.id
         WHERE st.user_id = $1
         ORDER BY b.start_time DESC`,
        [userId]
      );
      
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<Booking | null> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Booking>(
        `SELECT * FROM bookings WHERE id = $1`,
        [id]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async create(sessionTypeId: number, bookingData: CreateBookingRequest): Promise<Booking> {
    const { first_name, last_name, email, phone, start_time } = bookingData;
    
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Booking>(
        `INSERT INTO bookings (session_type_id, booked_by_first_name, booked_by_last_name, booked_by_email, booked_by_phone, start_time)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [sessionTypeId, first_name, last_name, email, phone, new Date(start_time)]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<Booking | null> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Booking>(
        `UPDATE bookings 
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async checkBookingConflict(sessionTypeId: number, startTime: Date, durationMinutes: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      
      const result = await client.queryObject(
        `SELECT 1 FROM bookings b
         JOIN session_types st ON b.session_type_id = st.id
         WHERE st.user_id = (SELECT user_id FROM session_types WHERE id = $1)
         AND b.status IN ('pending', 'approved')
         AND (
           (b.start_time <= $2 AND (b.start_time + INTERVAL '1 minute' * st.duration_minutes) > $2) OR
           (b.start_time < $3 AND (b.start_time + INTERVAL '1 minute' * st.duration_minutes) >= $3) OR
           (b.start_time >= $2 AND (b.start_time + INTERVAL '1 minute' * st.duration_minutes) <= $3)
         )`,
        [sessionTypeId, startTime, endTime]
      );
      
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  static async getAvailableSlots(sessionTypeId: number, date: Date): Promise<Date[]> {
    const client = await pool.connect();
    try {
      const sessionType = await client.queryObject<{ user_id: number; duration_minutes: number }>(
        `SELECT user_id, duration_minutes FROM session_types WHERE id = $1`,
        [sessionTypeId]
      );

      if (sessionType.rows.length === 0) {
        return [];
      }

      const { user_id, duration_minutes } = sessionType.rows[0];

      const startOfDay = new Date(date);
      startOfDay.setHours(9, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(17, 0, 0, 0);

      const existingBookings = await client.queryObject<{ start_time: Date }>(
        `SELECT start_time FROM bookings b
         JOIN session_types st ON b.session_type_id = st.id
         WHERE st.user_id = $1
         AND b.status IN ('pending', 'approved')
         AND DATE(b.start_time) = DATE($2)`,
        [user_id, date]
      );

      const existingEvents = await client.queryObject<{ start_time: Date; end_time: Date }>(
        `SELECT start_time, end_time FROM calendar_events ce
         JOIN calendars c ON ce.calendar_id = c.id
         WHERE c.user_id = $1
         AND DATE(ce.start_time) = DATE($2)`,
        [user_id, date]
      );

      const availableSlots: Date[] = [];
      const slotInterval = 15;

      for (let time = new Date(startOfDay); time < endOfDay; time.setMinutes(time.getMinutes() + slotInterval)) {
        const slotStart = new Date(time);
        const slotEnd = new Date(time.getTime() + duration_minutes * 60000);

        let isAvailable = true;

        for (const booking of existingBookings.rows) {
          const bookingEnd = new Date(booking.start_time.getTime() + duration_minutes * 60000);
          if (
            (slotStart >= booking.start_time && slotStart < bookingEnd) ||
            (slotEnd > booking.start_time && slotEnd <= bookingEnd) ||
            (slotStart <= booking.start_time && slotEnd >= bookingEnd)
          ) {
            isAvailable = false;
            break;
          }
        }

        if (isAvailable) {
          for (const event of existingEvents.rows) {
            if (
              (slotStart >= event.start_time && slotStart < event.end_time) ||
              (slotEnd > event.start_time && slotEnd <= event.end_time) ||
              (slotStart <= event.start_time && slotEnd >= event.end_time)
            ) {
              isAvailable = false;
              break;
            }
          }
        }

        if (isAvailable) {
          availableSlots.push(new Date(slotStart));
        }
      }

      return availableSlots;
    } finally {
      client.release();
    }
  }
}