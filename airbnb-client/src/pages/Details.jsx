import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../api";
import Header from "../components/Header";

import {
  Wifi,
  Utensils,
  Car,
  Waves,
  Wind,
  Monitor,
  MapPin,
  Star,
  CalendarDays,
  User,
} from "lucide-react";

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

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

    if (name.includes("wifi")) return <Wifi size={20} />;
    if (name.includes("kitchen")) return <Utensils size={20} />;
    if (name.includes("parking")) return <Car size={20} />;
    if (name.includes("pool")) return <Waves size={20} />;
    if (name.includes("air")) return <Wind size={20} />;
    if (name.includes("workspace")) return <Monitor size={20} />;

    return null;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    return Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  const accommodationCost =
    property && nights > 0 ? property.price * nights : 0;

  const weeklyDiscount =
    property && nights >= 7 ? property.weeklyDiscount : 0;

  const cleaningFee =
    property && nights > 0 ? property.cleaningFee : 0;

  const serviceFee =
    property && nights > 0 ? property.serviceFee : 0;

  const occupancyTaxes =
    property && nights > 0 ? property.occupancyTaxes : 0;

  const total =
    accommodationCost -
    weeklyDiscount +
    cleaningFee +
    serviceFee +
    occupancyTaxes;

  const handleReserve = async () => {
    const token = localStorage.getItem("airbnbToken");
    const user = JSON.parse(
      localStorage.getItem("airbnbUser") || "null"
    );

    if (!token || !user) {
      alert("Please log in as a guest before making a booking.");
      navigate("/login");
      return;
    }

    if (user.role !== "guest") {
      alert("Hosts can manage listings, but only guests can make bookings.");
      return;
    }

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
            Authorization: `Bearer ${token}`,
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
      <>
        <Header />
        <div className="details-container">
          <p>Loading property...</p>
        </div>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <div className="details-container">
          <p>{error || "Property not found."}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="details-container">
        <h1 className="details-title">{property.title}</h1>

        <div className="details-subtitle">
          <span>
            <Star size={18} fill="currentColor" />
            {property.rating}
          </span>

          <span>({property.reviews} reviews)</span>

          <span>
            <MapPin size={18} />
            {property.location}
          </span>
        </div>

        <div className="image-gallery">
          {property.images?.map((image, index) => (
            <img
              key={image + index}
              src={image}
              alt={`${property.title} ${index + 1}`}
              className={
                index === 0 ? "gallery-main" : ""
              }
            />
          ))}
        </div>

        <div className="details-content">
          <div className="details-info">
            <h2>{property.type}</h2>

            <div className="property-highlights">
              <div>
                <User size={20} />
                {property.guests} guests
              </div>

              <div>
                {property.bedrooms} bedrooms
              </div>

              <div>{property.beds} beds</div>

              <div>{property.bathrooms} bathrooms</div>
            </div>

            <h2>About this place</h2>
            <p>{property.description}</p>

            <h2>What this place offers</h2>

            <div className="amenities-list">
              {property.amenities?.map((amenity) => (
                <div className="amenity" key={amenity}>
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>

            <h2>Your host</h2>

            <div className="host-card">
              <div className="host-avatar">
                {property.host
                  ? property.host.charAt(0).toUpperCase()
                  : "H"}
              </div>

              <div>
                <h3>{property.host}</h3>
                <p>Host of this beautiful property</p>
              </div>
            </div>

            <h2>House rules</h2>

            <div className="info-section">
              <p>• Check-in after 14:00</p>
              <p>• Check-out before 10:00</p>
              <p>• No smoking</p>
              <p>• No parties or events</p>
            </div>

            <h2>Reviews</h2>

            <div className="review-box">
              <strong>★ {property.rating}</strong>
              <p>
                This property has received {property.reviews} reviews
                from previous guests.
              </p>
            </div>
          </div>

          <div className="booking-card">
            <h2>
              R{property.price.toLocaleString()}{" "}
              <span className="per-night">/ night</span>
            </h2>

            <div className="date-inputs">
              <div>
                <label>
                  <CalendarDays size={14} />
                  CHECK-IN
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(event) =>
                    setCheckIn(event.target.value)
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
                  onChange={(event) =>
                    setCheckOut(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="guest-input">
              <label>
                <User size={14} />
                GUESTS
              </label>

              <select
                value={guestCount}
                onChange={(event) =>
                  setGuestCount(Number(event.target.value))
                }
              >
                {Array.from(
                  { length: property.guests },
                  (_, index) => index + 1
                ).map((number) => (
                  <option key={number} value={number}>
                    {number}{" "}
                    {number === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>

            {nights > 0 && (
              <div className="price-breakdown">
                <div>
                  <span>
                    R{property.price.toLocaleString()} × {nights} nights
                  </span>
                  <span>R{accommodationCost.toLocaleString()}</span>
                </div>

                {weeklyDiscount > 0 && (
                  <div>
                    <span>Weekly discount</span>
                    <span>-R{weeklyDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div>
                  <span>Cleaning fee</span>
                  <span>R{cleaningFee.toLocaleString()}</span>
                </div>

                <div>
                  <span>Service fee</span>
                  <span>R{serviceFee.toLocaleString()}</span>
                </div>

                <div>
                  <span>Occupancy taxes</span>
                  <span>R{occupancyTaxes.toLocaleString()}</span>
                </div>

                <hr />

                <div className="total-price">
                  <strong>Total</strong>
                  <strong>R{total.toLocaleString()}</strong>
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
              Guests must be logged in before reserving.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
