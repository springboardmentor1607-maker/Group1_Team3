import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getVolunteerComplaints } from "../services/volunteerServices";
import "./VolunteerDashboard.css";
import { updateComplaintStatus } from "../services/complaintServices";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    issueType: "all",
    priority: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getVolunteerComplaints();
        setComplaints(response.complaints || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching volunteer complaints:", err);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);
  

  /* -------- Normalize Function -------- */
  const normalize = (value) =>
    value ? value.toString().toLowerCase().trim() : "";

  /* -------- Overview Stats -------- */
  const total = complaints.length;
  const received = complaints.filter(
    c => normalize(c.status) === "received"
  ).length;

  const inProgress = complaints.filter(
    c => normalize(c.status) === "in progress"
  ).length;

  const resolved = complaints.filter(
    c => normalize(c.status) === "resolved"
  ).length;

  /* -------- Filter Logic -------- */
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      return (
        (filters.issueType === "all" ||
          normalize(c.issueType) === normalize(filters.issueType)) &&
        (filters.priority === "all" ||
          normalize(c.priority) === normalize(filters.priority)) &&
        (filters.status === "all" ||
          normalize(c.status) === normalize(filters.status))
      );
    });
  }, [complaints, filters]);

  if (loading) return <div className="vd-loading">Loading...</div>;

  return (
    <div className="vd-container">

      {/* Header */}
      <div className="vd-header">
        <h2>Volunteer Dashboard</h2>
        <div className="vd-user" onClick={() => navigate("/profile")}>
          {user?.name}
        </div>
      </div>

      {/* Stats Section */}
      <div className="vd-stats">
        <div className="vd-stat-card">Total<br />{total}</div>
        <div className="vd-stat-card">Received<br />{received}</div>
        <div className="vd-stat-card">In Progress<br />{inProgress}</div>
        <div className="vd-stat-card">Resolved<br />{resolved}</div>
      </div>

      {/* Filters */}
      <div className="vd-filters">
        <select
          onChange={(e) =>
            setFilters({ ...filters, issueType: e.target.value })
          }
        >
          <option value="all">All Issue Types</option>
          <option value="Garbage">Garbage</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Water Leakage">Water Leakage</option>
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        >
          <option value="all">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="all">All Status</option>
          <option value="received">Received</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Complaint Grid */}
      <div className="vd-grid">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint._id}
            className="vd-card"
          >
            <h3>{complaint.title}</h3>
            <p>{complaint.description?.slice(0, 80)}...</p>

            <div className="vd-meta">
              <span>{complaint.priority}</span>
              <span>{complaint.status}</span>
            </div>
            <div className="vd-actions">
              <button
              onClick={async(e) => {
                e.stopPropagation();
                console.log("BUTTON CLICKED");
                try{
                await updateComplaintStatus(complaint._id, {status:"in_progress"});
                console.log("API CALLING");
                }catch(err){
                  console.error(err);
                }
              }}
            >
              Start Work
            </button>
            <button
            onClick={async(e) => {
              e.stopPropagation();
              try{
              await updateComplaintStatus(complaint._id,{status: "resolved"});
              console.log("API CALLED");
              }catch(err){
                console.error(err);
              }
             }}
             >
              Mark Resolved
            </button>
          </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default VolunteerDashboard;