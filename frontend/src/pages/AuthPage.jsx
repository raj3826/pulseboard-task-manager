import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        {isLogin ? (
          <Login setUser={setUser} />
        ) : (
          <Signup />
        )}

        <p style={{ marginTop: "10px" }}>
          {isLogin ? "Not registered?" : "Already have an account?"}

          <span
            style={{ color: "#6366f1", cursor: "pointer", marginLeft: "5px" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}