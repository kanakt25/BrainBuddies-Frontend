import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Search.css';

const Search = () => {
  const { user } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [charge, setCharge] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const type = queryParams.get('type') || 'name';

  useEffect(() => {
    setSearchInput(query); // Sync search input with query param
  }, [query]);

  // Fetch all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/teachers');
        setTeachers(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Error fetching teachers:', err);
      }
    };

    fetchTeachers();
  }, []);

  // Filter teachers based on query parameters
  useEffect(() => {
    let filteredResults = teachers;

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredResults = filteredResults.filter((teacher) => {
        if (type === 'name') {
          return teacher.name?.toLowerCase().includes(lowerQuery);
        } else if (type === 'subject') {
          return teacher.subjectsOffered?.some((sub) =>
            sub.toLowerCase().includes(lowerQuery)
          );
        } else if (type === 'department') {
          return teacher.department?.toLowerCase().includes(lowerQuery);
        }
        return false;
      });
    }

    // Filter by minimum experience
    if (minExperience) {
      filteredResults = filteredResults.filter(
        (teacher) => teacher.experience >= minExperience
      );
    }

    // Filter by charge (paid/unpaid)
    if (charge) {
      filteredResults = filteredResults.filter(
        (teacher) => teacher.charge?.toLowerCase() === charge.toLowerCase()
      );
    }

    setFiltered(filteredResults);
  }, [query, type, teachers, minExperience, charge]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}&type=${type}`);
    }
  };

  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleChatClick = (receiverId) => {
    navigate(`/chat?user=${receiverId}`);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const defaultProfilePic = '/default.jpeg';

  return (
    <div className="search-container">
      <h2>🔍 Find a Teacher</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <select
          value={type}
          onChange={(e) => navigate(`/search?q=${encodeURIComponent(query)}&type=${e.target.value}`)}
          className="search-type-dropdown"
        >
          <option value="name">Name</option>
          <option value="subject">Subject</option>
          <option value="department">Center</option>
        </select>

        <input
          placeholder={`Search by ${type}...`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>

        {/* Filter Button */}
        <button className="filter-button" onClick={toggleFilters}>
          ⚙️ Filters
        </button>
      </div>

      {/* Filters Dropdown */}
      {filtersVisible && (
        <div className="filters-dropdown">
          <div>
            <label>Min Experience (years)</label>
            <select onChange={(e) => setMinExperience(e.target.value)}>
              <option value="">Any</option>
              <option value="1">1-2 Years</option>
              <option value="2">2-3 Years</option>
              <option value="3">3-4 Years</option>
              <option value="4">4-5 Years</option>
              <option value="5">5-6 Years</option>
              <option value="7">7+ Years</option>
            </select>
          </div>

          <div>
            <label>Charge</label>
            <select onChange={(e) => setCharge(e.target.value)}>
              <option value="">Any</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="teacher-list">
        {filtered.length > 0 ? (
          filtered.map((teacher) => (
            <div key={teacher._id} className="teacher-card">
              <img
                src={teacher.profilePic || defaultProfilePic}
                alt={`${teacher.name}'s profile`}
                className="profile-pic"
              />
              <h4
                onClick={() => handleProfileClick(teacher._id)}
                className="teacher-name"
              >
                {teacher.name}
              </h4>
              <p>{teacher.bio}</p>
              <p>
                <strong>Subjects:</strong>{' '}
                {Array.isArray(teacher.subjectsOffered) && teacher.subjectsOffered.length > 0
                  ? teacher.subjectsOffered.join(', ')
                  : 'No subjects specified'}
              </p>
              <p><strong>Department:</strong> {teacher.department || 'N/A'}</p>
              <p><strong>Experience:</strong> {teacher.experience} years</p>
              <p><strong>Charge:</strong> {teacher.charge}</p>
              {user && user._id !== teacher._id && (
                <button
                  onClick={() => handleChatClick(teacher._id)}
                  className="chat-button"
                >
                  Chat with {teacher.name}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No teachers found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
