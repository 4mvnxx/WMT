const express = require("express");
const { body } = require("express-validator");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", authMiddleware, getEventById);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("venue").notEmpty().withMessage("Venue is required"),
    body("eventDate").notEmpty().withMessage("Event date is required"),
    body("ticketPrice").isFloat({ min: 0 }).withMessage("Ticket price must be a valid number"),
    body("totalSeats").isInt({ min: 1 }).withMessage("Total seats must be at least 1"),
  ],
  createEvent
);

router.post("/debug", authMiddleware, adminMiddleware, (req, res) => {
  console.log("[EventRoute][POST /debug] user:", req.user);
  console.log("[EventRoute][POST /debug] body:", req.body);
  console.log("[EventRoute][POST /debug] file:", req.file ? { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size } : null);
  res.json({ ok: true, body: req.body, hasFile: !!req.file });
});

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
    body("venue").optional().notEmpty().withMessage("Venue cannot be empty"),
    body("eventDate").optional().notEmpty().withMessage("Event date cannot be empty"),
    body("ticketPrice").optional().isFloat({ min: 0 }).withMessage("Ticket price must be a valid number"),
    body("totalSeats").optional().isInt({ min: 1 }).withMessage("Total seats must be at least 1"),
  ],
  updateEvent
);

router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
