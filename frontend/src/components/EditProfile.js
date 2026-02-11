import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({ name: '', location: '', profilePhoto: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setFormData({
          name: response.data.name,
          location: response.data.location,
          profilePhoto: response.data.profilePhoto
        });
      } catch (err) {
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.getProfile();
      await userAPI.updateProfile(response.data._id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Update failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Edit Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          name="profilePhoto"
          placeholder="Profile Photo URL"
          value={formData.profilePhoto}
          onChange={handleChange}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <button type="submit" style={{ padding: '10px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Save Changes
        </button>
        <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '10px', width: '100%', marginTop: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none' }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
