import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams"; // Import Teams Page
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateProject from "./admin/CreateProject";
import UsersPanel from "./admin/UsersPanel";
import CreateTeam from "./admin/CreateTeam";
import MyProjects from "./TeamLeader/MyProjects";
import ProjectDetails from "./TeamLeader/ProjectDetails";
import AdminDashboard from "./pages/AdminDashboard";
import TeamLeaderDashboard from "./pages/TeamLeaderDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teams" element={<Teams />} /> {/* Add Teams Route */}
        <Route path="/register" element={<Register />} />
        <Route path="/admin/projects" element={<CreateProject />} />
        <Route path="/admin/users" element={<UsersPanel />} />
        <Route path="/admin/create-team" element={<CreateTeam />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/team-leader-dashboard" element={<TeamLeaderDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
