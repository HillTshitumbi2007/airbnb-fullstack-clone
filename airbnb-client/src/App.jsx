import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Details from "./pages/Details";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import CreateListing from "./admin/CreateListing";
import EditListing from "./admin/EditListing";

function App() {
  return (
    <Routes>
      {/* Customer pages */}
      <Route path="/" element={<Home />} />
      <Route path="/listings/:location" element={<Listings />} />
      <Route path="/details/:id" element={<Details />} />

      {/* Admin pages */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/admin/create-listing"
        element={<CreateListing />}
      />
      <Route
        path="/admin/edit-listing/:id"
        element={<EditListing />}
      />
    </Routes>
  );
}

export default App;