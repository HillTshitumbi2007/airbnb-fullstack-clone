import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const [propertiesResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_URL}/api/properties`),
          fetch(`${API_URL}/api/bookings`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (propertiesResponse.status === 401 || bookingsResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login");
          return;
        }

        const propertiesData = await propertiesResponse.json();
        const bookingsData = await bookingsResponse.json();

        setProperties(propertiesData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, token]);

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete property.");
        return;
      }

      setProperties((currentProperties) =>
        currentProperties.filter(
          (property) => property._id !== propertyId
        )
      );

      alert("Property deleted successfully.");
    } catch (error) {
      console.error("Delete property error:", error);
      alert("Something went wrong while deleting the property.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete reservation.");
        return;
      }

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking._id !== bookingId
        )
      );

      alert("Reservation deleted successfully.");
    } catch (error) {
      console.error("Delete booking error:", error);
      alert("Something went wrong while deleting the reservation.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <header>
        <h1>Admin Dashboard</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main>
        <section>
          <h2>Properties</h2>

          {properties.length === 0 ? (
            <p>No properties found.</p>
          ) : (
            properties.map((property) => (
              <div key={property._id}>
                <h3>{property.title}</h3>

                <p>{property.location}</p>
                <p>R{property.price} per night</p>

                <button
                  onClick={() =>
                    navigate(`/admin/edit-listing/${property._id}`)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDeleteProperty(property._id)
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>

        <section>
          <h2>Reservations</h2>

          {bookings.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id}>
                <h3>
                  {booking.property?.title || "Property"}
                </h3>

                <p>
                  Check-in:{" "}
                  {new Date(booking.checkIn).toLocaleDateString()}
                </p>

                <p>
                  Check-out:{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>

                <p>Guests: {booking.guests}</p>

                <p>Total: R{booking.total}</p>

                <button
                  onClick={() =>
                    handleDeleteBooking(booking._id)
                  }
                >
                  Delete Reservation
                </button>
              </div>
            ))
          )}
        </section>

        <button onClick={() => navigate("/admin/create-listing")}>
          Create New Listing
        </button>
      </main>
    </div>
  );
}

export default AdminDashboard;