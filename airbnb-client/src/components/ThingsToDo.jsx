function ThingsToDo() {
  const things = [
    {
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
      title: "Explore Cape Town",
      description:
        "Discover beautiful beaches, mountains and exciting city life.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80",
      title: "Discover the city",
      description:
        "Experience local attractions, restaurants and hidden gems.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=80",
      title: "Make memories",
      description:
        "Find fun activities and unforgettable experiences.",
    },
  ];

  return (
    <section className="things-section">
      <h2>Things to do on your trip</h2>

      <div className="section-grid">
        {things.map((thing, index) => (
          <div className="section-card" key={index}>
            <img
              src={thing.image}
              alt={thing.title}
            />

            <div className="section-card-content">
              <h3>{thing.title}</h3>
              <p>{thing.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ThingsToDo;