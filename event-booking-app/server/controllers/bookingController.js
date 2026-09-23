const { validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

const handleControllerError = (error, res, next) => {
  if (typeof next === "function") {
    return next(error);
  }

  return res.status(500).json({ message: error?.message || "Server Error" });
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("event", "title venue eventDate ticketPrice totalSeats bookedSeats status")
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title venue eventDate ticketPrice status bookedSeats totalSeats")
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, quantity } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "Closed" || event.status === "SoldOut") {
      return res.status(409).json({ message: "This event is not accepting bookings" });
    }

    const availableSeats = event.totalSeats - event.bookedSeats;
    if (quantity > availableSeats) {
      return res.status(409).json({ message: "Not enough seats available" });
    }

    const totalPrice = quantity * event.ticketPrice;

    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      quantity,
      totalPrice,
      status: "Pending",
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({ message: "Only pending bookings can be approved" });
    }

    const event = booking.event;
    const seatsLeft = event.totalSeats - event.bookedSeats;

    if (booking.quantity > seatsLeft) {
      return res.status(409).json({ message: "Booking cannot be confirmed: not enough seats left" });
    }

    booking.status = "Approved";
    await booking.save();

    event.bookedSeats += booking.quantity;
    if (event.bookedSeats >= event.totalSeats) {
      event.status = "SoldOut";
    }
    await event.save();

    res.json({ message: "Booking approved successfully", booking });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    await booking.deleteOne();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate("event");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({ message: "Only pending bookings can be reviewed" });
    }

    if (status === "Approved") {
      const seatsLeft = booking.event.totalSeats - booking.event.bookedSeats;
      if (booking.quantity > seatsLeft) {
        return res.status(409).json({ message: "Not enough seats available" });
      }

      booking.event.bookedSeats += booking.quantity;
      if (booking.event.bookedSeats >= booking.event.totalSeats) {
        booking.event.status = "SoldOut";
      }
      await booking.event.save();
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status.toLowerCase()} successfully`, booking });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this booking" });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({ message: "Only pending bookings can be deleted" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

module.exports = {
  getMyBookings,
  getAllBookings,
  createBooking,
  confirmBooking,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
};
