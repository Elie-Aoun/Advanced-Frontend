import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyProjects.css"; // optional if you use existing styles

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const teamId=localStorage.getItem("teamId");
  const userid=localStorage.getItem("userid");

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5047/api/projects/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Project title is required");

    console.log("User Role:", localStorage.getItem("role"));
    console.log("User Team ID:", localStorage.getItem("teamId"));

    try {
      await axios.post(
        "http://localhost:5047/api/projects",
        {
          Name: title,
          Description: description,
          TeamId: teamId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      

      setTitle("");
      setDescription("");
      fetchMyProjects();
    } catch (error) {
      alert("Project creation failed");
      console.error(error);
    }
  };

  return (
    <div className="dashboard-main">
      <h2>My Projects</h2>

      {/* Create Project Form */}
      <form className="task-form" onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Project</button>
      </form>

      {/* Loading or displaying the projects */}
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="task-list">
          {projects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
              <div className="task-card">
                <strong>{project.title}</strong>
                <span>{project.description || "No description"}</span>
                <span>Team: {project.team?.name}</span>
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;
