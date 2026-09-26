const mongoose = require("mongoose");
require("dotenv").config();

const Property = require("./models/Property");

const properties = [
  {
    type: "Entire apartment",
    title: "Modern Apartment in Cape Town",
    location: "Cape Town, South Africa",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    rating: 4.8,
    reviews: 245,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: ["Wifi", "Kitchen", "Free parking", "Pool", "Air conditioning", "Workspace"],
    description:
      "Enjoy a comfortable stay in this beautiful modern apartment in Cape Town. The apartment offers stylish living spaces, modern amenities and easy access to some of the city's best attractions.",
    cleaningFee: 350,
    serviceFee: 200,
    occupancyTaxes: 150,
    weeklyDiscount: 500,
    host: "Johann",
  },

  {
    type: "Entire home",
    title: "Beautiful Home with Ocean Views",
    location: "Cape Town, South Africa",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    rating: 4.9,
    reviews: 189,
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Wifi", "Pool", "Kitchen"],
    description:
      "A beautiful Cape Town home with comfortable living spaces and stunning ocean views.",
    cleaningFee: 350,
    serviceFee: 200,
    occupancyTaxes: 150,
    weeklyDiscount: 500,
    host: "Sarah",
  },

  {
    type: "Private room",
    title: "Cozy Room Near the City",
    location: "Cape Town, South Africa",
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    rating: 4.7,
    reviews: 156,
    price: 750,
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Wifi", "Workspace", "Kitchen"],
    description:
      "A cozy private room close to Cape Town's city centre and popular attractions.",
    cleaningFee: 200,
    serviceFee: 150,
    occupancyTaxes: 100,
    weeklyDiscount: 300,
    host: "David",
  },

  {
    type: "Entire apartment",
    title: "Luxury City Apartment",
    location: "Cape Town, South Africa",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    rating: 4.6,
    reviews: 98,
    price: 1400,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Wifi", "Pool", "Free parking"],
    description:
      "A stylish luxury apartment in the heart of Cape Town.",
    cleaningFee: 300,
    serviceFee: 200,
    occupancyTaxes: 150,
    weeklyDiscount: 500,
    host: "Michael",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Property.deleteMany();

    // If the demo host exists, make the seeded listings manageable from
    // that host's dashboard. Otherwise they remain public demo listings.
    const User = require("./models/User");
    const demoHost = await User.findOne({ email: "admin@airbnbclone.com", role: "host" });

    const seededProperties = properties.map((property) => ({
      ...property,
      owner: demoHost?._id || null,
    }));

    await Property.insertMany(seededProperties);

    console.log("Properties added successfully!");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();