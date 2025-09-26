import { Context, Next } from "oak";
import { verify } from "djwt";
import { load } from "dotenv";

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

interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(ctx: Context, next: Next) {
  try {
    const authHeader = ctx.request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.response.status = 401;
      ctx.response.body = { error: "No token provided" };
      return;
    }

    const token = authHeader.slice(7);

    const payload = await verify(token, JWT_SECRET) as JWTPayload;
    
    ctx.state.userId = payload.userId;
    ctx.state.userEmail = payload.email;
    
    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    ctx.response.status = 401;
    ctx.response.body = { error: "Invalid token" };
  }
}