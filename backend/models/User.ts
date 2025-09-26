import { pool } from "../db.ts";
import { hash, compare } from "bcrypt";
import type { User, CreateUserRequest } from "../types/database.ts";

export class UserModel {
  static async create(userData: CreateUserRequest): Promise<User> {
    const { username, email, password, first_name, last_name } = userData;
    
    const passwordHash = await hash(password);
    
    const client = await pool.connect();
    try {
      const result = await client.queryObject<User>(
        `INSERT INTO users (username, email, password_hash, first_name, last_name)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [username, email, passwordHash, first_name, last_name]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<User>(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject<User>(
        `SELECT * FROM users WHERE id = $1`,
        [id]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  static async emailExists(email: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject(
        `SELECT 1 FROM users WHERE email = $1`,
        [email]
      );
      
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  static async usernameExists(username: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.queryObject(
        `SELECT 1 FROM users WHERE username = $1`,
        [username]
      );
      
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}