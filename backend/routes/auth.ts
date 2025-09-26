import { Router } from "oak";
import { create, verify, getNumericDate } from "djwt";
import { load } from "dotenv";
import { UserModel } from "../models/User.ts";
import type { CreateUserRequest, LoginRequest } from "../types/database.ts";

const env = await load();
const JWT_SECRET_STRING = Deno.env.get("JWT_SECRET") || env.JWT_SECRET || "your-super-secret-jwt-key-here";

// Convert the secret string to a CryptoKey for djwt v3
const encoder = new TextEncoder();
const keyData = encoder.encode(JWT_SECRET_STRING);
const JWT_SECRET = await crypto.subtle.importKey(
  "raw",
  keyData,
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

const authRouter = new Router();

authRouter.post("/register", async (ctx) => {
  try {
    const body = await ctx.request.body.json() as CreateUserRequest;
    const { username, email, password, first_name, last_name } = body;

    if (!username || !email || !password) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Username, email, and password are required" };
      return;
    }

    if (password.length < 6) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Password must be at least 6 characters long" };
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid email format" };
      return;
    }

    const emailExists = await UserModel.emailExists(email);
    if (emailExists) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Email already exists" };
      return;
    }

    const usernameExists = await UserModel.usernameExists(username);
    if (usernameExists) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Username already exists" };
      return;
    }

    const user = await UserModel.create({
      username,
      email,
      password,
      first_name,
      last_name,
    });

    const token = await create(
      { alg: "HS256", typ: "JWT" },
      {
        userId: user.id,
        email: user.email,
        exp: getNumericDate(60 * 60 * 24) // 24 hours from now
      },
      JWT_SECRET
    );

    ctx.response.status = 201;
    ctx.response.body = {
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

authRouter.post("/login", async (ctx) => {
  try {
    const body = await ctx.request.body.json() as LoginRequest;
    const { email, password } = body;

    if (!email || !password) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Email and password are required" };
      return;
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid credentials" };
      return;
    }

    const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid credentials" };
      return;
    }

    const token = await create(
      { alg: "HS256", typ: "JWT" },
      {
        userId: user.id,
        email: user.email,
        exp: getNumericDate(60 * 60 * 24) // 24 hours from now
      },
      JWT_SECRET
    );

    ctx.response.status = 200;
    ctx.response.body = {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

authRouter.get("/me", async (ctx) => {
  try {
    const authHeader = ctx.request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { error: "No token provided" };
      return;
    }

    const token = authHeader.slice(7);
    
    try {
      const payload = await verify(token, JWT_SECRET) as { userId: number };
      const user = await UserModel.findById(payload.userId);
      
      if (!user) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      };
    } catch {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid token" };
    }
  } catch (error) {
    console.error("Me route error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

export { authRouter };