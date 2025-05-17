// src/pages/OtherUserProfile.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileDetails from '../components/ProfileDetails';
import { AuthContext } from '../context/AuthContext';
import '../styles/Profile.css';

const OtherUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!id) {
          throw new Error("No user ID specified");
        }

        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedData = {
          ...res.data.data, 
          subjects: res.data.data?.subjects || [],
          interests: res.data.data?.interests || [],
          students: res.data.data?.students || [],
          teachers: res.data.data?.teachers || [],
          ratings: res.data.data?.ratings || [],
          // Ensure all required fields have defaults
          role: res.data.data?.role || [],
          department: res.data.data?.department || 'Not specified',
          bio: res.data.data?.bio || 'No bio added yet',
          qualification: res.data.data?.qualification || 'Not specified',
          experience: res.data.data?.experience || 'Not specified',
          charge: res.data.data?.charge || 'Not specified',
          courseName: res.data.data?.courseName || 'Not specified',
          availability: Array.isArray(res.data.data?.availability) 
            ? res.data.data.availability 
            : ['Not specified'],
          profilePic: res.data.data?.profilePic || '/default-profile.png'
        };

        setProfileData(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.response?.data?.message || "Failed to load profile");
        
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate, logout]);

  if (loading) {
    return (
      <div className="other-user-profile-container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="other-user-profile-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="other-user-profile-container">
        <p className="error-text">Profile not found</p>
      </div>
    );
  }
  
 return (
  <div className="profile-page"> 
    <div className="profile-container"> 
      <ProfileDetails
        profileData={profileData}
        isOwnProfile={false}
        onChat={(targetId) => navigate(`/chat/${targetId}`)}
      />
    </div>
  </div>
);
};

export default OtherUserProfile;