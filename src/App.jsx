import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostNeed from './pages/PostNeed';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import BidComparison from './pages/BidComparison';
import Shop from './pages/Shop';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import './App.css';

const ToastContainer = () => {
  const { notifications } = useMarketplace();
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'none' }}>
      {notifications.slice(0, 3).map(n => (
        <div key={n.id} className="glass-panel animate-fade-in" style={{ padding: '0.875rem 1.25rem', minWidth: '280px', maxWidth: '360px', borderLeft: `4px solid ${n.type === 'success' ? '#34d399' : n.type === 'error' ? '#f87171' : n.type === 'bid' ? '#ec4899' : '#818cf8'}`, fontSize: '0.9rem' }}>
          {n.msg}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  // Pass toggleTheme to Navbar
  return (
    <MarketplaceProvider>
      <div className="app-bg"></div>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/post-need" element={<PostNeed />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/compare/:id" element={<BidComparison />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </main>
    </MarketplaceProvider>
  );
}

export default App;
