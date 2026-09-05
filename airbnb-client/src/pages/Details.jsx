import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../api";

import {
  Wifi,
  Utensils,
  Car,
  Waves,
  Wind,
  Monitor,
  Users,
  Bed,
  Bath,
  MapPin,
  Star,
  CalendarDays,
  User,
} from "lucide-react";

function Details() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/properties/${id}`
        );

        if (!response.ok) {
          throw new Error("Property not found");
        }

        const data = await response.json();

        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Unable to load property.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const getAmenityIcon = (amenity) => {
    const name = amenity.toLowerCase();

    if (name.includes("wifi")) {
      return <Wifi size={20} />;
    }

    if (name.includes("kitchen")) {
      return <Utensils size={20} />;
    }

    if (name.includes("parking")) {
      return <Car size={20} />;
    }

    if (name.includes("pool")) {
      return <Waves size={20} />;
    }

    if (name.includes("air")) {
      return <Wind size={20} />;
    }

    if (name.includes("workspace")) {
      return <Monitor size={20} />;
    }

    return null;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end - start;

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  const accommodationCost =
    property && nights > 0
      ? property.price * nights
      : 0;

  const weeklyDiscount =
    property && nights >= 7
      ? property.weeklyDiscount
      : 0;

  const cleaningFee =
    property && nights > 0
      ? property.cleaningFee
      : 0;

  const serviceFee =
    property && nights > 0
      ? property.serviceFee
      : 0;

  const occupancyTaxes =
    property && nights > 0
      ? property.occupancyTaxes
      : 0;

  const total =
    accommodationCost -
    weeklyDiscount +
    cleaningFee +
    serviceFee +
    occupancyTaxes;

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select your check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      alert("Check-out must be after check-in.");
      return;
    }

    if (guestCount > property.guests) {
      alert(
        `This property can accommodate a maximum of ${property.guests} guests.`
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            property: property._id,
            checkIn,
            checkOut,
            guests: guestCount,
            nights,
            accommodationCost,
            weeklyDiscount,
            cleaningFee,
            serviceFee,
            occupancyTaxes,
            total,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create booking"
        );
      }

      alert("Reservation successful!");
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="details-container">
        <p>Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="details-container">
        <p>{error || "Property not found."}</p>
      </div>
    );
  }

  return (
    <div className="details-container">
      <h1 className="details-title">
        {property.title}
      </h1>

      <div className="details-subtitle">
        <span>
          <Star size={18} fill="currentColor" />
          {property.rating}
        </span>

        <span>
          ({property.reviews} reviews)
        </span>

        <span>
          <MapPin size={18} />
          {property.location}
        </span>
      </div>

      {/* IMAGE GALLERY */}
      <div className="image-gallery">
        {property.images &&
          property.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} ${index + 1}`}
              className={
                index === 0 ? "gallery-main" : ""
              }
            />
          ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="details-content">
        <div className="details-info">
          <h2>
            {property.type} hosted by {property.host}
          </h2>

          {/* PROPERTY HIGHLIGHTS */}
          <div className="property-highlights">
            <div>
              <Users size={20} />
              <span>
                {property.guests} guests
              </span>
            </div>

            <div>
              <Bed size={20} />
              <span>
                {property.bedrooms} bedrooms
              </span>
            </div>

            <div>
              <Bed size={20} />
              <span>
                {property.beds} beds
              </span>
            </div>

            <div>
              <Bath size={20} />
              <span>
                {property.bathrooms} bathrooms
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <h2>About this place</h2>

          <p>{property.description}</p>

          {/* SLEEPING ARRANGEMENT */}
          <h2>Sleeping arrangement</h2>

          <div className="sleeping-card">
            <Bed size={24} />

            <h3>
              {property.bedrooms} bedrooms
            </h3>

            <p>
              {property.beds} beds available
            </p>
          </div>

          {/* AMENITIES */}
          <h2>What this place offers</h2>

          <div className="amenities-list">
            {property.amenities.map(
              (amenity, index) => (
                <div
                  className="amenity"
                  key={index}
                >
                  {getAmenityIcon(amenity)}

                  <span>{amenity}</span>
                </div>
              )
            )}
          </div>

          {/* REVIEWS */}
          <h2>Reviews</h2>

          <div className="review-box">
            <strong>
              ★ {property.rating}
            </strong>

            <p>
              This property has received{" "}
              {property.reviews} reviews from
              previous guests.
            </p>
          </div>

          {/* HOST */}
          <h2>Your host</h2>

          <div className="host-card">
            <div className="host-avatar">
              {property.host
                ? property.host.charAt(0)
                : "H"}
            </div>

            <div>
              <h3>{property.host}</h3>

              <p>
                Host of this beautiful property
              </p>
            </div>
          </div>

          {/* HOUSE RULES */}
          <h2>House rules</h2>

          <div className="info-section">
            <p>• Check-in after 14:00</p>
            <p>• Check-out before 10:00</p>
            <p>• No smoking</p>
            <p>• No parties or events</p>
          </div>
        </div>

        {/* BOOKING CARD */}
        <div className="booking-card">
          <h2>
            R{property.price.toLocaleString()}{" "}
            <span className="per-night">
              / night
            </span>
          </h2>

          {/* DATES */}
          <div className="date-inputs">
            <div>
              <label>
                <CalendarDays size={14} />
                CHECK-IN
              </label>

              <input
                type="date"
                value={checkIn}
                onChange={(e) =>
                  setCheckIn(e.target.value)
                }
              />
            </div>

            <div>
              <label>
                <CalendarDays size={14} />
                CHECK-OUT
              </label>

              <input
                type="date"
                value={checkOut}
                onChange={(e) =>
                  setCheckOut(e.target.value)
                }
              />
            </div>
          </div>

          {/* GUESTS */}
          <div className="guest-input">
            <label>
              <User size={14} />
              GUESTS
            </label>

            <select
              value={guestCount}
              onChange={(e) =>
                setGuestCount(
                  Number(e.target.value)
                )
              }
            >
              {Array.from(
                {
                  length: property.guests,
                },
                (_, index) => index + 1
              ).map((number) => (
                <option
                  key={number}
                  value={number}
                >
                  {number}{" "}
                  {number === 1
                    ? "guest"
                    : "guests"}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE BREAKDOWN */}
          {nights > 0 && (
            <div className="price-breakdown">
              <div>
                <span>
                  R
                  {property.price.toLocaleString()}{" "}
                  × {nights} nights
                </span>

                <span>
                  R
                  {accommodationCost.toLocaleString()}
                </span>
              </div>

              {weeklyDiscount > 0 && (
                <div>
                  <span>Weekly discount</span>

                  <span>
                    -R
                    {weeklyDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div>
                <span>Cleaning fee</span>

                <span>
                  R
                  {cleaningFee.toLocaleString()}
                </span>
              </div>

              <div>
                <span>Service fee</span>

                <span>
                  R
                  {serviceFee.toLocaleString()}
                </span>
              </div>

              <div>
                <span>Occupancy taxes</span>

                <span>
                  R
                  {occupancyTaxes.toLocaleString()}
                </span>
              </div>

              <hr />

              <div className="total-price">
                <strong>Total</strong>

                <strong>
                  R{total.toLocaleString()}
                </strong>
              </div>
            </div>
          )}

          <button
            className="booking-button"
            onClick={handleReserve}
          >
            Reserve
          </button>

          <p className="no-charge">
            You won't be charged yet
          </p>
        </div>
      </div>
    </div>
  );
}

export default Details;