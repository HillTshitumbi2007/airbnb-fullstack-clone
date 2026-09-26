import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function AdminLogin() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    localStorage.setItem("airbnbToken", data.token);
    localStorage.setItem("airbnbUser", JSON.stringify(data.user));
    window.dispatchEvent(new Event("airbnb-auth-changed"));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password || (isRegistering && !username.trim())) {
      setError(isRegistering ? "Please complete all fields." : "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isRegistering ? "/api/users/register" : "/api/users/login";
      const body = isRegistering
        ? { username: username.trim(), email: email.trim(), password, role }
        : { email: email.trim(), password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      saveSession(data);
      navigate(data.user.role === "host" ? "/admin" : "/");
    } catch (requestError) {
      console.error("Authentication error:", requestError);
      setError("Unable to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering((current) => !current);
    setError("");
    setPassword("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-logo" onClick={() => navigate("/")}>airbnb</button>

        <div className="auth-heading">
          <h1>{isRegistering ? "Create your account" : "Welcome back"}</h1>
          <p className="auth-subtitle">
            {isRegistering
              ? "Choose how you want to use Airbnb."
              : "Log in to book a stay or manage your listings."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegistering && (
            <>
              <label htmlFor="username">Full name</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />

              <label>Account type</label>
              <div className="role-options">
                <button
                  type="button"
                  className={`role-card ${role === "guest" ? "selected" : ""}`}
                  onClick={() => setRole("guest")}
                >
                  <strong>Guest</strong>
                  <span>Book stays and trips</span>
                </button>
                <button
                  type="button"
                  className={`role-card ${role === "host" ? "selected" : ""}`}
                  onClick={() => setRole("host")}
                >
                  <strong>Host</strong>
                  <span>Create and manage listings</span>
                </button>
              </div>
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isRegistering ? "At least 6 characters" : "Your password"}
            autoComplete={isRegistering ? "new-password" : "current-password"}
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Please wait..." : isRegistering ? "Create account" : "Log in"}
          </button>
        </form>

        <button className="auth-switch" onClick={switchMode}>
          {isRegistering ? "Already have an account? Log in" : "Don't have an account? Sign up"}
        </button>

        <button className="auth-home-link" onClick={() => navigate("/")}>
          Continue browsing as a visitor
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
