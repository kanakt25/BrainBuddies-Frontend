import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaCalculator, FaDesktop, FaUsers, FaSun, FaMoon } from 'react-icons/fa'; 
import ChatBot from '../components/ChatBot';
import '../styles/Home.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

gsap.registerPlugin(ScrollTrigger);

const departments = [
  {
    name: 'School of Sanskrit and Indic Studies',
    courses: ['M.A.', 'M.Phil.', 'Ph.D.'],
  },
  {
    name: 'School of Physical Sciences(SPS)',
    courses: ['Physics', 'Chemistry', 'Mathematics'],
  },
  {
    name: 'School of Computer & Systems Sciences (SC&SS)',
    courses: ['MCA', 'M.Tech', 'Ph.D.'],
  },
  {
    name: 'School of Social Sciences (SSS)',
    courses: ['Economics', 'History', 'Political Science', 'Sociology'],
  },
  {
    name: 'School of International Studies (SIS)',
    courses: ['Politics', 'Economics'],
  },
  {
    name: 'School of Life Sciences',
    courses: ['M.Sc. and Ph.D. degrees in Life Sciences'],
  },
  {
    name: 'School of Biotechnology',
    courses: [
      'M.Sc. in Biotechnology',
      'Ph.D. in Biotechnology',
      'M.Sc. in Computational and Integrative Sciences (specializations in Computational Biology and Complex Systems)',
    ],
  },
  {
    name: 'School of Computational and Integrative Sciences',
    courses: [
      'M.Sc. in Computational and Integrative Sciences',
      'Post-Graduate Diploma in Big Data Analytics',
      'Ph.D. in Computational and Integrative Sciences',
    ],
  },
  {
    name: 'School of Engineering',
    courses: [
      'B.Tech in Computer Science and Engineering (CSE)',
      'B.Tech in Electronics and Communication Engineering (ECE)',
      'Ph.D. in CSE, ECE, Mechanical Engineering',
    ],
  },
  {
    name: 'School of Arts & Aesthetics',
    courses: ['M.A. in Arts and Aesthetics', 'M.A. in Visual Studies, Cinema Studies, and Theatre and Performance Studies'],
  },
  {
    name: 'School of Environmental Sciences',
    courses: ['M.Sc. in Environmental Sciences'],
  },
  {
    name: 'Atal Bihari Vajpayee School of Management and Entrepreneurship',
    courses: ['MBA - Master of Business Administration', 'Ph.D. in Business Administration'],
  },
  {
    name: 'Special Centre for Disaster Research',
    courses: ['M.A.'],
  },
  {
    name: 'Special Centre for Molecular Medicine',
    courses: ['Ph.D.'],
  },
  {
    name: 'Special Centre for Nanoscience',
    courses: ['Ph.D.', 'M.Tech'],
  },
  {
    name: 'Special Centre for the Study of North East India',
    courses: ['M.A.', 'Ph.D.'],
  },
  {
    name: 'School of Language (SL)',
    courses: [
      'Arabic', 'Chinese', 'French', 'German', 'Japanese',
      'Korean', 'Persian', 'Russian', 'Sanskrit', 'Spanish',
    ],
  },
];

const popularSubjects = [
  'Physics', 'Computer Science', 'Economics', 'History', 'Mathematics', 'Biotechnology', 'Political Science'
];



const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1.2,
    });

    // Wait for locomotive to initialize before setting up ScrollTrigger
    setTimeout(() => {
      gsap.utils.toArray('.department-card').forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              scroller: scrollRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, 100); // short delay to let Locomotive Scroll initialize

    return () => {
      scroll.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchTypeChange = (e) => setSearchType(e.target.value);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.courses.some(course =>
      course.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="home-container" ref={scrollRef}>
      {/* Hero Section */}
      <div className="hero-section">
      <div className="hero-overlay"></div>
        <h1 className="home-heading">Welcome to BrainBuddies: The JNU Orbit</h1>
        <p className="home-subheading">Find or become a teacher for your subject at JNU</p>
        <button className="home-cta-btn" onClick={() => navigate('/search')}>Explore Teachers 🚀</button>
      </div>

      {/* Search Section */}
      <div className="search-wrapper">
  <div className="search-section">
    <select
      value={searchType}
      onChange={handleSearchTypeChange}
      className="search-type-dropdown"
    >
      <option value="name">Name</option>
      <option value="subject">Subject</option>
      <option value="department">Center</option>
    </select>

    <input
      type="text"
      placeholder={`🔍 Search by ${searchType}...`}
      value={searchQuery}
      onChange={handleSearchChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${searchType}`);
        }
      }}
      className="home-search-bar"
    />

    <button
      onClick={() => {
        if (searchQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${searchType}`);
        }
      }}
      className="home-search-btn"
    >
      Search
    </button>
  </div>
</div>


      {/* How It Works */}
      <div className="how-it-works">
        <h2>📚 How It Works</h2>
        <div className="steps">
          <div className="step">
            <span role="img" aria-label="search">🔎</span>
            <strong>Find a Teacher</strong> for your subject
          </div>
          <div className="step">
            <span role="img" aria-label="chat">💬</span>
            <strong>Chat or Book</strong> a session
          </div>
          <div className="step">
            <span role="img" aria-label="learn">🚀</span>
            <strong>Start Learning</strong> and grow
          </div>
        </div>
      </div>

      {/* Department Grid */}
      <div className="department-grid">
        {filteredDepartments.length ? filteredDepartments.map((dept, index) => (
          <div className="department-card" key={index}
          onClick={() => {
    navigate(`/search?q=${encodeURIComponent(dept.name)}&type=department`)
  }}
  style={{ cursor: 'pointer' }}
>
            <h3>{dept.name}</h3>
            <div className="course-icons">
              {dept.name.toLowerCase().includes('science') ? <FaCalculator /> : <FaBook />}
            </div>
            {dept.courses.length > 0 ? (
              <ul>
                {dept.courses.map((course, i) => (
                  <li key={i}>{course}</li>
                ))}
              </ul>
            ) : (
              <p>No course list provided</p>
            )}
          </div>
        )) : (
          <p className="no-results">No departments found for your search.</p>
        )}
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2>❤️ What Students Say</h2>
        <div className="testimonial">
          <p>“I found a great math tutor within 2 days. Super smooth experience!”</p>
          <span>— Aditi, MA Economics</span>
        </div>
        <div className="testimonial">
          <p>“Finally a platform just for JNU students to learn and connect!”</p>
          <span>— Priya, MSc Physics</span>
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Home;
