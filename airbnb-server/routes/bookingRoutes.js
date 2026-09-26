const express = require("express");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const auth = require("../middleware/auth");

const router = express.Router();

// Guests create bookings.
router.post("/", auth, async (req, res) => {
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

    if (req.user.role !== "guest") {
      return res.status(403).json({
        message: "Only guests can make bookings.",
      });
    }

    if (!property || !checkIn || !checkOut || !guests || !nights) {
      return res.status(400).json({
        message: "Please provide the booking details.",
      });
    }

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

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
      return res.status(400).json({
        message: "Check-out must be after check-in.",
      });
    }

    if (guests < 1 || Number.isNaN(Number(guests))) {
      return res.status(400).json({
        message: "Guest count must be at least 1.",
      });
    }

    if (Number(nights) !== Math.ceil((end - start) / (1000 * 60 * 60 * 24))) {
      return res.status(400).json({
        message: "The number of nights does not match the selected dates.",
      });
    }

    const booking = await Booking.create({
      guest: req.user.id,
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

// Guests see their bookings. Hosts see bookings for their listings.
router.get("/", auth, async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "guest") {
      bookings = await Booking.find({
        guest: req.user.id,
      })
        .populate("property")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "host") {
      const properties = await Property.find({
        owner: req.user.id,
      }).select("_id");

      const propertyIds = properties.map(
        (item) => item._id
      );

      bookings = await Booking.find({
        property: { $in: propertyIds },
      })
        .populate("property")
        .populate("guest", "username email")
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({
        message: "Invalid account role.",
      });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings.",
    });
  }
});

// Get one booking owned by the current user/host.
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("property")
      .populate("guest", "username email");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const isGuest =
      req.user.role === "guest" &&
      String(booking.guest?._id) === String(req.user.id);

    const isHost =
      req.user.role === "host" &&
      booking.property?.owner &&
      String(booking.property.owner) === String(req.user.id);

    if (!isGuest && !isHost) {
      return res.status(403).json({
        message: "You do not have access to this booking.",
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

// Guest can cancel their booking. Host can remove a booking for their listing.
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "property"
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const isGuest =
      req.user.role === "guest" &&
      String(booking.guest) === String(req.user.id);

    const isHost =
      req.user.role === "host" &&
      booking.property?.owner &&
      String(booking.property.owner) === String(req.user.id);

    if (!isGuest && !isHost) {
      return res.status(403).json({
        message: "You do not have permission to delete this booking.",
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    res.status(400).json({
      message: "Failed to delete booking.",
    });
  }
});

module.exports = router;
