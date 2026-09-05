import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();

    const selectedLocation = location.trim();

    if (!selectedLocation) {
      alert("Please enter a location.");
      return;
    }

    navigate(
      `/listings/${selectedLocation
        .toLowerCase()
        .replace(/\s+/g, "-")}?guests=${guests}`
    );
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Find a place to stay</h1>

        <p>
          Discover unique homes, apartments and experiences
          around the world.
        </p>

        <form className="search-box" onSubmit={handleSearch}>
          <div className="search-field">
            <label>Where</label>

            <input
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label>Guests</label>

            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
              <option value="5">5 guests</option>
              <option value="6">6 guests</option>
              <option value="7">7 guests</option>
              <option value="8">8 guests</option>
            </select>
          </div>

          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;