import React, { useEffect, useState, useRef } from 'react';
import { getSocket } from '../../utils/socket';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ receiverId, onClose }) => {
  const userId = localStorage.getItem('uId');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://agri-products.onrender.com/api/chats/${userId}/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages.');
      }
    };

    if (userId && receiverId) fetchMessages();

    const socket = getSocket();

    socket.on('receive_message', (message) => {
      if (
        (message.senderId === receiverId && message.receiverId === userId) ||
        (message.senderId === userId && message.receiverId === receiverId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('message_sent', () => setSending(false));

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
    };
  }, [userId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      senderId: userId,
      receiverId,
      message: input.trim(),
    };

    const socket = getSocket();
    socket.emit('send_message', messageData);

    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        _id: Date.now(),
        timestamp: new Date(),
      },
    ]);
    setInput('');
    setSending(true);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h4>💬 Chat with Seller</h4>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="chat-body">
  {messages.map((msg) => (
    <div
      key={msg._id}
      className={`message-bubble ${msg.senderId === userId ? 'sent' : 'received'}`}
    >
      <div>{msg.message}</div>
      <div className="timestamp">{formatTime(msg.timestamp)}</div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={sending}
        />
        <button onClick={sendMessage} disabled={sending || input.trim() === ''}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default ChatWindow;
