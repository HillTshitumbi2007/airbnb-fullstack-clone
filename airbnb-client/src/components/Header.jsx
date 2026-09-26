import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Menu, UserRound } from "lucide-react";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("airbnbUser") || "null");
  } catch {
    return null;
  }
}

function Header() {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const refreshUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", refreshUser);
    window.addEventListener("airbnb-auth-changed", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("airbnb-auth-changed", refreshUser);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("airbnbToken");
    localStorage.removeItem("airbnbUser");

    setUser(null);
    setOpen(false);

    window.dispatchEvent(
      new Event("airbnb-auth-changed")
    );

    navigate("/");
  };

  const goToLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  const goToHome = () => {
    setOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setOpen(false);
    navigate("/admin");
  };

  return (
    <header className="header">
      {/* LOGO */}
      <Link
        to="/"
        className="logo"
        aria-label="Airbnb home"
      >
        airbnb
      </Link>

      {/* MAIN NAVIGATION */}
      <nav
        className="header-center"
        aria-label="Primary navigation"
      >
        <Link to="/">Stays</Link>

        <Link to="/">
          Experiences
        </Link>

        <Link to="/">
          Online Experiences
        </Link>
      </nav>

      {/* RIGHT SIDE */}
      <div className="header-right">
        <button
          type="button"
          className="host-link"
          onClick={() =>
            navigate(
              user?.role === "host"
                ? "/admin"
                : "/login"
            )
          }
        >
          {user?.role === "host"
            ? "Host dashboard"
            : "Airbnb your home"}
        </button>

        <button
          type="button"
          className="language-button"
          aria-label="Language and region"
        >
          <Globe size={18} strokeWidth={2} />
        </button>

        {/* PROFILE MENU */}
        <div
          className="profile-menu"
          ref={menuRef}
        >
          <button
            type="button"
            className="profile-button"
            onClick={() =>
              setOpen((current) => !current)
            }
            aria-expanded={open}
            aria-label="Open account menu"
          >
            <Menu
              size={18}
              strokeWidth={2}
            />

            {user ? (
              <span className="profile-avatar">
                {user.username
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </span>
            ) : (
              <UserRound
                size={18}
                strokeWidth={2}
              />
            )}
          </button>

          {open && (
            <div
              className="profile-dropdown"
              role="menu"
            >
              {user ? (
                <>
                  <div className="profile-summary">
                    <strong>
                      {user.username}
                    </strong>

                    <span>
                      {user.role === "host"
                        ? "Host account"
                        : "Guest account"}
                    </span>
                  </div>

                  {user.role === "host" && (
                    <button
                      type="button"
                      onClick={goToDashboard}
                    >
                      Host dashboard
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={goToHome}
                  >
                    Explore stays
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-summary">
                    <strong>
                      Welcome to Airbnb
                    </strong>

                    <span>
                      Log in to book or host
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={goToLogin}
                  >
                    Log in or sign up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;