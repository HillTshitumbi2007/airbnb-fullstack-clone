function FutureGetaways() {
  const getaways = [
    {
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      title: "Beach getaways",
      description: "Relax by the ocean and enjoy a peaceful escape.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
      title: "City adventures",
      description: "Explore exciting cities and discover something new.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
      title: "Mountain escapes",
      description: "Get away from the city and enjoy the outdoors.",
    },
  ];

  return (
    <section className="experience-section">
      <h2>Future getaways</h2>

      <div className="section-grid">
        {getaways.map((getaway, index) => (
          <div className="section-card" key={index}>
            <img
              src={getaway.image}
              alt={getaway.title}
            />

            <div className="section-card-content">
              <h3>{getaway.title}</h3>
              <p>{getaway.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FutureGetaways;