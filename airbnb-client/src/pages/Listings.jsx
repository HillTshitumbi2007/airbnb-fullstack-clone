import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../api";

function Listings() {
  const { location } = useParams();
  const [searchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestedGuests =
    Number(searchParams.get("guests")) || 1;

  const formattedLocation = location
    ? location.split("-").join(" ")
    : "Cape Town";

  const displayLocation =
    formattedLocation.charAt(0).toUpperCase() +
    formattedLocation.slice(1);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/properties`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();

        const filteredListings = data.filter(
          (listing) =>
            listing.location
              .toLowerCase()
              .includes(formattedLocation.toLowerCase()) &&
            listing.guests >= requestedGuests
        );

        setListings(filteredListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Unable to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [formattedLocation, requestedGuests]);

  if (loading) {
    return <p>Loading listings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="listings-container">
        <h1>Stays in {displayLocation}</h1>

        <p className="listing-count">
          {listings.length}{" "}
          {listings.length === 1
            ? "accommodation"
            : "accommodations"}{" "}
          for {requestedGuests}{" "}
          {requestedGuests === 1 ? "guest" : "guests"}
        </p>

        <div className="listings-list">
          {listings.length === 0 ? (
            <p>
              No properties found for your search.
            </p>
          ) : (
            listings.map((listing) => (
              <Link
                to={`/details/${listing._id}`}
                className="listing-result"
                key={listing._id}
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="listing-result-image"
                />

                <div className="listing-result-info">
                  <div>
                    <p className="listing-type">
                      {listing.type}
                    </p>

                    <h2>{listing.title}</h2>

                    <p className="listing-location">
                      {listing.location}
                    </p>

                    <p className="listing-amenities">
                      {listing.amenities.join(" · ")}
                    </p>
                  </div>

                  <div className="listing-bottom">
                    <span className="rating">
                      ★ {listing.rating}
                    </span>

                    <span className="reviews">
                      ({listing.reviews} reviews)
                    </span>

                    <strong>
                      R{listing.price.toLocaleString()}
                      <span className="per-night">
                        {" "}/ night
                      </span>
                    </strong>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Listings;