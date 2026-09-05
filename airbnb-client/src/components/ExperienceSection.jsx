function ExperienceSection() {
  const experiences = [
    {
      image:
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
      title: "Unique experiences",
      description:
        "Book unforgettable activities hosted by local experts.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
      title: "Explore together",
      description:
        "Discover amazing places and make new memories.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=80",
      title: "Travel differently",
      description:
        "Find experiences that make your trip special.",
    },
  ];

  return (
    <section className="experience-section">
      <h2>Discover Airbnb Experiences</h2>

      <div className="section-grid">
        {experiences.map((experience, index) => (
          <div className="section-card" key={index}>
            <img
              src={experience.image}
              alt={experience.title}
            />

            <div className="section-card-content">
              <h3>{experience.title}</h3>
              <p>{experience.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExperienceSection;