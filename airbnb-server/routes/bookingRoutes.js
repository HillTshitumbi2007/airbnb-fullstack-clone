const express = require("express");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/bookings
// Create a new booking
router.post("/", async (req, res) => {
  try {
    const {
      property,
      checkIn,
      checkOut,
      guests,
      nights,
      accommodationCost,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      total,
    } = req.body;

    const existingProperty = await Property.findById(property);

    if (!existingProperty) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    if (guests > existingProperty.guests) {
      return res.status(400).json({
        message: `This property can accommodate a maximum of ${existingProperty.guests} guests.`,
      });
    }

    const booking = await Booking.create({
      property,
      checkIn,
      checkOut,
      guests,
      nights,
      accommodationCost,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      total,
    });

    res.status(201).json({
      message: "Booking created successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);

    res.status(500).json({
      message: "Failed to create booking.",
      error: error.message,
    });
  }
});

// GET /api/bookings
// Get all bookings
// Protected route
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings.",
    });
  }
});

// GET /api/bookings/:id
// Get one booking
// Protected route
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "property"
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);

    res.status(400).json({
      message: "Invalid booking ID.",
    });
  }
});

// DELETE /api/bookings/:id
// Delete a booking
// Protected route
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(
      req.params.id
    );

    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    res.status(200).json({
      message: "Booking deleted successfully.",
      booking: deletedBooking,
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    res.status(400).json({
      message: "Failed to delete booking.",
      error: error.message,
    });
  }
});

module.exports = router;