const { validationResult } = require("express-validator");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const handleControllerError = (error, res, next) => {
  if (typeof next === "function") {
    return next(error);
  }

  return res.status(500).json({
    message: error?.message || "Server Error",
  });
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const createEvent = async (req, res, next) => {
  try {
    console.log("[EventController][createEvent] user:", req.user);
    console.log("[EventController][createEvent] body:", req.body);
    console.log("[EventController][createEvent] file:", req.file ? { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size } : null);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("[EventController][createEvent] validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, venue, eventDate, ticketPrice, totalSeats, status } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const event = await Event.create({
      title,
      description,
      venue,
      eventDate,
      ticketPrice,
      totalSeats,
      imageUrl,
      status: status || "Open",
    });

    console.log("[EventController][createEvent] created event id:", event._id);

    res.status(201).json(event);
  } catch (error) {
    console.error("[EventController][createEvent] error:", error);
    handleControllerError(error, res, next);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updates = {
      ...req.body,
    };

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updatedEvent);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const deletedBookings = await Booking.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      message: "Event deleted successfully",
      deletedBookingsCount: deletedBookings.deletedCount || 0,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
