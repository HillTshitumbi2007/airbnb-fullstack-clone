function TripCard({ image, title, distance }) {
  return (
    <div className="trip-card">
      <img src={image} alt={title} />

      <div className="trip-card-content">
        <h3>{title}</h3>
        <p>{distance}</p>
      </div>
    </div>
  );
}

export default TripCard;