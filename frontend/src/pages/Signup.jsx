import { useState } from "react";
import API from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Required fields
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    // ✅ Email validation
    if (!form.email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    // ✅ Password validation
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await API.post("/signup", form);
      alert(res.data.message);

    } catch (e) {
      console.error("🔥 FRONTEND ERROR:", e);

      if (e.response) {
        alert(e.response.data.message);
      } else if (e.request) {
        alert("Backend not reachable");
      } else {
        alert("Unexpected error");
      }
    }
  };

  return (
    <div className="auth-card">
      <h3>Signup</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}