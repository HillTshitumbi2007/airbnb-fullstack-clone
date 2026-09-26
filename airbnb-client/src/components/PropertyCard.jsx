import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  return (
    <Link
      to={`/details/${property._id}`}
      className="property-card"
    >
      <div className="property-card-image-wrap">
        <img
          src={property.image}
          alt={property.title}
          className="property-card-image"
        />

        <span className="property-card-badge">
          Guest favourite
        </span>
      </div>

      <div className="property-card-content">
        <div className="property-card-top">
          <h3>{property.location}</h3>

          <span className="property-card-rating">
            ★ {property.rating || "New"}
          </span>
        </div>

        <p className="property-card-title">
          {property.title}
        </p>

        <p className="property-card-details">
          {property.guests} guests · {property.bedrooms} bedrooms
        </p>

        <p className="property-card-price">
          <strong>
            R{Number(property.price).toLocaleString()}
          </strong>{" "}
          night
        </p>
      </div>
    </Link>
  );
}

export default PropertyCard;
