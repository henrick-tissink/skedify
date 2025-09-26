import { Router } from "oak";
import { authMiddleware } from "../middlewares/auth.ts";
import { CalendarModel } from "../models/Calendar.ts";
import type { CreateCalendarRequest, CreateEventRequest } from "../types/database.ts";

const calendarRouter = new Router();

calendarRouter.use(authMiddleware);

calendarRouter.get("/calendars", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const calendars = await CalendarModel.findByUserId(userId);
    
    ctx.response.status = 200;
    ctx.response.body = { calendars };
  } catch (error) {
    console.error("Get calendars error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

calendarRouter.post("/calendars", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const body = await ctx.request.body.json() as CreateCalendarRequest;
    
    if (!body.name) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Calendar name is required" };
      return;
    }

    const calendar = await CalendarModel.create(userId, body);
    
    ctx.response.status = 201;
    ctx.response.body = { 
      message: "Calendar created successfully",
      calendar 
    };
  } catch (error) {
    console.error("Create calendar error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

calendarRouter.get("/calendars/:id", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const calendarId = Number(ctx.params.id);
    
    if (isNaN(calendarId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid calendar ID" };
      return;
    }

    const calendar = await CalendarModel.findById(calendarId, userId);
    
    if (!calendar) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Calendar not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { calendar };
  } catch (error) {
    console.error("Get calendar error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

calendarRouter.put("/calendars/:id", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const calendarId = Number(ctx.params.id);
    const body = await ctx.request.body.json() as CreateCalendarRequest;
    
    if (isNaN(calendarId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid calendar ID" };
      return;
    }

    if (!body.name) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Calendar name is required" };
      return;
    }

    const calendar = await CalendarModel.update(calendarId, userId, body);
    
    if (!calendar) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Calendar not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { 
      message: "Calendar updated successfully",
      calendar 
    };
  } catch (error) {
    console.error("Update calendar error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

calendarRouter.delete("/calendars/:id", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const calendarId = Number(ctx.params.id);
    
    if (isNaN(calendarId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid calendar ID" };
      return;
    }

    const deleted = await CalendarModel.delete(calendarId, userId);
    
    if (!deleted) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Calendar not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Calendar deleted successfully" };
  } catch (error) {
    console.error("Delete calendar error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

calendarRouter.get("/calendars/:id/events", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const calendarId = Number(ctx.params.id);
    
    if (isNaN(calendarId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid calendar ID" };
      return;
    }

    const calendar = await CalendarModel.findById(calendarId, userId);
    if (!calendar) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Calendar not found" };
      return;
    }

    const events = await CalendarModel.getEvents(calendarId, userId);
    
    ctx.response.status = 200;
    ctx.response.body = { events };
  } catch (error) {
    console.error("Get events error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

calendarRouter.post("/calendars/:id/events", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const calendarId = Number(ctx.params.id);
    const body = await ctx.request.body.json() as CreateEventRequest;
    
    if (isNaN(calendarId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid calendar ID" };
      return;
    }

    if (!body.title || !body.start_time || !body.end_time) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Title, start_time, and end_time are required" };
      return;
    }

    const startTime = new Date(body.start_time);
    const endTime = new Date(body.end_time);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid date format" };
      return;
    }

    if (startTime >= endTime) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Start time must be before end time" };
      return;
    }

    const hasConflict = await CalendarModel.checkTimeConflict(userId, startTime, endTime);
    if (hasConflict) {
      ctx.response.status = 409;
      ctx.response.body = { error: "Time conflict with existing event" };
      return;
    }

    const event = await CalendarModel.addEvent(calendarId, userId, body);
    
    if (!event) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Calendar not found" };
      return;
    }

    ctx.response.status = 201;
    ctx.response.body = { 
      message: "Event added successfully",
      event 
    };
  } catch (error) {
    console.error("Add event error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

export { calendarRouter };