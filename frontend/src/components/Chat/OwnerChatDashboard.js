// src/components/Owner/OwnerChatDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from '../Chat/ChatWindow';
import Header from '../Common/Header';


const OwnerChatDashboard = () => {
  const ownerId = localStorage.getItem('uId');
  const [conversations, setConversations] = useState([]);
  const [activeChatUserId, setActiveChatUserId] = useState(null);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `https://agri-products.onrender.com/api/chats/conversations/${ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const senderIds = res.data.map((c) => c.senderId);
        setConversations(senderIds);

        // Fetch user details (name/email)
        const users = await Promise.all(
          senderIds.map((id) =>
            axios.get(`https://agri-products.onrender.com/api/user/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        const map = {};
        users.forEach((res, index) => {
          map[senderIds[index]] = res.data;
        });
        setUserMap(map);
      } catch (err) {
        console.error("Failed to fetch conversations or user data", err);
      }
    };

    if (ownerId) {
      fetchConversations();
    }
  }, [ownerId]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header />
      <header
        style={{
          backgroundColor: '#2f855a',
          padding: '15px 20px',
          color: 'white',
          fontWeight: '700',
          fontSize: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        🌿 Owner Chat Inbox
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: '1',
          padding: '20px',
          maxWidth: '600px',
          margin: '20px auto',
          width: '90%',
          backgroundColor: '#f7faf6',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        {!activeChatUserId && (
          <>
            <h4 style={{ marginBottom: '20px', color: '#276749' }}>Incoming Chats</h4>
            {conversations.length === 0 ? (
              <p style={{ color: '#4a5568', fontStyle: 'italic' }}>No conversations yet.</p>
            ) : (
              conversations.map((uid) => (
                <div
                  key={uid}
                  onClick={() => setActiveChatUserId(uid)}
                  style={{
                    border: '1px solid #c6f6d5',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#e6fffa',
                    boxShadow: '0 2px 6px rgba(72, 187, 120, 0.2)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(72, 187, 120, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(72, 187, 120, 0.2)';
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#276749' }}>
                    {userMap[uid]?.name || 'Unknown User'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#4a5568', marginTop: '4px' }}>
                    {userMap[uid]?.email}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeChatUserId && (
          <ChatWindow
            receiverId={activeChatUserId}
            onClose={() => setActiveChatUserId(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#2f855a',
          color: 'white',
          textAlign: 'center',
          padding: '12px 20px',
          fontSize: '0.9rem',
          boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
        }}
      >
        &copy; {new Date().getFullYear()} AgriProduct. All rights reserved.
      </footer>
    </div>
  );
};

export default OwnerChatDashboard;
