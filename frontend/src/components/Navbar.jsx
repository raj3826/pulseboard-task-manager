import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 40px",
        background: "#1e293b",
        color: "white",
        alignItems: "center",
        borderBottom: "1px solid #334155"
      }}
    >
      {/* LEFT SIDE */}
      <h2 style={{ margin: 0 }}>🚀 PulseBoard</h2>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link to="/auth" style={{ color: "white", textDecoration: "none" }}>
          Login / Signup
        </Link>

        <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
          Contact
        </Link>
      </div>
    </nav>
  );
}