import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // ✅ Import the CSS

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Task Management</h1>
      <p className="home-description">
        Organize your tasks efficiently and stay on top of your deadlines with ease.
      </p>

      <div className="home-buttons">
        <button className="home-button login" onClick={() => navigate("/login")}>
          Login
        </button>

        <button className="home-button register" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
