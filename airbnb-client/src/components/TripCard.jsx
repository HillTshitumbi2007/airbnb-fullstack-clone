import { Link } from "react-router-dom";

function TripCard({ image, title, distance }) {
  const location = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link to={`/listings/${location}`} className="trip-card">
      <div className="trip-card-image">
        <img src={image} alt={title} />
      </div>

      <div className="trip-card-content">
        <h3>{title}</h3>

        <p>{distance}</p>

        <span>Explore stays →</span>
      </div>
    </Link>
  );
}

export default TripCard;