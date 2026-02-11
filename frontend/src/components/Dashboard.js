import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await userAPI.getProfile();
        setUser(profileResponse.data);
        const complaintsResponse = await userAPI.getUserComplaints(profileResponse.data._id);
        setComplaints(complaintsResponse.data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Welcome, {user.name}</h2>
          {user.profilePhoto && <img src={user.profilePhoto} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
        </div>
        <button onClick={() => navigate('/edit-profile')} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Edit Profile
        </button>
      </div>

      <h3>Your Complaints</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{complaint.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{complaint.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(complaint.created_at).toLocaleDateString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLogout} style={{ padding: '10px', marginTop: '20px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
