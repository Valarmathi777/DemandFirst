import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Moon, Sun, Bell, Users } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

const Navbar = ({ theme, toggleTheme }) => {
  const { isAuthenticated, userRole, userName, logout, notifications, onlineCount } = useMarketplace();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const notifColor = { bid: '#ec4899', success: '#34d399', error: '#f87171', info: '#818cf8' };

  return (
    <header className="navbar animate-fade-in">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Layers className="logo-icon" size={28} />
          Demand<span className="text-gradient">First</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {!(isAuthenticated && userRole === 'seller') && (
            <Link to="/shop" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ color: 'var(--primary-color)' }}>●</span> Direct Shop
            </Link>
          )}
          {(!isAuthenticated || userRole === 'buyer') && <Link to="/buyer-dashboard" className="nav-link">For Buyers</Link>}
          {(!isAuthenticated || userRole === 'seller') && <Link to="/seller-dashboard" className="nav-link">For Sellers</Link>}
        </nav>

        <div className="auth-buttons flex-gap">
          {/* Online count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#10b981' }}>
            <Users size={14} />
            <span>{onlineCount} online</span>
          </div>

          {/* Notifications */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)}>
                <div style={{ position: 'relative' }}>
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: '#ec4899', borderRadius: '50%', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                      {notifications.length}
                    </span>
                  )}
                </div>
              </button>
              {showNotifications && (
                <div className="dropdown-menu" style={{ width: '320px', maxHeight: '400px', overflowY: 'auto' }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    Notifications
                    {notifications.length > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{notifications.length} new</span>}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No notifications yet</div>
                  ) : notifications.map(n => (
                    <div key={n.id} className="dropdown-item" style={{ borderLeft: `3px solid ${notifColor[n.type] || '#818cf8'}` }}>
                      <div style={{ fontSize: '0.85rem' }}>{n.msg}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Theme */}
          <button className="btn-icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Hi, <strong style={{ color: 'var(--text-primary)' }}>{userName}</strong>
              </span>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', height: '40px' }} onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', height: '40px' }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem', height: '40px' }}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
