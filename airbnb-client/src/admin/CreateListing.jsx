import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "Entire apartment",
    title: "",
    location: "",
    description: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    guests: "",
    price: "",
    amenities: "",
    image: "",
    images: "",
    weeklyDiscount: "",
    cleaningFee: "",
    serviceFee: "",
    occupancyTaxes: "",
    host: "Admin",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("airbnbToken");
    const user = JSON.parse(
      localStorage.getItem("airbnbUser") || "null"
    );

    if (!token || !user || user.role !== "host") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.description.trim() ||
      !formData.bedrooms ||
      !formData.beds ||
      !formData.bathrooms ||
      !formData.guests ||
      !formData.price ||
      !formData.image.trim()
    ) {
      setError(
        "Please complete all required fields before creating the listing."
      );
      return;
    }

    const token = localStorage.getItem("airbnbToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const amenities = formData.amenities
      .split(",")
      .map((amenity) => amenity.trim())
      .filter((amenity) => amenity !== "");

    const images = formData.images
      ? formData.images
          .split(",")
          .map((image) => image.trim())
          .filter((image) => image !== "")
      : [formData.image.trim()];

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/properties`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: formData.type,
            title: formData.title.trim(),
            location: formData.location.trim(),
            description: formData.description.trim(),

            bedrooms: Number(formData.bedrooms),
            beds: Number(formData.beds),
            bathrooms: Number(formData.bathrooms),
            guests: Number(formData.guests),
            price: Number(formData.price),

            amenities,
            image: formData.image.trim(),
            images,

            weeklyDiscount:
              Number(formData.weeklyDiscount) || 0,

            cleaningFee:
              Number(formData.cleaningFee) || 0,

            serviceFee:
              Number(formData.serviceFee) || 0,

            occupancyTaxes:
              Number(formData.occupancyTaxes) || 0,

            host: formData.host.trim() || "Admin",

            rating: 0,
            reviews: 0,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create listing.");
        return;
      }

      setSuccess("Listing created successfully!");

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.error("Create listing error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

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

        <button
          className="admin-user button"
          onClick={() => navigate("/admin")}
        >
          Back to dashboard
        </button>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <h1>Create a listing</h1>
            <p>
              Add a new property to your Airbnb listings.
            </p>
          </div>
        </div>

        <section className="admin-section">
          <form
            className="create-listing-form"
            onSubmit={handleSubmit}
          >
            <div className="form-section">
              <h2>Basic information</h2>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="type">
                    Property type
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Entire apartment">
                      Entire apartment
                    </option>
                    <option value="Entire home">
                      Entire home
                    </option>
                    <option value="Private room">
                      Private room
                    </option>
                    <option value="Guest house">
                      Guest house
                    </option>
                    <option value="Hotel room">
                      Hotel room
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="title">
                    Title *
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Beautiful Cape Town apartment"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="location">
                    Location *
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Cape Town, South Africa"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="description">
                    Description *
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    placeholder="Describe your property..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Property details</h2>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="bedrooms">
                    Bedrooms *
                  </label>

                  <input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="beds">
                    Beds *
                  </label>

                  <input
                    id="beds"
                    name="beds"
                    type="number"
                    min="1"
                    value={formData.beds}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="bathrooms">
                    Bathrooms *
                  </label>

                  <input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="1"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="guests">
                    Maximum guests *
                  </label>

                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Pricing</h2>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="price">
                    Price per night (R) *
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="1500"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="weeklyDiscount">
                    Weekly discount (R)
                  </label>

                  <input
                    id="weeklyDiscount"
                    name="weeklyDiscount"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={formData.weeklyDiscount}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="cleaningFee">
                    Cleaning fee (R)
                  </label>

                  <input
                    id="cleaningFee"
                    name="cleaningFee"
                    type="number"
                    min="0"
                    placeholder="300"
                    value={formData.cleaningFee}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="serviceFee">
                    Service fee (R)
                  </label>

                  <input
                    id="serviceFee"
                    name="serviceFee"
                    type="number"
                    min="0"
                    placeholder="200"
                    value={formData.serviceFee}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="occupancyTaxes">
                    Occupancy taxes (R)
                  </label>

                  <input
                    id="occupancyTaxes"
                    name="occupancyTaxes"
                    type="number"
                    min="0"
                    placeholder="150"
                    value={formData.occupancyTaxes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Amenities</h2>

              <div className="form-field form-field-full">
                <label htmlFor="amenities">
                  Amenities
                </label>

                <input
                  id="amenities"
                  name="amenities"
                  type="text"
                  placeholder="WiFi, Pool, Kitchen, Parking"
                  value={formData.amenities}
                  onChange={handleChange}
                />

                <small>
                  Separate each amenity with a comma.
                </small>
              </div>
            </div>

            <div className="form-section">
              <h2>Images</h2>

              <div className="form-grid">
                <div className="form-field form-field-full">
                  <label htmlFor="image">
                    Main image URL *
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="images">
                    Additional image URLs
                  </label>

                  <textarea
                    id="images"
                    name="images"
                    rows="4"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    value={formData.images}
                    onChange={handleChange}
                  />

                  <small>
                    Separate image URLs with commas.
                  </small>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Host</h2>

              <div className="form-field">
                <label htmlFor="host">
                  Host name
                </label>

                <input
                  id="host"
                  name="host"
                  type="text"
                  value={formData.host}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {success && (
              <div className="form-success">
                {success}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="form-cancel-button"
                onClick={() => navigate("/admin")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="form-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Creating listing..."
                  : "Create listing"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreateListing;