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
  const [complaints, setComplaints] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [filterIssueType, setFilterIssueType] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const received = complaints.filter(c => c.status === "received").length;
  const assigned = complaints.filter(c => c.status === "assigned").length;
  const inProgress = complaints.filter(c => c.status === "in_progress").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  // Filter complaints based on selected filters
  const filteredComplaints = complaints.filter(complaint => {
    if (filterIssueType && complaint.issueType !== filterIssueType) return false;
    if (filterPriority && complaint.priority !== filterPriority) return false;
    if (filterStatus && complaint.status !== filterStatus) return false;
    return true;
  });

  const handleClearFilters = () => {
    setFilterIssueType("");
    setFilterPriority("");
    setFilterStatus("");
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">🏛️ CleanStreet Admin</div>

        <nav>
          <div 
            className={`nav-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            📊 Overview
          </div>
          <div 
            className={`nav-item ${activeSection === "complaints" ? "active" : ""}`}
            onClick={() => navigate("/manage-complaints")}
          >
            📝 Manage Complaints
          </div>
          <div 
            className={`nav-item ${activeSection === "users" ? "active" : ""}`}
            onClick={() => setActiveSection("users")}
          >
            👥 Users
          </div>
          <div 
            className={`nav-item ${activeSection === "reports" ? "active" : ""}`}
            onClick={() => setActiveSection("reports")}
          >
            📈 Reports
          </div>
        </nav>

        <div className="admin-profile">
          <p>👤 {user.name}</p>
          <span>📧 {user.email}</span>
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

        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            {/* Stats */}
            <section className="stats-grid">
              <div className="stat-card">
                <h3>{complaints.length}</h3>
                <p>Total Complaints</p>
              </div>
              <div className="stat-card">
                <h3>{received}</h3>
                <p>Received</p>
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

            {/* Complaint Table Preview */}
            <section className="complaint-section">
              <h2>Recent Complaints</h2>

              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Issue Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Register Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint._id}>
                      <td style={{cursor : "pointer", color: "#1a237e", fontWeight: "600"}} onClick={()=>navigate(`/complaint/${complaint._id}`)}>{complaint.title}</td>
                      <td>{complaint.issueType}</td>
                      <td>{complaint.priority}</td>
                      <td>
                        <span className={`status ${complaint.status}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>{complaint.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* Manage Complaints Section - Full Page */}
        {activeSection === "complaints" && (
          <section className="complaint-section full-page">
            <div className="complaints-header">
              <h2>Manage All Complaints</h2>
              
              <div className="filter-controls">
                <select 
                  value={filterIssueType} 
                  onChange={(e) => setFilterIssueType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Issue Types</option>
                  <option value="garbage">Garbage</option>
                  <option value="water_leak">Water Leak</option>
                  <option value="streetlight">Streetlight</option>
                  <option value="pothole">Pothole</option>
                </select>

                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Status</option>
                  <option value="reported">Reported</option>
                  <option value="received">Received</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <button onClick={handleClearFilters} className="clear-filter-btn">
                  Clear Filters
                </button>
              </div>
            </div>

            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Issue Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Register Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
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
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <section className="complaint-section">
            <h2>Users Management</h2>
            <p>Users management content coming soon...</p>
          </section>
        )}

        {/* Reports Section */}
        {activeSection === "reports" && (
          <section className="complaint-section">
            <h2>Reports</h2>
            <p>Reports content coming soon...</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;