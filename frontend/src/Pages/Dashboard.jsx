import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
    console.log("Complaints:", complaints);


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");

        const res=await axios.get("http://localhost:5000/api/complaints/my-complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", res.data);
        const sortedComplaints = res.data.complaints.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
        setComplaints(sortedComplaints);
      } catch ( error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  },[]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  if (isAdmin) {
    return (
      <div className="dashboard-wrapper">
        <div className="app-container">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="logo-container">
              <div className="logo-icon">
                <i className="fa-solid fa-city"></i>
              </div>
              <div className="logo-text">CleanStreet</div>
            </div>

            <div className="section-title" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', paddingLeft: '1rem', marginBottom: '0.5rem', border: 'none' }}>Admin Panel</div>

            <nav className="nav-links">
              <a href="#" className="nav-item active">
                <i className="fa-solid fa-layer-group nav-icon"></i>
                <span>Overview</span>
              </a>
              <a href="#" className="nav-item">
                <i className="fa-solid fa-list-check nav-icon"></i>
                <span>Manage Complaints</span>
              </a>
              <a href="#" className="nav-item">
                <i className="fa-solid fa-users nav-icon"></i>
                <span>Users</span>
              </a>
              <a href="#" className="nav-item">
                <i className="fa-solid fa-chart-pie nav-icon"></i>
                <span>Reports</span>
              </a>
            </nav>

            <div className="sidebar-footer">
              <div className="user-mini-profile">
                <div className="avatar" style={{ backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
                <div className="user-info">
                  <h4>{user.name || 'Admin User'}</h4>
                  <p>{user.email || 'admin@cleanstreet.gov'}</p>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}></i>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <header className="top-header">
              <div className="page-title">
                <h1>Admin Dashboard</h1>
              </div>
              <div className="header-actions">
                <button className="action-btn btn-text">Dashboard</button>
              <button className="action-btn btn-text" onClick={() => navigate('/reportissue')}>Report Issue</button>
                <button className="action-btn btn-text">View Complaints</button>
                <button className="action-btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }} onClick={handleLogout}>Login</button>
                <button className="action-btn btn-primary">Register</button>
              </div>
            </header>

            <div className="dashboard-container">
              {/* System Overview */}
              <section className="section-card" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                <div className="section-header">
                  <h2 className="section-title" style={{ borderLeft: 'none', padding: 0, fontSize: '1.5rem' }}>System Overview</h2>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(26, 35, 126, 0.1)' }}>
                      <i className="fa-solid fa-list"></i>
                    </div>
                    <div className="stat-value">4</div>
                    <div className="stat-label">Total Complaints</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 127, 23, 0.1)', color: 'var(--color-warning)' }}>
                      <i className="fa-solid fa-user-clock"></i>
                    </div>
                    <div className="stat-value">4</div>
                    <div className="stat-label">Pending Review</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-success)' }}>
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <div className="stat-value">1,234</div>
                    <div className="stat-label">Active Users</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(2, 119, 189, 0.1)', color: 'var(--color-info)' }}>
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div className="stat-value">0</div>
                    <div className="stat-label">Resolved Today</div>
                  </div>
                </div>
              </section>

              {/* Community Impact */}
              <section className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Community Impact</h2>
                </div>
                <div className="content-block">
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Thanks to citizen reports and community engagement, we've resolved <strong style={{ color: 'var(--color-primary)' }}>124 issues</strong> this month, making our city cleaner and safer for everyone.
                  </p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="dashboard-wrapper">
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fa-solid fa-city"></i>
            </div>
            <div className="logo-text">CleanStreet</div>
          </div>

          <div className="section-title" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', paddingLeft: '1rem', marginBottom: '0.5rem', border: 'none' }}>User Panel</div>

          <nav className="nav-links">
            <a href="#" className="nav-item active">
              <i className="fa-solid fa-house nav-icon"></i>
              <span>Dashboard</span>
            </a>
            <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/reportissue'); }}>
              <i className="fa-solid fa-pen-to-square nav-icon"></i>
              <span>Report Issue</span>
            </a>
            <a href="#" className="nav-item">
              <i className="fa-solid fa-eye nav-icon"></i>
              <span>View Complaints</span>
            </a>
            <a href="#" className="nav-item">
              <i className="fa-solid fa-map-location-dot nav-icon"></i>
              <span>Issue Map</span>
            </a>
          </nav>

          <div className="sidebar-footer" onClick={()=>navigate("/profile")} style={{cursor : "pointer"}}>
            <div className="user-mini-profile">
              <div className="avatar" style={{ backgroundColor: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
              </div>
              <div className="user-info">
                <h4>{user.name || 'John Doe'}</h4>
                <p>{user.email || 'john.doe@email.com'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="top-header">
            <div className="page-title">
              <h1>User Dashboard</h1>
            </div>
            <div className="header-actions">
              <button className="action-btn btn-text">Dashboard</button>
              <button className="action-btn btn-text" onClick={() => navigate('/reportissue')}>Report Issue</button>
              <button className="action-btn btn-text">View Complaints</button>
              <button className="action-btn btn-primary" onClick={handleLogout}>Logout</button>
            </div>
          </header>

          <div className="dashboard-container">
            {/* Overview Stats */}
            <section className="section-card" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
              <div className="stats-grid">
                <div className="stat-card" style={{ borderTop: '4px solid var(--color-danger)' }}>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(198, 40, 40, 0.1)', color: 'var(--color-danger)' }}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div className="stat-value">{complaints.length}</div>
                  <div className="stat-label">Total Issues</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(2, 119, 189, 0.1)', color: 'var(--color-info)' }}>
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="stat-value">{complaints.filter(c => c.status === "received").length}</div>
                  <div className="stat-label">Pending</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 127, 23, 0.1)', color: 'var(--color-warning)' }}>
                    <i className="fa-solid fa-gear"></i>
                  </div>
                  <div className="stat-value">{complaints.filter(c => c.status === "in_progress").length}</div>
                  <div className="stat-label">In Progress</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-success)' }}>
                    <i className="fa-regular fa-circle-check"></i>
                  </div>
                  <div className="stat-value">{complaints.filter(c => c.status === "resolved").length}</div>
                  <div className="stat-label">Resolved</div>
                </div>
              </div>
            </section>

            <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              {/* Recent Activity */}
              <section className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Recent Activity</h2>
                </div>
                <div className="activity-list">
                  {complaints.slice(0, 5).map((complaint) => (
                     <div className="activity-item" key={complaint._id}>
                      <div
                      className="activity-icon"
                      style={{
                        backgroundColor:
                        complaint.status === "resolved"
                        ? "var(--color-success)"
                        : "var(--color-info)",
                      }}
                    >
                      <i
                      className={
                        complaint.status === "resolved"
                        ? "fa-solid fa-check"
                        : "fa-solid fa-plus"
                      }
                    ></i>
                  </div>
                  <div className="activity-content">
                    <h4>{complaint.title}</h4>
                    <div className="activity-time">
                       {new Date(complaint.created_at).toLocaleString()}
                       </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid">
                  <button className="action-card-btn primary" onClick={() => navigate('/reportissue')}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i>
                    Report New Issue
                  </button>
                  <button className="action-card-btn">
                    <i className="fa-solid fa-list" style={{ marginRight: '8px' }}></i>
                    View All Complaints
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
