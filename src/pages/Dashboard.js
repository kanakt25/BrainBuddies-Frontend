import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaSearch, FaUser } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [currentRole, setCurrentRole] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [availability, setAvailability] = useState('');
  const [interests, setInterests] = useState([]);
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [centre, setCentre] = useState('');
  const [course, setCourse] = useState('');
  const [charge, setCharge] = useState('');

  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const handleProfileRedirect = () => {
  if (!user || !user._id ) {
    alert('Please complete your profile setup first');
    setShowEditProfile(true);
    return;
  }
  navigate(`/profile/${user._id}`);
};

  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedBio(user.bio || '');
      setCurrentRole(Array.isArray(user.role) ? user.role : [user.role]);
      setSubjects(user.subjects || []);
      setAvailability(user.availability || 'available');
      setInterests(user.interests || []);
      setExperience(user.experience || '');
      setQualification(user.qualification || '');
      setCentre(user.centre || '');
      setCourse(user.course || '');
      setCharge(user.charge || '');
    }
  }, [user]);

  if (!user) return <div className="dashboard-loading">Loading your dashboard...</div>;

  const handleCheckboxRoleToggle = async (roleToToggle) => {
    const token = getToken();
    if (!token) {
      alert("Session expired. Please log in again.");
      logout();
      return;
    }

    const currentRoles = Array.isArray(currentRole) ? currentRole : [currentRole];
    const newRoles = currentRoles.includes(roleToToggle)
      ? currentRoles.filter(role => role !== roleToToggle)
      : [...currentRoles, roleToToggle];

    // Validation
    if (newRoles.length === 0) {
      alert("You must have at least one role");
      return;
    }

    try {
      setIsUpdating(true);

      const response = await axios.put(
        '/api/users/update-role',
        { role: newRoles },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Role update failed on server");
      }

      // Ensure we're storing roles as an array
      const updatedRoles = Array.isArray(response.data.user.role)
        ? response.data.user.role
        : [response.data.user.role];

      setCurrentRole(updatedRoles);
      updateUser({ ...user, role: updatedRoles });

    } catch (error) {
      console.error('Role update failed:', {
        error: error.response?.data || error.message,
        status: error.response?.status
      });

      let errorMessage = "Failed to update role. ";

      if (error.response) {
        // Handle HTTP errors
        if (error.response.status === 401) {
          errorMessage += "Session expired. Please log in again.";
          logout();
        } else if (error.response.data?.message) {
          errorMessage += error.response.data.message;
        } else {
          errorMessage += `Server responded with status ${error.response.status}`;
        }
      } else {
        errorMessage += error.message || "Please try again later.";
      }

      alert(errorMessage);
      // Revert to previous roles if update failed
      setCurrentRole(user.role || ['Student']);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewProfilePic(file);
  };

  const handleSaveProfile = async () => {
    const token = getToken();
    if (!token) {
      alert("No token found, please log in again.");
      logout();
      return;
    }

    const formData = new FormData();
    formData.append('name', editedName);
    formData.append('bio', editedBio);
    formData.append('centre', centre);
    formData.append('course', course);

    if (newProfilePic) {
      formData.append('profilePic', newProfilePic);
    }

    if (currentRole.includes('Teacher')) {
      formData.append('subjects', JSON.stringify(subjects));
      formData.append('availability', availability);
      formData.append('experience', experience);
      formData.append('qualification', qualification);
      formData.append('charge', charge);
    }

    if (currentRole.includes('Student')) {
      formData.append('interests', JSON.stringify(interests));
    }

    for (let [key, value] of formData.entries()) {
    }

    try {
      setIsUpdating(true);

      const response = await axios.put('/api/users/update-profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Server response:", response);

      if (response.status === 200 || response.data?.success) {
        const updatedUser = response.data.user || response.data;
        if (updatedUser) {
          updateUser(updatedUser);
          setShowEditProfile(false);
          setNewProfilePic(null);
          alert("Profile updated successfully!");
          return;
        }
      }
      else {
        console.error("Update failed:", response.data.message);
        alert(response.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('An error occurred while updating your profile.');

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);

        if (err.response.status === 401) {
          alert("Session expired. Please log in again.");
          logout();
        } else if (err.response.data && err.response.data.message) {
          alert(`Error: ${err.response.data.message}`);
        } else {
          alert(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("No response from server. Check your network connection.");
      } else {

        console.error("Request setup error:", err.message);
        alert(`Request error: ${err.message}`);
      }

    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.name}!</h2>
        <div className="dashboard-actions">
          <button onClick={handleProfileRedirect}>Go to Profile</button>
        </div>
      </div>

      <div className="dashboard-role">
        <h4>My Role(s):</h4>
        <label>
          <input
            type="checkbox"
            checked={currentRole.includes('Student')}
            onChange={() => handleCheckboxRoleToggle('Student')}
            disabled={isUpdating}
          />
          Student
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="checkbox"
            checked={currentRole.includes('Teacher')}
            onChange={() => handleCheckboxRoleToggle('Teacher')}
            disabled={isUpdating}
          />
          Teacher
        </label>
      </div>

      <section className="profile-section">
        <h3>📄 My Profile</h3>
        {showEditProfile ? (
          <div className="edit-profile">
            <input
              type="text"
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              placeholder="Your name"
            />
            <textarea
              value={editedBio}
              onChange={e => setEditedBio(e.target.value)}
              placeholder="Your bio"
            />

            {currentRole.includes('Teacher') && (
              <>
                <input
                  type="text"
                  placeholder="Subjects (comma separated)"
                  value={subjects.join(', ')}
                  onChange={(e) =>
                    setSubjects(e.target.value.split(',').map(sub => sub.trim()))
                  }
                />
                <select
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                >
                  <option value="">Select Availability</option>
                   <option value="available">Available</option>
  <option value="unavailable">Unavailable</option>
                </select>

                <select
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                >
                  <option value="">Select Experience</option>
                  <option value="0">0 years</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years</option>
                  <option value="6">6 years</option>
                  <option value="7+">7+ years</option>
                </select>
                <input
                  type="text"
                  placeholder="Qualification"
                  value={qualification}
                  onChange={e => setQualification(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Course Name"
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                />
                <select
                  value={charge}
                  onChange={e => setCharge(e.target.value)}
                >
                  <option value="">Select Charge Type</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </>
            )}

            {currentRole.includes('Student') && (
              <>
                <input
                  type="text"
                  placeholder="Interests (comma separated)"
                  value={interests.join(', ')}
                  onChange={(e) =>
                    setInterests(e.target.value.split(',').map(int => int.trim()))
                  }
                />
              </>
            )}

            <input type="file" onChange={handleProfilePicChange} />
            {newProfilePic && <p>📸 Preview ready. Will upload on save.</p>}
            <button onClick={handleSaveProfile} disabled={isUpdating}>
              {isUpdating ? 'Saving Profile...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="profile-display">
            {user.profilePic && (
              <img src={user.profilePic} alt="Profile" className="profile-pic" />
            )}
            <p>{user.bio}</p>
            <button onClick={() => setShowEditProfile(true)}>Edit Profile</button>
          </div>
        )}
      </section>

      {currentRole.includes('Teacher') && (
        <section className="my-classes">
          <h3>👨‍🏫 My Classes / Students</h3>
          <ul>
            {user.students?.length > 0 ? (
              user.students.map(student => (
                <li key={student._id}>
                  <span>{student.name}</span>
                  <button>Chat</button>
                </li>
              ))
            ) : (
              <p>No students yet.</p>
            )}
          </ul>
        </section>
      )}

      {currentRole.includes('Student') && (
        <section className="my-teachers">
          <h3>📚 My Teachers / Booked Sessions</h3>
          <ul>
            {user.teachers?.length > 0 ? (
              user.teachers.map(teacher => (
                <li key={teacher._id}>
                  <span>{teacher.name}</span>
                  <button>Chat</button>
                  <button>Rate</button>
                </li>
              ))
            ) : (
              <p>No teachers booked yet.</p>
            )}
          </ul>
        </section>
      )}

      <section className="search-teachers">
        <h3>🔍 Search for Teachers / Subjects</h3>
        <button onClick={() => navigate('/search')}>
          <FaSearch /> Search
        </button>
      </section>

      <section className="recent-messages">
        <h3>💬 Recent Messages</h3>
        <div>
          <p>Recent chat with [Student/Teacher Name]</p>
          <button onClick={() => navigate('/messages')}>Go to Chatbox</button>
        </div>
      </section>

      <section className="upcoming-sessions">
        <h3>🗓️ Upcoming Sessions</h3>
        <p>No upcoming sessions yet.</p>
      </section>

      {currentRole.includes('Teacher') && (
        <section className="teaching-stats">
          <h3>🎓 Teaching Stats</h3>
          <p>Students taught: {user?.students?.length ?? 0}</p>
          <p>Ratings received: [Coming Soon]</p>
          <p>Teaching hours this month: [Coming Soon]</p>
        </section>
      )}

      <section className="announcements">
        <h3>📢 Announcements</h3>
        <p>No new announcements.</p>
      </section>


      <section className="logout">
        <button onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
