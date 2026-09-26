const express = require("express");
const Property = require("../models/Property");
const auth = require("../middleware/auth");

const router = express.Router();

const requireHost = (req, res, next) => {
  if (req.user?.role !== "host") {
    return res.status(403).json({
      message: "Only hosts can manage listings.",
    });
  }

  next();
};

// GET all properties - public.
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find().sort({
      createdAt: -1,
    });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Get properties error:", error);

    res.status(500).json({
      message: "Failed to fetch properties.",
    });
  }
});

// GET current host's listings.
router.get("/mine", auth, requireHost, async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Get my properties error:", error);

    res.status(500).json({
      message: "Failed to fetch your listings.",
    });
  }
});

// GET one property - public.
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

// POST create property - host only.
router.post("/", auth, requireHost, async (req, res) => {
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
    } = req.body;

    if (
      !type ||
      !title ||
      !location ||
      guests === undefined ||
      bedrooms === undefined ||
      beds === undefined ||
      bathrooms === undefined ||
      price === undefined ||
      !image ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all required property fields.",
      });
    }

    const property = await Property.create({
      owner: req.user.id,
      type,
      title: title.trim(),
      location: location.trim(),
      guests,
      bedrooms,
      beds,
      bathrooms,
      rating: rating || 0,
      reviews: reviews || 0,
      price,
      image: image.trim(),
      images: images?.length ? images : [image.trim()],
      amenities: amenities || [],
      description: description.trim(),
      cleaningFee: cleaningFee || 0,
      serviceFee: serviceFee || 0,
      occupancyTaxes: occupancyTaxes || 0,
      weeklyDiscount: weeklyDiscount || 0,
      host: req.user.username,
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

// Check that the authenticated host owns the listing.
const checkListingOwner = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    if (!property.owner || String(property.owner) !== String(req.user.id)) {
      return res.status(403).json({
        message: "You can only manage listings that belong to your host account.",
      });
    }

    req.property = property;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Invalid property ID.",
    });
  }
};

// PUT update property - host owner only.
router.put(
  "/:id",
  auth,
  requireHost,
  checkListingOwner,
  async (req, res) => {
    try {
      const allowedFields = [
        "type",
        "title",
        "location",
        "guests",
        "bedrooms",
        "beds",
        "bathrooms",
        "price",
        "image",
        "images",
        "amenities",
        "description",
        "cleaningFee",
        "serviceFee",
        "occupancyTaxes",
        "weeklyDiscount",
      ];

      const updates = {};

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      updates.host = req.user.username;

      const updatedProperty =
        await Property.findByIdAndUpdate(
          req.params.id,
          updates,
          {
            new: true,
            runValidators: true,
          }
        );

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
  }
);

// DELETE property - host owner only.
router.delete(
  "/:id",
  auth,
  requireHost,
  checkListingOwner,
  async (req, res) => {
    try {
      await Property.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Property deleted successfully.",
      });
    } catch (error) {
      console.error("Delete property error:", error);

      res.status(400).json({
        message: "Failed to delete property.",
      });
    }
  }
);

module.exports = router;
