import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/ChatList.css';

const ChatList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages/conversations/list', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setConversations(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  const handleChatClick = (userId) => {
    navigate(`/chat?user=${userId}`);
  };

  if (loading) return <div className="chat-list-container">Loading conversations...</div>;

  return (
    <div className="chat-list-container">
      <h2>Your Conversations</h2>
      {conversations.length > 0 ? (
        <div className="conversation-list">
          {conversations.map((conversation) => {
            const participant =
              conversation.sender._id === user._id ? conversation.receiver : conversation.sender;

            return (
              <div 
                key={conversation._id} 
                className="conversation-item"
                onClick={() => handleChatClick(participant._id)}
              >
                <img 
                  src={participant.profilePic || '/default.jpeg'} 
                  alt={participant.name}
                  className="profile-pic"
                />
                <div className="conversation-info">
                  <h4>{participant.name}</h4>
                  <p className="last-message">
                    {conversation.text.length > 30 
                      ? `${conversation.text.substring(0, 30)}...` 
                      : conversation.text}
                  </p>
                  <p className="message-time">
                    {new Date(conversation.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No conversations yet. Start chatting with teachers!</p>
      )}
    </div>
  );
};

export default ChatList;
