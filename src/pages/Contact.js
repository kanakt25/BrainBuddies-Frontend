import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/contact/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert('Message Sent!');
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        alert('Failed to send message.');
      }
    } catch (err) {
      alert('Server error.');
      console.error(err);
    }

    // Clear the form
    setFormData({
        name: '',
        email: '',
        message: '',
      });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p className="contact-intro">
        We'd love to hear from you! Whether you have questions, suggestions, or just want to connect, feel free to reach out.
      </p>

      <div className="contact-form-section">
        <h2>📬 Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="contact-submit-btn">Send Message</button>
        </form>
      </div>

      <div className="contact-details">
        <h2>📍 Our Location</h2>
        <p>Jawaharlal Nehru University, New Delhi, India</p>
        
        <h2>📧 Email Us</h2>
        <p>kanakt90_scs@jnu.ac.in</p>

        <h2>📞 Call Us</h2>
        <p>+91 8960671705</p>
      </div>
    </div>
  );
};

export default Contact;
