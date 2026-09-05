function ThingsAtHome() {
  const activities = [
    {
      image:
        "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1000&q=80",
      title: "Relax at home",
      description:
        "Enjoy comfortable spaces and make yourself at home.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
      title: "Cook something delicious",
      description:
        "Prepare your favourite meals in a beautiful kitchen.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
      title: "Work remotely",
      description:
        "Find comfortable spaces where you can work and relax.",
    },
  ];

  return (
    <section className="home-section">
      <h2>Things to do at home</h2>

      <div className="section-grid">
        {activities.map((activity, index) => (
          <div className="section-card" key={index}>
            <img
              src={activity.image}
              alt={activity.title}
            />

            <div className="section-card-content">
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ThingsAtHome;