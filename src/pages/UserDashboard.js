import React, { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard() {
  const [userInfo, setUserInfo] = useState({});
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5047/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Failed to load user info", error);
    }
  };

  const handleProjectClick = async (projectId) => {
    setSelectedProjectId(projectId);
    try {
      const response = await axios.get(`http://localhost:5047/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Failed to load project tasks", error);
    }
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      await axios.put(`http://localhost:5047/api/tasks/${taskId}/status`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (selectedProjectId) handleProjectClick(selectedProjectId);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div style={styles.dashboardMain}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Dashboard</h2>
        <p style={styles.welcome}>Welcome, {userInfo.fullName || "User"}!</p>
      </div>

      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Team Info</h3>
        {userInfo.team ? (
          <p style={styles.text}>You are in team: <strong>{userInfo.team.name}</strong></p>
        ) : (
          <p style={styles.text}>You are not assigned to any team yet.</p>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Projects You're In</h3>
        {projects.length > 0 ? (
          <div style={styles.taskList}>
            {projects.map((project) => (
              <div
                style={styles.taskCard}
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
              >
                <strong style={styles.taskTitle}>{project.title}</strong>
                <span>{project.description}</span>
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.text}>You are not part of any projects yet.</p>
        )}
      </div>

      {selectedProjectId && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Tasks in Selected Project</h3>
          {projectTasks.length > 0 ? (
            <div style={styles.taskList}>
              {projectTasks.map((task) => (
                <div style={styles.taskCard} key={task.id}>
                  <strong style={styles.taskTitle}>{task.title}</strong>
                  <span>Status: {task.status}</span>
                  <span>
                    Priority: <span style={styles[`priority${task.priority}`]}>{task.priority}</span>
                  </span>
                  <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    style={styles.statusButton}
                  >
                    Mark as {task.status === "Pending" ? "Completed" : "Pending"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.text}>You have no tasks in this project as of now.</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  dashboardMain: {
    backgroundColor: "#fdf4c8",
    padding: "20px",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "30px",
    textAlign: "left",
  },
  title: {
    fontSize: "28px",
    color: "#222",
  },
  welcome: {
    fontSize: "16px",
    color: "#555",
  },
  section: {
    marginTop: "40px",
  },
  sectionCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333",
  },
  text: {
    fontSize: "16px",
    color: "#444",
  },
  taskList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "15px",
  },
  taskCard: {
    background: "#fffef5",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "6px solid #ffcc00",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    cursor: "pointer",
  },
  taskTitle: {
    fontSize: "18px",
    color: "#222",
  },
  priorityHigh: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  priorityMedium: {
    color: "#e67e22",
    fontWeight: "bold",
  },
  priorityLow: {
    color: "#3498db",
    fontWeight: "bold",
  },
  statusButton: {
    marginTop: "8px",
    padding: "8px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default UserDashboard;
