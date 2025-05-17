import React, { useState } from 'react';
import '../styles/Faq.css';

const faqData = [
  {
    question: 'What is BrainBuddies: The JNU Orbit?',
    answer: 'BrainBuddies: The JNU Orbit is a platform where JNU students can find or become subject-specific teachers within the JNU community.',
  },
  {
    question: 'How do I register as a teacher or student?',
    answer: 'During registration, you can select your role as a student, teacher, or both. Based on your choice, you’ll be asked to provide relevant details.',
  },
  {
    question: 'Can I switch roles later?',
    answer: 'Yes, you can update your role anytime from the Dashboard by toggling between Student and Teacher.',
  },
  {
    question: 'How do I contact a teacher?',
    answer: 'Use the search page to find a teacher by subject or department, then click “Chat” to initiate a conversation.',
  },
  {
    question: 'Is my profile visible to everyone?',
    answer: 'Only limited public information like your name, subject, and role is visible. Sensitive info is protected.',
  },
  {
    question: 'How do I edit my profile?',
    answer: 'Go to your Dashboard or Profile page and click on “Edit Profile” to change your name, bio, subjects, availability, and more.',
  },
  {
    question: 'Who can join the platform?',
    answer: 'Any student of JNU can join as a teacher, student, or both by registering and setting up a profile.',
  },
  {
    question: 'Is this platform free to use?',
    answer: 'Yes, the platform is free to use. However, some teachers may choose to charge for sessions, which will be clearly mentioned.',
  },
  {
    question: 'Can I teach and learn at the same time?',
    answer: 'Yes, users can sign up as both a teacher and a student.',
  },
  {
    question: 'I’m facing issues. Whom do I contact?',
    answer: 'Use the “Contact” link in the footer or email us at kanakt90_scs@jnu.ac.in',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>❓ Frequently Asked Questions</h1>
      {faqData.map((item, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggle(index)}>
            <span>{openIndex === index ? '▼' : '▶'}</span> {item.question}
          </div>
          {openIndex === index && <div className="faq-answer">{item.answer}</div>}
        </div>
      ))}
      
    </div>
  );
};

export default Faq;
