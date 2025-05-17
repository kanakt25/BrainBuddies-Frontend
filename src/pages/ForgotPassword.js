import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(res.data.msg || 'Check your email for reset instructions');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p>Enter your email and we’ll send you reset instructions</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-input"
        />
        <button type="submit" className="forgot-button">Send Reset Link</button>
        {message && <p className="forgot-message">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
