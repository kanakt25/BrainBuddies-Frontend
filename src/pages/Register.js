import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import departments from '../data/departments';
import '../styles/Register.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: [],
    bio: '',
    department: '',
    qualification: '',
    experience: '',
    charge: '',
    courseName: '',
    interestedSubjects: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        role: checked
          ? [...prev.role, value]
          : prev.role.filter((r) => r !== value)
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation before submitting
    if (!form.name || !form.email || !form.password || form.role.length === 0 || !form.department) {
      alert('Please fill all required fields');
      return;
    }

    // Email validation (must end with @jnu.ac.in)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@jnu\.ac\.in$/;
    if (!emailRegex.test(form.email)) {
      alert('Not eligible: Please register with your JNU email_id');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', form);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.response?.data?.msg || 'Error occurred');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-heading">Register</h2>

        <input
          className="register-input"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="register-input"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="register-input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <textarea
          className="register-input"
          name="bio"
          placeholder="Short bio"
          value={form.bio}
          onChange={handleChange}
        />

        <select
          className="register-input"
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        >
          <option value="">Select School/Centre</option>
          {departments.map((dept, idx) => (
            <option key={idx} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              value="Student"
              onChange={handleChange}
              checked={form.role.includes('Student')}
            /> Student
          </label>
          <label>
            <input
              type="checkbox"
              value="Teacher"
              onChange={handleChange}
              checked={form.role.includes('Teacher')}
            /> Teacher
          </label>
        </div>

        {/* Conditionally render teacher-specific fields */}
        {form.role.includes('Teacher') && (
          <>
            <select
              className="register-input"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              required
            >
              <option value="">Select Qualification</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="PhD">PhD</option>
            </select>

            <select
              className="register-input"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select Experience</option>
              <option value="0">0</option>
              <option value="0-1">0-1 year</option>
              <option value="1-2">1-2 years</option>
              <option value="2-3">2-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-7">5-7 years</option>
              <option value="7+">7+ years</option>
            </select>

            <select
              className="register-input"
              name="charge"
              value={form.charge}
              onChange={handleChange}
              required
            >
              <option value="">Charge</option>
              <option value="unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </>
        )}

        {/* Conditionally render student-specific fields */}
        {form.role.includes('Student') && (
          <>
            <input
              className="register-input"
              name="courseName"
              placeholder="Course Name"
              value={form.courseName}
              onChange={handleChange}
              required
            />

            <input
              className="register-input"
              name="interestedSubjects"
              placeholder="Interested Subjects"
              value={form.interestedSubjects}
              onChange={handleChange}
            />
          </>
        )}

        <button type="submit" className="register-button">Register</button>

        <div className="register-links">
          <Link to="/login" className="register-link">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
