import { Application, Router } from "oak";
import { oakCors } from "cors";
import { load } from "dotenv";
import { authRouter } from "./routes/auth.ts";
import { calendarRouter } from "./routes/calendar.ts";
import { sessionsRouter } from "./routes/sessions.ts";
import { bookingsRouter } from "./routes/bookings.ts";

const env = await load();

const app = new Application();
const router = new Router();

const PORT = Number(Deno.env.get("PORT")) || Number(env.PORT) || 8000;
const CORS_ORIGIN = Deno.env.get("CORS_ORIGIN") || env.CORS_ORIGIN || "http://localhost:5173";

app.use(oakCors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error("Unhandled error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

router.get("/health", (ctx) => {
  ctx.response.body = { status: "healthy", timestamp: new Date().toISOString() };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

app.use(calendarRouter.routes());
app.use(calendarRouter.allowedMethods());

app.use(sessionsRouter.routes());
app.use(sessionsRouter.allowedMethods());

app.use(bookingsRouter.routes());
app.use(bookingsRouter.allowedMethods());

console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
await app.listen({ port: PORT, hostname: "0.0.0.0" });