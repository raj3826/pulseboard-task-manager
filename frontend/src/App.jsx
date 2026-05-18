import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import Contact from "./pages/Contact";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <div className="app-layout">
      {/* 🔝 NAVBAR */}
      <Navbar />

      {/* 📄 MAIN CONTENT */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} setUser={setUser} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
        </Routes>
      </div>

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}

export default App;