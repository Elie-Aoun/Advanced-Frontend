import React, { useEffect, useState } from "react";
import axios from "axios";

function CreateProject() {
  const [teams, setTeams] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    teamId: "",
    teamLeaderId: ""
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "Admin") {
      fetchTeams();
    } else {
      console.warn("Unauthorized: Only Admins can create projects.");
    }
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5047/api/teams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Teams loaded:", response.data);
      setTeams(response.data);
    } catch (error) {
      console.error("❌ Failed to load teams", error);
    }
  };

  const fetchTeamLeaders = async (teamId) => {
    try {
      const response = await axios.get(`http://localhost:5047/api/teams/${teamId}/leaders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Leaders loaded:", response.data);
      setLeaders(response.data);
    } catch (error) {
      console.error("❌ Failed to load leaders", error);
    }
  };

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    setForm({ ...form, teamId, teamLeaderId: "" });
    fetchTeamLeaders(teamId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.teamId || !form.teamLeaderId) {
      alert("Please complete all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5047/api/admin/create-project", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("🎉 Project created successfully!");
      setForm({ name: "", description: "", teamId: "", teamLeaderId: "" });
      setLeaders([]);
    } catch (error) {
      console.error("❌ Failed to create project", error);
      alert(error.response?.data || "Error creating project");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Create Project</h2>
        </div>

        <form onSubmit={handleSubmit} className="task-form" style={{ flexDirection: "column", maxWidth: "600px" }}>
          <input
            type="text"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            placeholder="Project Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            style={{ resize: "none" }}
            required
          />

          <select value={form.teamId} onChange={handleTeamChange} required>
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            value={form.teamLeaderId}
            onChange={(e) => setForm({ ...form, teamLeaderId: e.target.value })}
            disabled={!leaders.length}
            required
          >
            <option value="">Select Team Leader</option>
            {leaders.map((leader) => (
              <option key={leader.id} value={leader.id}>
                {leader.fullName}
              </option>
            ))}
          </select>

          <button type="submit" className="status-button">Create Project</button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;
