import { Router } from "oak";
import { authMiddleware } from "../middlewares/auth.ts";
import { SessionTypeModel } from "../models/SessionType.ts";
import type { CreateSessionTypeRequest } from "../types/database.ts";

const sessionsRouter = new Router();

sessionsRouter.use(authMiddleware);

sessionsRouter.get("/session-types", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const sessionTypes = await SessionTypeModel.findByUserId(userId);
    
    ctx.response.status = 200;
    ctx.response.body = { sessionTypes };
  } catch (error) {
    console.error("Get session types error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

sessionsRouter.post("/session-types", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const body = await ctx.request.body.json() as CreateSessionTypeRequest;
    
    if (!body.name || !body.duration_minutes) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Name and duration_minutes are required" };
      return;
    }

    if (body.duration_minutes <= 0 || body.duration_minutes > 480) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Duration must be between 1 and 480 minutes" };
      return;
    }

    const sessionType = await SessionTypeModel.create(userId, body);
    
    ctx.response.status = 201;
    ctx.response.body = { 
      message: "Session type created successfully",
      sessionType 
    };
  } catch (error) {
    console.error("Create session type error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

sessionsRouter.get("/session-types/:id", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const sessionTypeId = Number(ctx.params.id);
    
    if (isNaN(sessionTypeId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid session type ID" };
      return;
    }

    const sessionType = await SessionTypeModel.findById(sessionTypeId, userId);
    
    if (!sessionType) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Session type not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { sessionType };
  } catch (error) {
    console.error("Get session type error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

sessionsRouter.put("/session-types/:id", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const sessionTypeId = Number(ctx.params.id);
    const body = await ctx.request.body.json() as CreateSessionTypeRequest;
    
    if (isNaN(sessionTypeId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid session type ID" };
      return;
    }

    if (!body.name || !body.duration_minutes) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Name and duration_minutes are required" };
      return;
    }

    if (body.duration_minutes <= 0 || body.duration_minutes > 480) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Duration must be between 1 and 480 minutes" };
      return;
    }

    const sessionType = await SessionTypeModel.update(sessionTypeId, userId, body);
    
    if (!sessionType) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Session type not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { 
      message: "Session type updated successfully",
      sessionType 
    };
  } catch (error) {
    console.error("Update session type error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

sessionsRouter.delete("/session-types/:id", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const sessionTypeId = Number(ctx.params.id);
    
    if (isNaN(sessionTypeId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid session type ID" };
      return;
    }

    const deleted = await SessionTypeModel.delete(sessionTypeId, userId);
    
    if (!deleted) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Session type not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Session type deleted successfully" };
  } catch (error) {
    console.error("Delete session type error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

export { sessionsRouter };