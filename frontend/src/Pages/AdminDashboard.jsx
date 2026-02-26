import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import API from "../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dummy Logged-in Admin
  const user = {
    name: "Admin User",
    email: "admin@cleanstreet.gov",
    role: "admin"
  };

  // Dummy Volunteers
  const [volunteers] = useState([
    { _id: "v1", name: "Rahul Sharma" },
    { _id: "v2", name: "Anjali Verma" },
    { _id: "v3", name: "Mohit Singh" }
  ]);

  // Dummy Complaints
  const [complaints, setComplaints] = useState([])

  useEffect(()=>{
    const fetchComplaints = async () => {
        try {
          const token = localStorage.getItem("token");
    
        const res = await API.get("/complaints",{
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
    
          
    
          setComplaints(res.data.complaints); // depends on your response structure
        } catch (error) {
          console.error("Error fetching complaints:", error);
        }
      };
    
      fetchComplaints();
  },[])

  const handleAssign = (complaintId, volunteerId) => {
    const volunteer = volunteers.find(v => v._id === volunteerId);

    const updatedComplaints = complaints.map(c => {
      if (c._id === complaintId) {
        return {
          ...c,
          assignedTo: volunteer.name,
          status: "assigned"
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login");
  };

  const reported = complaints.filter(c => c.status === "reported").length;
  const assigned = complaints.filter(c => c.status === "assigned").length;
  const inProgress = complaints.filter(c => c.status === "in_progress").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">CleanStreet Admin</div>

        <nav>
          <div className="nav-item active">Overview</div>
          <div className="nav-item">Manage Complaints</div>
          <div className="nav-item">Users</div>
          <div className="nav-item">Reports</div>
        </nav>

        <div className="admin-profile">
          <p>{user.name}</p>
          <span>{user.email}</span>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </header>

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>{complaints.length}</h3>
            <p>Total Complaints</p>
          </div>
          <div className="stat-card">
            <h3>{reported}</h3>
            <p>Reported</p>
          </div>
          <div className="stat-card">
            <h3>{assigned}</h3>
            <p>Assigned</p>
          </div>
          <div className="stat-card">
            <h3>{inProgress}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{resolved}</h3>
            <p>Resolved</p>
          </div>
        </section>

        {/* Complaint Table */}
        <section className="complaint-section">
          <h2>Manage Complaints</h2>

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Issue Type</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Action</th>
                <th>Register Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td style={{cursor : "pointer", color: "#1a237e", fontWeight: "600"}} onClick={()=>navigate(`/complaint/${complaint._id}`)}>{complaint.title}</td>
                  <td>{complaint.issueType}</td>
                  <td>{complaint.priority}</td>
                  
                  <td>
                    <span className={`status ${complaint.status}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>
        {complaint.status === "received" ? (
          <select
            onChange={(e) =>
              handleAssign(complaint._id, e.target.value)
            }
          >
            <option value="">Select Volunteer</option>
            {volunteers.map((vol) => (
              <option key={vol._id} value={vol._id}>
                {vol.name}
              </option>
            ))}
          </select>
        ) : (
          "Assigned"
        )}
      </td>
      <td>{complaint.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;