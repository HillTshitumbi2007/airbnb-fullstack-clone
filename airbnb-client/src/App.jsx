import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Details from "./pages/Details";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import CreateListing from "./admin/CreateListing";
import EditListing from "./admin/EditListing";

function HostRoute({ children }) {
  const token = localStorage.getItem("airbnbToken");
  const user = JSON.parse(localStorage.getItem("airbnbUser") || "null");

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== "host") return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/listings/:location" element={<Listings />} />
      <Route path="/details/:id" element={<Details />} />

      {/* Backwards-compatible admin URLs from the original capstone. */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <HostRoute>
            <AdminDashboard />
          </HostRoute>
        }
      />
      <Route
        path="/admin/create-listing"
        element={
          <HostRoute>
            <CreateListing />
          </HostRoute>
        }
      />
      <Route
        path="/admin/edit-listing/:id"
        element={
          <HostRoute>
            <EditListing />
          </HostRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
