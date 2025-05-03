import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // ✅ Import the CSS

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium"); // ✅ Default priority
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirecting to login.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: new Date().toISOString(),
      priority, // ✅ Send Priority
    };

    try {
      await axios.post(`${API_BASE_URL}/api/tasks`, newTask, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
      setTitle("");
      setDescription("");
      setPriority("Medium"); // ✅ Reset priority
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks(); // Refresh tasks after status change
    } catch (error) {
      console.error("Error updating task status:", error.response?.data || error.message);
    }
  };

  // ✅ Delete Task Function
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Organizer</h2>
        <a href="#">Dashboard</a>
        <a href="#">Tasks</a>
        <a href="#">Settings</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Task Dashboard</h2>
        </div>

        <form onSubmit={handleCreateTask} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit">Add Task</button>
        </form>

        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <strong>{task.title}</strong> - {task.description}
              <br />
              <span>Status: {task.status}</span>
              <button onClick={() => handleToggleStatus(task.id)} className="status-button">
                {task.status === "Pending" ? "Mark as Completed" : "Mark as Pending"}
              </button>
              <br />
              <span>
                  Priority:{" "}
                  <strong className={`priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </strong>
              </span>


              {/* ✅ Delete Button */}
              <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
