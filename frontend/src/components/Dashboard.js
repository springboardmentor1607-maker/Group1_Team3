import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Hardcoded stats
  const stats = {
    total: 3,
    pending: 1,
    inProgress: 1,
    resolved: 1
  };

  // Hardcoded recent activity
  const activities = [
    { title: 'Pothole on Highway resolved', time: '2 hours ago' },
    { title: 'New streetlight issue reported', time: '4 hours ago' },
    { title: 'Garbage dump complaint updated', time: '6 hours ago' }
  ];

  const styles = {
    navbar: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    navMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '30px'
    },
    navLink: {
      textDecoration: 'none',
      color: '#6b7280',
      fontWeight: '500',
      fontSize: '16px',
      cursor: 'pointer'
    },
    activeLink: {
      color: '#3b82f6'
    },
    authButtons: {
      display: 'flex',
      gap: '10px'
    },
    outlineButton: {
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    primaryButton: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px',
      fontFamily: 'Inter, Roboto, sans-serif'
    },
    header: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '30px'
    },
    statsRow: {
      display: 'flex',
      gap: '20px',
      marginBottom: '40px',
      flexWrap: 'wrap'
    },
    statCard: {
      flex: '1',
      minWidth: '200px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px',
      textAlign: 'center'
    },
    statIcon: {
      fontSize: '48px',
      marginBottom: '10px'
    },
    statNumber: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '5px'
    },
    statLabel: {
      color: '#6b7280',
      fontSize: '14px'
    },
    mainContent: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    leftColumn: {
      flex: '0 0 70%',
      minWidth: '300px'
    },
    rightColumn: {
      flex: '0 0 30%',
      minWidth: '250px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '20px'
    },
    activityCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px',
      position: 'relative'
    },
    activityItem: {
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid #e5e7eb'
    },
    activityTitle: {
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '5px'
    },
    activityTime: {
      color: '#6b7280',
      fontSize: '14px'
    },
    floatingButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    actionsCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px'
    },
    actionButton: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      border: '1px solid #d1d5db'
    },
    disabledButton: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    navMenu: {
  display: "flex",
  alignItems: "center",
  gap: "25px",
  marginLeft: "40px",   // 👈 shifts entire menu right
}
  };

  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.logo}>Dashboard</div>
        <div style={styles.navMenu}>
          <span style={{ ...styles.navLink, ...styles.activeLink }}>Dashboard</span>
          <span style={styles.navLink}>Report Issue</span>
          <span style={styles.navLink}>View Complaints</span>
          <div style={styles.authButtons}>
            <button style={styles.outlineButton} onClick={() => navigate('/login')}>Login</button>
            <button style={styles.primaryButton} onClick={() => navigate('/signup')}>Register</button>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        {/* <h2 style={styles.header}>Dashboard</h2> */}

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚠️</div>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Issues</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🕒</div>
          <div style={styles.statNumber}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚙️</div>
          <div style={styles.statNumber}>{stats.inProgress}</div>
          <div style={styles.statLabel}>In Progress</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statNumber}>{stats.resolved}</div>
          <div style={styles.statLabel}>Resolved</div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.leftColumn}>
          <h2 style={styles.sectionTitle}>Recent Activity</h2>
          <div style={styles.activityCard}>
            <button style={styles.floatingButton}>+</button>
            {activities.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityTitle}>{activity.title}</div>
                <div style={styles.activityTime}>{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.rightColumn}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsCard}>
            <button style={{ ...styles.actionButton, ...styles.primaryButton }}>
              ➕ Report New Issue
            </button>
            <button style={{ ...styles.actionButton, ...styles.secondaryButton }}>
              📋 View All Complaints
            </button>
            <button style={{ ...styles.actionButton, ...styles.disabledButton }} disabled>
              🗺️ Issue Map
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
