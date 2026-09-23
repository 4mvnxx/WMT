const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getMyBookings,
  getAllBookings,
  createBooking,
  confirmBooking,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/my", authMiddleware, getMyBookings);
router.get("/", authMiddleware, adminMiddleware, getAllBookings);

router.post(
  "/",
  authMiddleware,
  [
    body("eventId").notEmpty().withMessage("Event ID is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ],
  createBooking
);

router.put("/:id/approve", authMiddleware, adminMiddleware, confirmBooking);
router.put("/:id/reject", authMiddleware, adminMiddleware, updateBookingStatus);
router.put("/:id/status", authMiddleware, adminMiddleware, updateBookingStatus);
router.delete("/:id", authMiddleware, deleteBooking);

module.exports = router;
