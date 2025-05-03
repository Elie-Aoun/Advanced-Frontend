import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MyProjects.css";

function ProjectDetails() {
  const { id } = useParams(); // project ID
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const teamId = localStorage.getItem("teamId");

  useEffect(() => {
    fetchProjectDetails();
    if (role === "TeamLeader") fetchTeamMembers();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5047/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(res.data.project);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error fetching project", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get(`http://localhost:5047/api/teams/${teamId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamMembers(res.data);
    } catch (error) {
      console.error("Failed to load team members", error);
    }
  };

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();

    if (!title || !dueDate || (role === "TeamLeader" && !assigneeId)) {
      return alert("Please complete all required fields.");
    }

    const payload = {
      title,
      dueDate,
      priority,
      description: "",
      projectId: parseInt(id),
      assignedUserId: role === "TeamLeader" ? assigneeId : null
    };

    try {
      if (editingTask) {
        await axios.put(`http://localhost:5047/api/tasks/${editingTask.id}/update`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        alert("Task updated!");
      } else {
        const endpoint = role === "TeamLeader"
          ? "http://localhost:5047/api/tasks/team"
          : "http://localhost:5047/api/tasks";

        await axios.post(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        alert("Task created!");
      }

      setEditingTask(null);
      setTitle("");
      setDueDate("");
      setPriority("Medium");
      setAssigneeId("");
      fetchProjectDetails();
    } catch (error) {
      console.error("Task operation failed", error);
      alert("Failed to create or update task.");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate?.split("T")[0]);
    setAssigneeId(task.assignedUserId || "");
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:5047/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Task deleted");
      fetchProjectDetails();
    } catch (error) {
      alert("Failed to delete task");
      console.error(error);
    }
  };

  return (
    <div className="dashboard-main">
      {project ? (
        <div className="project-details-container">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p><strong>Team:</strong> {project.team}</p>
          <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
          <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>

          {role === "TeamLeader" && (
            <>
              <h3>{editingTask ? "Edit Task" : "Create a Task"}</h3>
              <form onSubmit={handleCreateOrUpdateTask} className="task-form" style={{ flexDirection: "column", maxWidth: "500px" }}>
                <input
                  type="text"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />

                <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} required>
                  <option value="">Assign to User</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.fullName} ({member.email})
                    </option>
                  ))}
                </select>

                <button type="submit" className="status-button">
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </form>
            </>
          )}

          <h3>Tasks</h3>
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <strong>{task.title}</strong>
                <span>Status: {task.status}</span>
                <span>
                  Priority: <span className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </span>
                <span>
                  Due: {task.dueDate && !isNaN(new Date(task.dueDate)) ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                </span>
                <span>Assigned to: {task.assignedUser || "Unassigned"}</span>

                {role === "TeamLeader" && (
                  <>
                    <button onClick={() => handleEdit(task)} className="status-button">Edit</button>
                    <button onClick={() => handleDelete(task.id)} className="delete-button">Delete</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="loading-message">Loading project...</p>
      )}
    </div>
  );
}

export default ProjectDetails;
