import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import API from "../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const user = {
    name: "Admin User",
    email: "admin@cleanstreet.gov",
    role: "admin"
  };

  const [volunteers, setVolunteers] = useState([]);

  const [complaints, setComplaints] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");

  const [filterIssueType, setFilterIssueType] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [filterAssignment, setFilterAssignment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteerFilter, setVolunteerFilter] = useState("");
  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/complaints", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComplaints(res.data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/volunteers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVolunteers(res.data.volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  fetchComplaints();
  fetchVolunteers();
}, []);



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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const received = complaints.filter(c => c.status === "received").length;
  const assigned = complaints.filter(c => c.status === "assigned").length;
  const inProgress = complaints.filter(c => c.status === "in_progress").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  const filteredComplaints = complaints.filter((complaint) => {

    if (searchQuery) {
      const text = searchQuery.toLowerCase();
      const match =
        complaint.title?.toLowerCase().includes(text) ||
        complaint.issueType?.toLowerCase().includes(text) ||
        complaint.address?.toLowerCase().includes(text);
      if (!match) return false;
    }

    if (filterIssueType && complaint.issueType !== filterIssueType) return false;
    if (filterPriority && complaint.priority !== filterPriority) return false;
    if (filterStatus && complaint.status !== filterStatus) return false;

    if (filterAssignment === "assigned" && !complaint.assignedTo) return false;
    if (filterAssignment === "unassigned" && complaint.assignedTo) return false;

    if (stateFilter) {
      if (!complaint.address?.toLowerCase().includes(stateFilter.toLowerCase())) {
        return false;
      }
    }
    if (volunteerFilter) {
      if (complaint.assigned_to?._id !== volunteerFilter) {
        return false;
       }
    }


    return true;
  });

  const handleClearFilters = () => {
    setFilterIssueType("");
    setFilterPriority("");
    setFilterStatus("");
    setStateFilter("");
    setFilterAssignment("");
    setSearchQuery("");
  };

  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}        

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>

        {/* ✅ OVERVIEW WITH FILTERS */}
        {activeSection === "overview" && (
          <>
            <section className="stats-grid">
              <div className="stat-card"><h3>{complaints.length}</h3><p>Total Complaints</p></div>
              <div className="stat-card"><h3>{received}</h3><p>Received</p></div>
              <div className="stat-card"><h3>{assigned}</h3><p>Assigned</p></div>
              <div className="stat-card"><h3>{inProgress}</h3><p>In Progress</p></div>
              <div className="stat-card"><h3>{resolved}</h3><p>Resolved</p></div>
            </section>

            {/* 🔥 FILTERS */}
            <div className="filter-controls" style={{marginBottom: "20px"}}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
              />

              <select value={filterPriority} onChange={(e)=>setFilterPriority(e.target.value)}>
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="received">Received</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select value={filterAssignment} onChange={(e)=>setFilterAssignment(e.target.value)}>
                <option value="">All</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>

              <select value={stateFilter} onChange={(e)=>setStateFilter(e.target.value)}>
                <option value="">All States</option>
                {states.map((state,index)=>(
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
              <select value={volunteerFilter} onChange={(e) => setVolunteerFilter(e.target.value)}>
                <option value="">All Volunteers</option>
                {volunteers.map((vol) => (
                  <option key={vol._id} value={vol._id}>{vol.name}</option>
                ))}
              </select>

              <button onClick={handleClearFilters}>Clear</button>
            </div>

            <section className="complaint-section">
              <h2>Recent Complaints</h2>
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Title</th><th>Issue</th><th>Priority</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.slice(0,5).map((complaint)=>(
                    <tr key={complaint._id}>
                      <td onClick={()=>navigate(`/complaint/${complaint._id}`)}>{complaint.title}</td>
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
      </main>
    </div>
  );
};

export default AdminDashboard;