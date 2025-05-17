import React, { useState } from 'react';
import axios from 'axios';

const RateTeacher = ({ teacherId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/reviews/${teacherId}`, { rating, review });
      alert('Review submitted!');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Rate this teacher</h3>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
        <option value="">Select Rating</option>
        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Write a review..." />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RateTeacher;
