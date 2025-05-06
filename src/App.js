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
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User level routes */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <RequireRole allowedRoles={['User', 'TeamLeader', 'Admin']}>
              <Dashboard />
            </RequireRole>
          </RequireAuth>
        } />
        <Route path="/my-projects" element={
          <RequireAuth>
            <RequireRole allowedRoles={['User', 'TeamLeader', 'Admin']}>
              <MyProjects />
            </RequireRole>
          </RequireAuth>
        } />
        <Route path="/user-dashboard" element={
          <RequireAuth>
            <RequireRole allowedRoles={['User']}>
              <UserDashboard />
            </RequireRole>
          </RequireAuth>
        } />

        {/* Team Leader routes */}
        <Route path="/teams" element={
          <RequireAuth>
            <RequireRole allowedRoles={['TeamLeader', 'Admin']}>
              <Teams />
            </RequireRole>
          </RequireAuth>
        } />
        <Route path="/projects/:id" element={
          <RequireAuth>
            <RequireRole allowedRoles={['TeamLeader', 'Admin']}>
              <ProjectDetails />
            </RequireRole>
          </RequireAuth>
        } />
        <Route path="/team-leader-dashboard" element={
          <RequireAuth>
            <RequireRole allowedRoles={['TeamLeader']}>
              <TeamLeaderDashboard />
            </RequireRole>
          </RequireAuth>
        } />
        <Route path="/admin/projects" element={
          <RequireAuth>
            <RequireRole allowedRoles={['TeamLeader']}>
              <CreateProject />
            </RequireRole>
          </RequireAuth>
        } />

        {/* Admin routes */}
        <Route path="/admin/users" element={
          <RequireAuth>
            <RequireRole allowedRoles={['Admin']}>
              <UsersPanel />
            </RequireRole>
          </RequireAuth>
        } />
        <Route path="/admin/create-team" element={
          <RequireAuth>
            <RequireRole allowedRoles={['Admin']}>
              <CreateTeam />
            </RequireRole>
          </RequireAuth>
        } />
        <Route path="/admin-dashboard" element={
          <RequireAuth>
            <RequireRole allowedRoles={['Admin']}>
              <AdminDashboard />
            </RequireRole>
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;
