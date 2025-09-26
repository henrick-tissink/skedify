import { pool } from "../db.ts";
import type { SessionType, CreateSessionTypeRequest } from "../types/database.ts";

export class SessionTypeModel {
  static async findByUserId(userId: number): Promise<SessionType[]> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<SessionType>(
        `SELECT * FROM session_types WHERE user_id = $1 ORDER BY created_at`,
        [userId]
      );
      
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number, userId: number): Promise<SessionType | null> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<SessionType>(
        `SELECT * FROM session_types WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async findByUniqueLink(uniqueLink: string): Promise<SessionType | null> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<SessionType>(
        `SELECT * FROM session_types WHERE unique_link = $1`,
        [uniqueLink]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async create(userId: number, sessionData: CreateSessionTypeRequest): Promise<SessionType> {
    const { name, duration_minutes } = sessionData;
    
    const client = await pool.connect();
    try {
      const result = await client.queryObject<SessionType>(
        `INSERT INTO session_types (user_id, name, duration_minutes)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, name, duration_minutes]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id: number, userId: number, sessionData: CreateSessionTypeRequest): Promise<SessionType | null> {
    const { name, duration_minutes } = sessionData;
    
    const client = await pool.connect();
    try {
      const result = await client.queryObject<SessionType>(
        `UPDATE session_types 
         SET name = $1, duration_minutes = $2
         WHERE id = $3 AND user_id = $4
         RETURNING *`,
        [name, duration_minutes, id, userId]
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
        `DELETE FROM session_types WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}