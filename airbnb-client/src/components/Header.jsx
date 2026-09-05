import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Air<span>bnb</span>
      </Link>

      <nav className="header-center">
        <Link to="/">Stays</Link>
        <Link to="/">Experiences</Link>
      </nav>

      <div className="header-right">
        <button className="header-button">
          Airbnb your home
        </button>

        <button className="profile-button">
          ☰ &nbsp; 👤
        </button>
      </div>
    </header>
  );
}

export default Header;