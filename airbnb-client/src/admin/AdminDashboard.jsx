import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("airbnbUser") || "null"
  );

  const token = localStorage.getItem("airbnbToken");

  useEffect(() => {
    if (!token || !user) {
      navigate("/admin/login");
      return;
    }

    if (user.role !== "host") {
      localStorage.removeItem("airbnbToken");
      localStorage.removeItem("airbnbUser");

      navigate("/admin/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [propertiesResponse, bookingsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/properties"),
            fetch("http://localhost:5000/api/bookings", {
              headers,
            }),
          ]);

        const propertiesData = await propertiesResponse.json();
        const bookingsData = await bookingsResponse.json();

        if (propertiesResponse.ok) {
          setProperties(propertiesData);
        }

        if (bookingsResponse.ok) {
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("airbnbToken");
    localStorage.removeItem("airbnbUser");

    navigate("/admin/login");
  };

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete listing.");
        return;
      }

      setProperties((previousProperties) =>
        previousProperties.filter(
          (property) => property._id !== propertyId
        )
      );

      alert("Listing deleted successfully.");
    } catch (error) {
      console.error("Delete listing error:", error);
      alert("Unable to connect to the server.");
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
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to delete reservation."
        );
        return;
      }

      setBookings((previousBookings) =>
        previousBookings.filter(
          (booking) => booking._id !== bookingId
        )
      );

      alert("Reservation deleted successfully.");
    } catch (error) {
      console.error("Delete reservation error:", error);
      alert("Unable to connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <main className="admin-main">
          <h2>Loading dashboard...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div
          className="admin-logo"
          onClick={() => navigate("/admin")}
          style={{ cursor: "pointer" }}
        >
          airbnb
        </div>

        <div className="admin-user">
          <span>
            Welcome, <strong>{user?.username || "Admin"}</strong>
          </span>

          <button onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Manage your Airbnb listings and reservations.
            </p>
          </div>

          <button
            className="admin-create-button"
            onClick={() =>
              navigate("/admin/create-listing")
            }
          >
            + Create listing
          </button>
        </div>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <h3>{properties.length}</h3>
            <p>Total listings</p>
          </div>

          <div className="admin-stat-card">
            <h3>{bookings.length}</h3>
            <p>Total reservations</p>
          </div>

          <div className="admin-stat-card">
            <h3>
              {properties.length + bookings.length}
            </h3>
            <p>Total records</p>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <h2>Your listings</h2>
            <span>{properties.length} listings</span>
          </div>

          {properties.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            <div className="admin-listings">
              {properties.map((property) => (
                <div
                  className="admin-listing-card"
                  key={property._id}
                >
                  <img
                    src={property.image}
                    alt={property.title}
                  />

                  <div className="admin-listing-info">
                    <h3>{property.title}</h3>

                    <p>{property.location}</p>

                    <p>
                      R{property.price} per night ·{" "}
                      {property.guests} guests
                    </p>
                  </div>

                  <div className="admin-listing-actions">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/edit-listing/${property._id}`
                        )
                      }
                    >
                      Update
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteProperty(property._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <h2>Recent reservations</h2>
            <span>{bookings.length} reservations</span>
          </div>

          {bookings.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <div className="admin-bookings">
              {bookings.map((booking) => (
                <div
                  className="admin-booking-card"
                  key={booking._id}
                >
                  <div>
                    <h3>
                      {booking.property?.title ||
                        "Property unavailable"}
                    </h3>

                    <p>
                      {booking.guests} guests ·{" "}
                      {booking.nights} nights
                    </p>
                  </div>

                  <div className="admin-booking-actions">
                    <strong>
                      R{booking.total}
                    </strong>

                    <button
                      onClick={() =>
                        handleDeleteBooking(booking._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;