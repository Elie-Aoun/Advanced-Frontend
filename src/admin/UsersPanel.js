import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UsersPanel.css";

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState({});
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortOption, setSortOption] = useState("NameAsc");

// Retrieve token and role directly from localStorage
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");



  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [users, roleFilter, sortOption]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5047/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5047/api/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Failed to load teams", error);
    }
  };

  const handleTeamSelect = (userId, teamId) => {
    setSelectedTeams({ ...selectedTeams, [userId]: teamId });
  };

  const assignToTeam = async (userId) => {
    const teamId = selectedTeams[userId];
    if (!teamId) {
      alert("Please select a team.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5047/api/admin/assign-to-team",
        { userId, teamId: parseInt(teamId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("User assigned to team successfully!");
      fetchUsers();
    } catch (error) {
      alert("Assignment failed");
      console.error(error);
    }
  };

  const promoteUser = async (userId) => {
    const teamId = selectedTeams[userId];
    
    if (!teamId) {
        alert("Please select a team before making a team leader.");
        console.error("No team selected for user:", userId);
        return;
    }

    console.log("Promoting user:", userId, "to team:", teamId);

    try {
        const response = await axios.post(
            "http://localhost:5047/api/admin/promote", 
            { userId, teamId },  // Ensure that teamId is passed correctly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        alert("User promoted to Team Leader and assigned to team!");
        fetchUsers(); // Refresh the users list to reflect the promotion
    } catch (error) {
        alert(error.response?.data || "Promotion failed");
        console.error("Error during promotion:", error);
    }
};
  const depromoteUser = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5047/api/admin/depromote",
        userId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Team Leader access revoked.");
      fetchUsers();
    } catch (error) {
      alert("Revoking failed.");
      console.error(error);
    }
  };

  const removeFromTeam = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5047/api/admin/remove-from-team",
        userId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("User removed from team.");
      fetchUsers();
    } catch (error) {
      alert("Failed to remove user from team.");
      console.error(error);
    }
  };

  const getTeamName = (teamId) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown";
  };

  const applyFiltersAndSorting = () => {
    let result = [...users];

    if (roleFilter !== "All") {
      result = result.filter((user) => user.role === roleFilter);
    }

    switch (sortOption) {
      case "NameAsc":
        result.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case "NameDesc":
        result.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case "EmailAsc":
        result.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case "EmailDesc":
        result.sort((a, b) => b.email.localeCompare(a.email));
        break;
      default:
        break;
    }

    setFilteredUsers(result);
  };

  return (
    <div className="users-panel-container">
      <h2 className="users-panel-header">All Users</h2>

      <div className="filter-sort-bar">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">Filter by Role</option>
          <option value="User">User</option>
          <option value="TeamLeader">Team Leader</option>
          <option value="Admin">Admin</option>
        </select>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="NameAsc">Sort by Name (A-Z)</option>
          <option value="NameDesc">Sort by Name (Z-A)</option>
          <option value="EmailAsc">Sort by Email (A-Z)</option>
          <option value="EmailDesc">Sort by Email (Z-A)</option>
        </select>
      </div>

      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} className="user-card">
            <strong>{user.fullName}</strong> ({user.email}) –{" "}
            {user.role === "TeamLeader" && user.teamId ? (
              <span>Team Leader of "{getTeamName(user.teamId)}"</span>
            ) : user.role === "User" && user.teamId ? (
              <span>Member of "{getTeamName(user.teamId)}"</span>
            ) : (
              <span>Role: <strong>{user.role}</strong></span>
            )}

            <br />

            {user.role !== "TeamLeader" && !user.teamId && (
              <>
                <select
                  value={selectedTeams[user.id] || ""}
                  onChange={(e) => handleTeamSelect(user.id, e.target.value)}
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                &nbsp;
                <button onClick={() => assignToTeam(user.id)}>Assign to Team</button>
              </>
            )}

            {user.teamId && (
              <>
                &nbsp;
                <button onClick={() => removeFromTeam(user.id)}>Remove from Team</button>
              </>
            )}

            {user.role === "User" && (
              <>
                &nbsp;
                <button onClick={() => promoteUser(user.id)}>Make Team Leader</button>
              </>
            )}

            {user.role === "TeamLeader" && (
              <>
                &nbsp;
                <button onClick={() => depromoteUser(user.id)}>Revoke Team Leader</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPanel;
