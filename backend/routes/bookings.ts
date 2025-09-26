import { Router } from "oak";
import { authMiddleware } from "../middlewares/auth.ts";
import { BookingModel } from "../models/Booking.ts";
import { SessionTypeModel } from "../models/SessionType.ts";
import { CalendarModel } from "../models/Calendar.ts";
import type { CreateBookingRequest } from "../types/database.ts";

const bookingsRouter = new Router();

bookingsRouter.get("/book/:uniqueLink", async (ctx) => {
  try {
    const uniqueLink = ctx.params.uniqueLink;
    
    if (!uniqueLink) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Unique link is required" };
      return;
    }

    const sessionType = await SessionTypeModel.findByUniqueLink(uniqueLink);
    
    if (!sessionType) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Session type not found" };
      return;
    }

    const dateParam = ctx.request.url.searchParams.get("date");
    let availableSlots: Date[] = [];
    
    if (dateParam) {
      const date = new Date(dateParam);
      if (!isNaN(date.getTime())) {
        availableSlots = await BookingModel.getAvailableSlots(sessionType.id, date);
      }
    }

    ctx.response.status = 200;
    ctx.response.body = { 
      sessionType: {
        id: sessionType.id,
        name: sessionType.name,
        duration_minutes: sessionType.duration_minutes,
      },
      availableSlots: availableSlots.map(slot => slot.toISOString())
    };
  } catch (error) {
    console.error("Get booking page error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

bookingsRouter.post("/book/:uniqueLink", async (ctx) => {
  try {
    const uniqueLink = ctx.params.uniqueLink;
    const body = await ctx.request.body.json() as CreateBookingRequest;
    
    if (!uniqueLink) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Unique link is required" };
      return;
    }

    const sessionType = await SessionTypeModel.findByUniqueLink(uniqueLink);
    
    if (!sessionType) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Session type not found" };
      return;
    }

    if (!body.first_name || !body.last_name || !body.start_time) {
      ctx.response.status = 400;
      ctx.response.body = { error: "First name, last name, and start time are required" };
      return;
    }

    if (!body.email && !body.phone) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Either email or phone number is required" };
      return;
    }

    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid email format" };
        return;
      }
    }

    const startTime = new Date(body.start_time);
    if (isNaN(startTime.getTime())) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid date format" };
      return;
    }

    if (startTime <= new Date()) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Cannot book time in the past" };
      return;
    }

    const hasConflict = await BookingModel.checkBookingConflict(
      sessionType.id, 
      startTime, 
      sessionType.duration_minutes
    );
    
    if (hasConflict) {
      ctx.response.status = 409;
      ctx.response.body = { error: "Time slot is no longer available" };
      return;
    }

    const booking = await BookingModel.create(sessionType.id, body);
    
    ctx.response.status = 201;
    ctx.response.body = { 
      message: "Booking created successfully",
      booking: {
        id: booking.id,
        session_type_name: sessionType.name,
        start_time: booking.start_time,
        duration_minutes: sessionType.duration_minutes,
        status: booking.status,
      }
    };
  } catch (error) {
    console.error("Create booking error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

bookingsRouter.use(authMiddleware);

bookingsRouter.get("/bookings", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const bookings = await BookingModel.findBySessionTypeUserId(userId);
    
    ctx.response.status = 200;
    ctx.response.body = { bookings };
  } catch (error) {
    console.error("Get bookings error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

bookingsRouter.put("/bookings/:id/approve", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const bookingId = Number(ctx.params.id);
    
    if (isNaN(bookingId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid booking ID" };
      return;
    }

    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Booking not found" };
      return;
    }

    const sessionType = await SessionTypeModel.findById(booking.session_type_id, userId);
    if (!sessionType) {
      ctx.response.status = 403;
      ctx.response.body = { error: "Unauthorized" };
      return;
    }

    const endTime = new Date(booking.start_time.getTime() + sessionType.duration_minutes * 60000);
    
    const hasConflict = await CalendarModel.checkTimeConflict(userId, booking.start_time, endTime);
    if (hasConflict) {
      ctx.response.status = 409;
      ctx.response.body = { error: "Cannot approve - time conflict with existing event" };
      return;
    }

    const updatedBooking = await BookingModel.updateStatus(bookingId, "approved");
    
    const userCalendars = await CalendarModel.findByUserId(userId);
    if (userCalendars.length > 0) {
      await CalendarModel.addEvent(userCalendars[0].id, userId, {
        title: `${sessionType.name} with ${booking.booked_by_first_name} ${booking.booked_by_last_name}`,
        start_time: booking.start_time.toISOString(),
        end_time: endTime.toISOString(),
        description: `Booking contact: ${booking.booked_by_email || booking.booked_by_phone}`,
      });
    }

    ctx.response.status = 200;
    ctx.response.body = { 
      message: "Booking approved successfully",
      booking: updatedBooking 
    };
  } catch (error) {
    console.error("Approve booking error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

bookingsRouter.put("/bookings/:id/reject", async (ctx) => {
  try {
    const userId = ctx.state.userId as number;
    const bookingId = Number(ctx.params.id);
    
    if (isNaN(bookingId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid booking ID" };
      return;
    }

    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Booking not found" };
      return;
    }

    const sessionType = await SessionTypeModel.findById(booking.session_type_id, userId);
    if (!sessionType) {
      ctx.response.status = 403;
      ctx.response.body = { error: "Unauthorized" };
      return;
    }

    const updatedBooking = await BookingModel.updateStatus(bookingId, "rejected");

    ctx.response.status = 200;
    ctx.response.body = { 
      message: "Booking rejected successfully",
      booking: updatedBooking 
    };
  } catch (error) {
    console.error("Reject booking error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

export { bookingsRouter };