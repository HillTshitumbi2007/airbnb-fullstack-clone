import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("airbnbToken");
  const user = JSON.parse(
    localStorage.getItem("airbnbUser") || "null"
  );

  useEffect(() => {
    if (!token || !user || user.role !== "host") {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const [propertiesResponse, bookingsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/properties/mine`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${API_URL}/api/bookings`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        if (
          propertiesResponse.status === 401 ||
          propertiesResponse.status === 403 ||
          bookingsResponse.status === 401 ||
          bookingsResponse.status === 403
        ) {
          localStorage.removeItem("airbnbToken");
          localStorage.removeItem("airbnbUser");
          navigate("/login");
          return;
        }

        const propertiesData =
          await propertiesResponse.json();
        const bookingsData =
          await bookingsResponse.json();

        setProperties(propertiesData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, token, user?.role]);

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

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
        alert(data.message || "Failed to delete listing.");
        return;
      }

      setProperties((current) =>
        current.filter((item) => item._id !== propertyId)
      );

      alert("Listing deleted successfully.");
    } catch (error) {
      console.error("Delete listing error:", error);
      alert("Something went wrong while deleting the listing.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("airbnbToken");
    localStorage.removeItem("airbnbUser");
    window.dispatchEvent(new Event("airbnb-auth-changed"));
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading host dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <button
            className="admin-logo"
            onClick={() => navigate("/")}
          >
            airbnb
          </button>

          <p className="dashboard-subtitle">
            Host dashboard · Welcome, {user?.username}
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            className="dashboard-home-button"
            onClick={() => navigate("/")}
          >
            View Airbnb
          </button>

          <button
            className="dashboard-logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <h1>Manage your listings</h1>
            <p>
              Create, update and delete the properties you host.
            </p>
          </div>

          <button
            className="create-listing-button"
            onClick={() => navigate("/admin/create-listing")}
          >
            + Create listing
          </button>
        </div>

        <section className="admin-section">
          <div className="dashboard-stat-grid">
            <div className="dashboard-stat">
              <span>Your listings</span>
              <strong>{properties.length}</strong>
            </div>

            <div className="dashboard-stat">
              <span>Reservations</span>
              <strong>{bookings.length}</strong>
            </div>
          </div>

          <h2>Your listings</h2>

          {properties.length === 0 ? (
            <div className="empty-dashboard">
              <h3>You haven't created a listing yet.</h3>
              <p>
                Add your first property so guests can discover it.
              </p>
              <button
                className="create-listing-button"
                onClick={() =>
                  navigate("/admin/create-listing")
                }
              >
                Create your first listing
              </button>
            </div>
          ) : (
            <div className="admin-property-grid">
              {properties.map((property) => (
                <article
                  key={property._id}
                  className="admin-property-card"
                >
                  <img
                    src={property.image}
                    alt={property.title}
                  />

                  <div className="admin-property-card-body">
                    <span className="admin-property-type">
                      {property.type}
                    </span>

                    <h3>{property.title}</h3>
                    <p>{property.location}</p>

                    <strong>
                      R{property.price.toLocaleString()} / night
                    </strong>

                    <div className="admin-card-actions">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/edit-listing/${property._id}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-action"
                        onClick={() =>
                          handleDeleteProperty(property._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section dashboard-reservations">
          <h2>Reservations</h2>

          {bookings.length === 0 ? (
            <div className="empty-dashboard">
              No reservations for your listings yet.
            </div>
          ) : (
            <div className="reservation-list">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="reservation-card"
                >
                  <div>
                    <h3>
                      {booking.property?.title || "Property"}
                    </h3>

                    <p>
                      Guest:{" "}
                      {booking.guest?.username || "Guest"}
                    </p>

                    <p>
                      {new Date(
                        booking.checkIn
                      ).toLocaleDateString()}{" "}
                      →{" "}
                      {new Date(
                        booking.checkOut
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      {booking.guests}{" "}
                      {booking.guests === 1
                        ? "guest"
                        : "guests"}
                    </p>
                  </div>

                  <strong>
                    R{Number(booking.total).toLocaleString()}
                  </strong>
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
