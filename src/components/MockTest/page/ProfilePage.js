import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import ".//ProfilePage.css"

const ProfilePage = () => {
  const [user, setUser] = useState(null); // For profile details
  const [users, setUsers] = useState([]); // For admin's user list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // Toggle dropdown
  const [showManageUsers, setShowManageUsers] = useState(false); // Manage Users toggle
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" }); // For adding users
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfileAndUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        // Fetch profile
        const profileResponse = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(profileResponse.data);

        // Fetch admin data if the role is admin
        if (profileResponse.data.role === "admin") {
          const usersResponse = await axios.get("http://localhost:5000/api/admin/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(usersResponse.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/admin/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers([...users, response.data]);
      setNewUser({ name: "", email: "", role: "user" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users.map(({ name, email }) => ({ name, email }))); // Only export name and email
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Registered_Users.xlsx");
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Get the initial of the user's name
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div
      className="profile-container"
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* User Badge in Top-Right Corner */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: user.role === "admin" ? "#4CAF50" : "#2196F3",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {initial}
        </div>
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "0",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "200px",
            }}
          >
            <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
              <li
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={handleLogout}
              >
                Logout
              </li>
              {user.role === "admin" && (
                <li
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowManageUsers(!showManageUsers);
                    setShowDropdown(false);
                  }}
                >
                  Manage Users
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>{user.name}</h2>
        <p>Role: <strong>{user.role}</strong></p>
      </div>

      {/* Manage Users Section */}
      {user.role === "admin" && showManageUsers && (
        <div
          style={{
            marginTop: "20px",
            background: "#e8f5e9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Manage Users</h3>
          {/* Add User Form */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Add User</h4>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={handleAddUser} style={{ padding: "5px 10px" }}>
              Add User
            </button>
          </div>

          {/* Users Table */}
          <h4>Registered Users</h4>
          <button
            onClick={handleExportToExcel}
            style={{
              marginBottom: "20px",
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Export to Excel
          </button>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>#</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem, index) => (
                <tr key={userItem._id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{userItem.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{userItem.email}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{userItem.role}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleDeleteUser(userItem._id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    {/* 🔙 Back Button */}
<button className="back-btn-fixed" onClick={() => navigate(-1)}>
  ← Back
</button>

        </div>
      )}

     

    </div>
  );
};

export default ProfilePage;

