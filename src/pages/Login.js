import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // ✅ Import the CSS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:5047/api/auth/login", {
        email,
        password,
      });


      console.log("Backend response: ", response.data);
      // Store the JWT token in localStorage

      localStorage.setItem("token", response.data.token.token);
      localStorage.setItem("role", response.data.token.role);  // Store the role
      localStorage.setItem("teamId", response.data.token.teamId);  // Store the role
      localStorage.setItem("userid", response.data.token.userid);  // Store the role

      // Get the role from the response
      const role = response.data.token.role;
      console.log(response.data.token.role);
      // Navigate based on role
      if (role === "Admin") {
        navigate("/admin-dashboard");
      } else if (role === "TeamLeader") {
        navigate("/team-leader-dashboard");
      } else if (role === "User") {
        navigate("/user-dashboard");
      } else {
        navigate("/dashboard"); // Default route if role is not set or unexpected
      }

    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className="login-options">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
