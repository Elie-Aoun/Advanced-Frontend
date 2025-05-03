import React, { useState } from "react";
import axios from "axios";

function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("Team name cannot be empty.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5047/api/teams",
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Team created successfully!");
      setTeamName("");
    } catch (error) {
      console.error("Failed to create team", error);
      alert("Error creating team");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Create a New Team</h2>
        </div>

        <form onSubmit={handleSubmit} className="task-form" style={{ flexDirection: "column", maxWidth: "500px" }}>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button type="submit" className="status-button">Create Team</button>
        </form>
      </div>
    </div>
  );
}

export default CreateTeam;
