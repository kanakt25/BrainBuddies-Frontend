import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', 
        {
          email: form.email,
          password: form.password,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { token, user } = res.data;
      if (!token || !user) throw new Error('Invalid response from server');

      login(user, token, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-heading">Login</h2>

        <input
          className="login-input"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            className="login-input"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />{' '}
            Remember Me
          </label>
          <div className="login-links">
            <Link to="/forgot-password" className="login-link">
              Forgot Password?
            </Link>
            <Link to="/register" className="login-link">
              Don't have an account?
            </Link>
          </div>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
