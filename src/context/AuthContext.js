// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utility to set or clear token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const isAuthenticated = () => {
    return !!user?.token;
  };

  // Clear token and user data from storage
  const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  // Load auth data from local/session storage
  const loadAuthData = () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');

      if (token) {
        if (token.split('.').length !== 3) {
          console.error('Malformed token found in storage');
          clearAuthStorage();
          return;
        }

        setAuthToken(token);

        const parsedUser = userData ? JSON.parse(userData) : null;
        const userWithToken = parsedUser ? { ...parsedUser, token } : null;

        setUser(userWithToken);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load once on component mount
  useEffect(() => {
    loadAuthData();
  }, []);

  // Login user and store token/user info
  const login = (userData, token, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(userData));

    const userWithToken = { ...userData, token };

    setAuthToken(token);
    setUser(userWithToken);
    setLoading(false);

    console.log('🚀 Logged in:', userWithToken);
  };

  // Logout user, clear storage, and run optional callback
  const logout = (callback) => {
    setUser(null);
    clearAuthStorage();
    setAuthToken(null);
    setLoading(false);

    console.log('👋 Logged out');

    if (typeof callback === 'function') {
      callback();
    }
  };

  // Update user profile info in context + storage
  const updateUser = (updatedUser) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storage = localStorage.getItem('token') ? localStorage : sessionStorage;

    storage.setItem('user', JSON.stringify(updatedUser));

    if (token) setAuthToken(token);
    setUser(updatedUser);
  };

  // Fetch user data from backend (by ID)
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user?._id) return null;

    try {
      const res = await axios.get(`/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      return null;
    }
  };

  const isProfileComplete = (user) => {
  return user?._id && user?.name && user?.role?.length > 0;
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isProfileComplete: isProfileComplete(user),
        login,
        logout,
        setUser,
        updateUser,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
