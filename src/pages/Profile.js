// src/pages/Profile.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileDetails from '../components/ProfileDetails';
import { AuthContext } from '../context/AuthContext';
import '../styles/Profile.css';
import gsap from 'gsap';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileRef = useRef(null);

  const isOwnProfile = !id || id === user?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = id || user?._id;

        if (!userId) throw new Error("No user ID available");

        const res = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(res.data?.data || res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);

        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Profile not found or something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user?._id, navigate, logout]);

  useEffect(() => {
    if (profileRef.current) {
      gsap.fromTo(
        profileRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
      );
    }
  }, [profileData]);

  const handleEdit = () => navigate('/dashboard');
  const handleChat = (receiverId) => navigate(`/chat/${receiverId}`);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error-profile fade-in">{error}</div>;
  }

  if (!profileData) {
    return <div className="error-profile fade-in">Profile not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container" ref={profileRef}>
        <ProfileDetails
          profileData={profileData}
          isOwnProfile={isOwnProfile}
          onEdit={handleEdit}
          onChat={handleChat}
        />
      </div>
    </div>
  );
};

export default Profile;
