// src/components/ProfileDetails.js
import React from 'react';
import '../styles/ProfileDetails.css'; 

const ProfileDetails = ({ profileData = {}, isOwnProfile, onEdit, onChat }) => {
  const capitalize = (word = '') =>
    word.charAt(0).toUpperCase() + word.slice(1);

  // Calculate average rating if ratings exist
  const averageRating = profileData.ratings?.length
    ? (
        profileData.ratings.reduce((acc, r) => acc + r, 0) /
        profileData.ratings.length
      ).toFixed(1)
    : null;

  // Compose profile picture URL
  const profilePicUrl = profileData.profilePic
    ? profileData.profilePic.startsWith('http')
      ? profileData.profilePic
      : `http://localhost:5000${profileData.profilePic}`
    : '/default-profile.png';

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={profilePicUrl}
          alt={`${profileData.name || 'User'} Profile`}
          className="profile-image"
        />
        <div className="profile-info">
          <div className="profile-name">{profileData.name || 'Unknown User'}</div>
          <div className="profile-role">
            Role:{' '}
            {Array.isArray(profileData.role)
              ? profileData.role.map(capitalize).join(', ')
              : capitalize(profileData.role) || 'Not specified'}
          </div>
          <div className="profile-bio">{profileData.bio || 'No bio added yet.'}</div>
        </div>
      </div>

      {/* General Information */}
      <div className="profile-section">
        <div className="section-title">🏫 School / Centre</div>
        <p>{profileData.department || 'Not specified'}</p>
      </div>

      {/* Teacher-specific Info */}
      {profileData.role?.includes('Teacher') && (
        <>
          <div className="profile-section">
            <div className="section-title">📚 Subjects</div>
            <div className="subject-tags">
              {profileData.subjects?.length > 0 ? (
                profileData.subjects.map((subj, i) => (
                  <span key={i} className="subject-tag">
                    {subj}
                  </span>
                ))
              ) : (
                <p>No subjects added yet.</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-title">🎓 Qualification</div>
            <p>{profileData.qualification || 'Not specified'}</p>
          </div>

          <div className="profile-section">
            <div className="section-title">🧑‍💼 Experience</div>
            <p>{profileData.experience || 'Not specified'}</p>
          </div>

          <div className="profile-section">
            <div className="section-title">💰 Charge</div>
            <p>{profileData.charge || 'Not specified'}</p>
          </div>
        </>
      )}

      {/* Student-specific Info */}
      {profileData.role?.includes('Student') && (
        <>
          <div className="profile-section">
            <div className="section-title">🎯 Interests</div>
            <div className="subject-tags">
              {profileData.interests?.length > 0 ? (
                profileData.interests.map((interest, i) => (
                  <span key={i} className="subject-tag">
                    {interest}
                  </span>
                ))
              ) : (
                <p>No interests added yet.</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-title">📘 Course Name</div>
            <p>{profileData.course || 'Not specified'}</p>
          </div>
        </>
      )}

      {/* Availability */}
      <div className="profile-section">
        <div className="section-title">🗓️ Availability</div>
        {Array.isArray(profileData.availability) && profileData.availability.length > 0 ? (
          <p>{profileData.availability.join(', ')}</p>
        ) : (
          <p>Availability info not added.</p>
        )}
      </div>

      {/* Ratings Section (Teachers Only) */}
      {profileData.role?.includes('Teacher') && (
        <div className="profile-section">
          <div className="section-title">🌟 Ratings</div>
          {averageRating ? (
            <p>
              Average Rating: {averageRating} / 5 ({profileData.ratings.length} ratings)
            </p>
          ) : (
            <p>No ratings yet.</p>
          )}
        </div>
      )}

      {/* Students List (Teachers Only) */}
      {profileData.role?.includes('Teacher') && (
        <div className="profile-section">
          <div className="section-title">👨‍🎓 Students</div>
          {profileData.students?.length > 0 ? (
            <ul className="connection-list">
              {profileData.students.map((student) => (
                <li key={student._id || student.id}>
                  <button
                    className="chat-button"
                    onClick={() => onChat?.(student._id || student.id)}
                  >
                    💬 {student.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No students yet.</p>
          )}
        </div>
      )}

      {/* Teachers List (Students Only) */}
      {profileData.role?.includes('Student') && (
        <div className="profile-section">
          <div className="section-title">👩‍🏫 Teachers</div>
          {profileData.teachers?.length > 0 ? (
            <ul className="connection-list">
              {profileData.teachers.map((teacher) => (
                <li key={teacher._id || teacher.id}>
                  <button
                    className="chat-button"
                    onClick={() => onChat?.(teacher._id || teacher.id)}
                  >
                    💬 {teacher.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No teachers yet.</p>
          )}
        </div>
      )}

      {/* Edit Profile Button */}
      {isOwnProfile && (
        <button className="edit-profile-btn" onClick={onEdit}>
          ✏️ Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileDetails;
