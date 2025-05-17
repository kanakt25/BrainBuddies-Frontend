import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
import '../styles/Chat.css';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

const Chat = () => {
  const { user, isProfileComplete } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const receiverId = queryParams.get('user');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [justSentId, setJustSentId] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch chat data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;

      try {
        const receiverRes = await axios.get(`http://localhost:5000/api/users/${receiverId}`);
        setReceiver(receiverRes.data.data || receiverRes.data);

        const messagesRes = await axios.get(`http://localhost:5000/api/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(messagesRes.data);
      } catch (err) {
        console.error('Error fetching chat data:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (receiverId && user) fetchData();
  }, [receiverId, user]);

  // Setup socket events
  useEffect(() => {
    if (!user?._id || !receiverId) return;

    socket.emit('joinRoom', { userId: user._id });

    socket.on('receiveMessage', (msg) => {
      if (
        (msg.sender === receiverId && msg.receiver === user._id) ||
        (msg.sender === user._id && msg.receiver === receiverId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('typing', ({ from }) => {
      if (from === receiverId) {
        setTypingIndicator(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingIndicator(false), 2000);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
    };
  }, [user?._id, receiverId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user._id,
      receiverId,
      text: newMessage,
    };

    socket.emit('sendMessage', messageData); // realtime emit

    try {
      const res = await axios.post(
        'http://localhost:5000/api/messages',
        {
          receiver: receiverId,
          text: newMessage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessages((prev) => [...prev, res.data]);
      setJustSentId(res.data._id);
      setNewMessage('');
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { from: user._id, to: receiverId });

    setIsTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  };

  if (loading) return <div className="chat-container loading">Loading messages...</div>;
  if (!receiver) return <div className="chat-container error">User not found.</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
        <h2>Chat with {receiver?.name || 'Unknown User'}</h2>
      </div>

      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isSent = message.sender === user._id;
            const senderName = message.sender?.name || "Unknown";
            const senderPic = message.sender?.profilePic || '/default-profile-pic.png'; 
            return (
              <div
                key={message._id || `${message.sender}-${message.createdAt}-${index}`}
                className={`message-container ${isSent ? 'sent' : 'received'}`}
              >
                <div className="sender-info ">
        <img src={senderPic} alt={`${senderName}'s profile`} className="sender-profile-pic" />
        <span className="sender-name">{senderName}</span>
      </div>
                <div className={`message ${isSent ? 'sent' : 'received'}`}>
                  <p>{message.text}</p>
                  <div className="message-meta">
                    <span className="message-time">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isSent && justSentId === message._id && (
                      <span className="sent-status">✓ Sent</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        )}

        {typingIndicator && <p className="typing-indicator">{receiver.name} is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <button
          type="button"
          className="emoji-toggle"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={300} />
          </div>
        )}
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
