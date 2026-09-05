const express = require("express");
const Property = require("../models/Property");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all properties
// Public route - needed by the Airbnb frontend
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json(properties);
  } catch (error) {
    console.error("Get properties error:", error);

    res.status(500).json({
      message: "Failed to fetch properties.",
    });
  }
});

// GET one property
// Public route - needed by the Details page
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Get property error:", error);

    res.status(400).json({
      message: "Invalid property ID.",
    });
  }
});

// POST create property
// Protected route - admin/host only
router.post("/", auth, async (req, res) => {
  try {
    const {
      type,
      title,
      location,
      guests,
      bedrooms,
      beds,
      bathrooms,
      rating,
      reviews,
      price,
      image,
      images,
      amenities,
      description,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      weeklyDiscount,
      host,
    } = req.body;

    if (
      !type ||
      !title ||
      !location ||
      guests === undefined ||
      bedrooms === undefined ||
      beds === undefined ||
      bathrooms === undefined ||
      !price ||
      !image ||
      !description ||
      !host
    ) {
      return res.status(400).json({
        message: "Please provide all required property fields.",
      });
    }

    if (req.user.role !== "host") {
      return res.status(403).json({
        message: "Only hosts can create properties.",
      });
    }

    const property = await Property.create({
      type,
      title,
      location,
      guests,
      bedrooms,
      beds,
      bathrooms,
      rating: rating || 0,
      reviews: reviews || 0,
      price,
      image,
      images: images || [image],
      amenities: amenities || [],
      description,
      cleaningFee: cleaningFee || 0,
      serviceFee: serviceFee || 0,
      occupancyTaxes: occupancyTaxes || 0,
      weeklyDiscount: weeklyDiscount || 0,
      host,
    });

    res.status(201).json({
      message: "Property created successfully.",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);

    res.status(500).json({
      message: "Failed to create property.",
      error: error.message,
    });
  }
});

// PUT update property
// Protected route - admin/host only
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).json({
        message: "Only hosts can update properties.",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProperty) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    res.status(200).json({
      message: "Property updated successfully.",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Update property error:", error);

    res.status(400).json({
      message: "Failed to update property.",
      error: error.message,
    });
  }
});

// DELETE property
// Protected route - admin/host only
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).json({
        message: "Only hosts can delete properties.",
      });
    }

    const deletedProperty = await Property.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProperty) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    res.status(200).json({
      message: "Property deleted successfully.",
      property: deletedProperty,
    });
  } catch (error) {
    console.error("Delete property error:", error);

    res.status(400).json({
      message: "Failed to delete property.",
      error: error.message,
    });
  }
});

module.exports = router;