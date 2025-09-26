import { pool } from "../db.ts";
import type { Calendar, CalendarEvent, CreateCalendarRequest, CreateEventRequest } from "../types/database.ts";

export class CalendarModel {
  static async findByUserId(userId: number): Promise<Calendar[]> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Calendar>(
        `SELECT * FROM calendars WHERE user_id = $1 ORDER BY created_at`,
        [userId]
      );
      
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number, userId: number): Promise<Calendar | null> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Calendar>(
        `SELECT * FROM calendars WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async create(userId: number, calendarData: CreateCalendarRequest): Promise<Calendar> {
    const { name, description } = calendarData;
    
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Calendar>(
        `INSERT INTO calendars (user_id, name, description)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, name, description]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id: number, userId: number, calendarData: CreateCalendarRequest): Promise<Calendar | null> {
    const { name, description } = calendarData;
    
    const client = await pool.connect();
    try {
      const result = await client.queryObject<Calendar>(
        `UPDATE calendars 
         SET name = $1, description = $2
         WHERE id = $3 AND user_id = $4
         RETURNING *`,
        [name, description, id, userId]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject(
        `DELETE FROM calendars WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  static async getEvents(calendarId: number, userId: number): Promise<CalendarEvent[]> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<CalendarEvent>(
        `SELECT ce.* FROM calendar_events ce
         JOIN calendars c ON ce.calendar_id = c.id
         WHERE ce.calendar_id = $1 AND c.user_id = $2
         ORDER BY ce.start_time`,
        [calendarId, userId]
      );
      
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async addEvent(calendarId: number, userId: number, eventData: CreateEventRequest): Promise<CalendarEvent | null> {
    const { title, start_time, end_time, description } = eventData;
    
    const client = await pool.connect();
    try {
      const calendarExists = await client.queryObject(
        `SELECT 1 FROM calendars WHERE id = $1 AND user_id = $2`,
        [calendarId, userId]
      );
      
      if (calendarExists.rows.length === 0) {
        return null;
      }

      const result = await client.queryObject<CalendarEvent>(
        `INSERT INTO calendar_events (calendar_id, title, start_time, end_time, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [calendarId, title, new Date(start_time), new Date(end_time), description]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async checkTimeConflict(userId: number, startTime: Date, endTime: Date, excludeEventId?: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      let query = `
        SELECT 1 FROM calendar_events ce
        JOIN calendars c ON ce.calendar_id = c.id
        WHERE c.user_id = $1 
        AND (
          (ce.start_time <= $2 AND ce.end_time > $2) OR
          (ce.start_time < $3 AND ce.end_time >= $3) OR
          (ce.start_time >= $2 AND ce.end_time <= $3)
        )
      `;
      
      const params = [userId, startTime, endTime];
      
      if (excludeEventId) {
        query += ` AND ce.id != $4`;
        params.push(excludeEventId);
      }
      
      const result = await client.queryObject(query, params);
      
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}