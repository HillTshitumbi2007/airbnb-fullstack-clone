import { useEffect, useState } from "react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import TripCard from "../components/TripCard";
import PropertyCard from "../components/PropertyCard";
import ExperienceSection from "../components/ExperienceSection";
import ThingsToDo from "../components/ThingsToDo";
import ThingsAtHome from "../components/ThingsAtHome";
import ShopAirbnb from "../components/ShopAirbnb";
import FutureGetaways from "../components/FutureGetaways";
import Footer from "../components/Footer";
import API_URL from "../api";

function Home() {
  const [properties, setProperties] = useState([]);

  const trips = [
    {
      image:
        "https://images.unsplash.com/photo-1569096651661-820d0de8b4ab?auto=format&fit=crop&w=800&q=80",
      title: "Gqeberha City",
      distance: "South Africa",
    },
    {
      image:
        "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=800&q=80",
      title: "Johannesburg City",
      distance: "South Africa",
    },
    {
      image:
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
      title: "Mossel Bay",
      distance: "South Africa",
    },
    {
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
      title: "Bryanston Park",
      distance: "South Africa",
    },
    {
      image:
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80",
      title: "Cape Town",
      distance: "South Africa",
    },
  ];

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/api/properties`);

        if (response.ok) {
          const data = await response.json();
          setProperties(data.slice(0, 8));
        }
      } catch (error) {
        console.error("Home listings error:", error);
      }
    };

    loadProperties();
  }, []);

  return (
    <>
      <Header />

      <Hero />

      <main>
        {/* Inspiration for your next trip */}
        <section className="trip-section">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Explore</span>

              <h2>Inspiration for your next trip</h2>

              <p>
                Explore popular destinations and find your next stay.
              </p>
            </div>
          </div>

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

        {/* Popular stays */}
        {properties.length > 0 && (
          <section className="property-section">
            <div className="section-heading-row">
              <div>
                <span className="section-eyebrow">
                  Stay somewhere great
                </span>

                <h2>Popular stays</h2>

                <p>
                  Discover comfortable places guests are loving right now.
                </p>
              </div>
            </div>

            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          </section>
        )}

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