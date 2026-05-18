import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Required validation
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    // ✅ Email format validation
    if (!form.email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    try {
      const res = await API.post("/login", form);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      navigate("/dashboard");

    } catch (e) {
      alert("Invalid login");
    }
  };

  return (
    <div className="auth-card">
      <h3>Login</h3>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}