import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Optional Sidebar */}
      <div className="sidebar">
        <h2>Admin</h2>
        <a onClick={() => navigate("/admin/projects")}>Manage Projects</a>
        <a onClick={() => navigate("/admin/users")}>Manage Users</a>
        <a onClick={() => navigate("/admin/create-team")}>Create Team</a>
      </div>

      {/* Main Section */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Admin Dashboard</h2>
        </div>

        <p>Welcome to the Admin Dashboard! Use the sidebar to manage projects, users, and teams.</p>

        <div className="task-list">
          {/* Button Cards to navigate */}
          <div className="task-card" onClick={() => navigate("/admin/projects")}>
            <strong>Manage Projects</strong>
            <span>Create and monitor all projects</span>
          </div>

          <div className="task-card" onClick={() => navigate("/admin/users")}>
            <strong>Manage Users</strong>
            <span>View and edit users & roles</span>
          </div>

          <div className="task-card" onClick={() => navigate("/admin/create-team")}>
            <strong>Create Teams</strong>
            <span>Assign team members and leaders</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
