import React from 'react';
import '../styles/About.css';
const About = () => {
  return (
    <div className="about-container">
      <h1>About JNU Study Connect</h1>

      <p className="about-intro">
        JNU Study Connect is a student-led initiative that bridges the gap between those seeking help and those willing to offer it.
        Built with the spirit of peer-to-peer collaboration, it allows JNU students to teach, learn, and grow together.
      </p>

      {/* Mission */}
      <div className="about-section">
        <h2>🎯 Our Mission</h2>
        <p>
          To create a self-sustaining academic support system within the JNU community by enabling students to:
        </p>
        <ul>
          <li>Find peers who can help with subjects they struggle with</li>
          <li>Share their knowledge as part-time tutors or mentors</li>
          <li>Collaborate on academic and co-curricular projects</li>
        </ul>
      </div>

      {/* Vision */}
      <div className="about-section">
        <h2>🔭 Our Vision</h2>
        <p>
          To build a collaborative learning ecosystem where knowledge flows freely among students,
          fostering academic excellence and community strength across all schools and centers at JNU.
        </p>
      </div>

      {/* Who It's For */}
      <div className="about-section">
        <h2>🧑‍🤝‍🧑 Who Is It For?</h2>
        <p>
          Whether you're a first-year student navigating new subjects or a senior wanting to give back, JNU Study Connect is for:
        </p>
        <ul>
          <li>Students who want help in specific subjects or projects</li>
          <li>Students willing to teach others based on their expertise</li>
          <li>Anyone looking to build meaningful academic relationships</li>
        </ul>
      </div>

      {/* How It Works */}
      <div className="about-section">
        <h2>🔧 How It Works</h2>
        <p>
          Register with your JNU details, select your role(s) — student, teacher, or both — and start connecting:
        </p>
        <ol>
          <li>Create and personalize your profile</li>
          <li>Search for subjects or teachers</li>
          <li>Chat and schedule sessions</li>
          <li>Learn, teach, and collaborate</li>
        </ol>
      </div>

      {/* Core Values */}
      <div className="about-section">
        <h2>💡 Core Values</h2>
        <ul>
          <li>🎓 Student Empowerment</li>
          <li>👐 Collaboration Over Competition</li>
          <li>🤝 Inclusivity and Mutual Respect</li>
          <li>🔁 Continuous Feedback and Growth</li>
        </ul>
      </div>

      {/* Testimonials */}
      <div className="about-section testimonials">
        <h2>💬 What Students Say</h2>
        <blockquote>
          “This platform helped me find a senior who made Statistics much easier for me.”
          <br /><span>- Aditi, MA Economics</span>
        </blockquote>
        <blockquote>
          “Great idea! I’ve already taken two sessions with different teachers. Super helpful.”
          <br /><span>- Manish, BA Political Science</span>
        </blockquote>
      </div>

      {/* Footer */}
      <div className="about-footer">
        <p>Made by students, for students. 🌱</p>
      </div>
    </div>
  );
};

export default About;
