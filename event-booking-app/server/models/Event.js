const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: "" },
    status: { type: String, enum: ["Open", "SoldOut", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

eventSchema.pre("save", function () {
  if (this.bookedSeats >= this.totalSeats) {
    this.status = "SoldOut";
  } else if (this.status === "SoldOut" && this.bookedSeats < this.totalSeats) {
    this.status = "Open";
  }
});

module.exports = mongoose.model("Event", eventSchema);
