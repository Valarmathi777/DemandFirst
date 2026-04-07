import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';

const Chat = () => {
  const { id: roomId } = useParams();
  const location = useLocation();
  const { socket, userName, userRole, setActiveRoomId } = useMarketplace();

  const otherName = location.state?.sellerName || null;
  const reqTitle = location.state?.reqTitle || '';

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!roomId || !otherName) return;
    setActiveRoomId(roomId);
    fetch(`http://localhost:5000/api/chat/${roomId}`)
      .then(r => r.json())
      .then(setMessages)
      .catch(() => {});

    const key = `room_message_${roomId}`;
    const handler = (newMsg) => setMessages(prev => [...prev, newMsg]);
    socket.on(key, handler);
    return () => {
      socket.off(key, handler);
      setActiveRoomId(null);
    };
  }, [roomId, otherName, socket, setActiveRoomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    socket.emit('send_message', { roomId, text: msg.trim(), senderName: userName, senderRole: userRole });
    setMsg('');
  };

  if (!userName) return (
    <div className="container section" style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Not logged in</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Please log in to use chat.</p>
    </div>
  );

  if (!otherName) return (
    <div className="container section" style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>No conversation selected</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Open a chat from an accepted bid.</p>
    </div>
  );

  const initials = otherName.slice(0, 2).toUpperCase();

  return (
    <div className="container section animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ display: 'flex', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex-space" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color-2)', flexShrink: 0 }}>
          <div className="flex-gap">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{otherName}</div>
              {reqTitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Re: {reqTitle}</div>}
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> Online
              </div>
            </div>
          </div>
          <div className="flex-gap">
            <button className="btn-icon" style={{ width: '32px', height: '32px' }}><Phone size={16} /></button>
            <button className="btn-icon" style={{ width: '32px', height: '32px' }}><Video size={16} /></button>
            <button className="btn-icon" style={{ width: '32px', height: '32px' }}><MoreVertical size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              Start the conversation with {otherName}
            </div>
          )}
          {messages.map(m => {
            const isMe = m.senderName === userName;
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                {!isMe && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{m.senderName}</div>}
                <div style={{
                  background: isMe ? 'var(--primary-color)' : 'var(--surface-color-3)',
                  color: isMe ? 'white' : 'var(--text-primary)',
                  padding: '0.65rem 1rem',
                  borderRadius: '1rem',
                  borderBottomRightRadius: isMe ? '0.2rem' : '1rem',
                  borderBottomLeftRadius: isMe ? '1rem' : '0.2rem',
                  maxWidth: '65%',
                  wordBreak: 'break-word'
                }}>
                  {m.text}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>{m.time}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color-2)', flexShrink: 0 }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder={`Message ${otherName}...`}
              className="input-field"
              style={{ flex: 1, margin: 0, padding: '0.75rem 1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }} disabled={!msg.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
