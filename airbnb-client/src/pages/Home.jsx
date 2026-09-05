import Header from "../components/Header";
import Hero from "../components/Hero";
import TripCard from "../components/TripCard";
import ExperienceSection from "../components/ExperienceSection";
import ThingsToDo from "../components/ThingsToDo";
import ThingsAtHome from "../components/ThingsAtHome";
import ShopAirbnb from "../components/ShopAirbnb";
import FutureGetaways from "../components/FutureGetaways";
import Footer from "../components/Footer";

function Home() {
  const trips = [
    {
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      title: "Cape Town",
      distance: "1,432 kilometers away",
    },
    {
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
      title: "Johannesburg",
      distance: "1,065 kilometers away",
    },
    {
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      title: "Durban",
      distance: "760 kilometers away",
    },
    {
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      title: "Mauritius",
      distance: "3,130 kilometers away",
    },
  ];

  return (
    <>
      <Header />

      <Hero />

      <main>
        <section className="trip-section">
          <h2>Inspiration for your next trip</h2>

          <div className="trip-grid">
            {trips.map((trip, index) => (
              <TripCard
                key={index}
                image={trip.image}
                title={trip.title}
                distance={trip.distance}
              />
            ))}
          </div>
        </section>

        <ExperienceSection />

        <ThingsToDo />

        <ThingsAtHome />

        <ShopAirbnb />

        <FutureGetaways />
      </main>

      <Footer />
    </>
  );
}

export default Home;