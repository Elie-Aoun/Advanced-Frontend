import React from "react";
import { useNavigate } from "react-router-dom";

function TeamLeaderDashboard() {
  const navigate = useNavigate();

  const goToMyProjects = () => {
    navigate("/my-projects");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Team Leader Dashboard</h2>
        </div>

        <p>Welcome to your dashboard. Here you can manage your assigned projects.</p>

        <button className="status-button" onClick={goToMyProjects}>
          Go to My Projects
        </button>
      </div>
    </div>
  );
}

export default TeamLeaderDashboard;
