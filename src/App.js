// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import OtherUserProfile from './pages/OtherUserProfile';
import Faq from './pages/Faq';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/Footer';
import Chat from './components/Chat';
import ChatList from './components/ChatList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar /> {/* ✅ Shared navbar for all routes */}

          <div className="main-content" style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:id" element={<OtherUserProfile />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/chat" element={<Chat />} />
              <Route path="/messages" element={<ChatList />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
