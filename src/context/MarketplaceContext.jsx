import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const MarketplaceContext = createContext();
const socket = io('http://localhost:5000');

export const useMarketplace = () => useContext(MarketplaceContext);

export const MarketplaceProvider = ({ children }) => {
  const [requirements, setRequirements] = useState([]);
  const [directProducts, setDirectProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
  const [userName, setUserName] = useState(() => {
    const stored = localStorage.getItem('userName');
    if (stored === 'User') { localStorage.clear(); return null; }
    return stored;
  });
  const [myBids, setMyBids] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [stats, setStats] = useState({ requirements: 0, totalBids: 0 });
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [userSpecialty, setUserSpecialty] = useState(() => localStorage.getItem('userSpecialty'));
  const [userOfferType, setUserOfferType] = useState(() => localStorage.getItem('userOfferType'));

  const addNotification = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg, type }, ...prev.slice(0, 9)]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const login = (role, name, specialty, offerType) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
    setUserSpecialty(specialty || null);
    setUserOfferType(offerType || null);
    localStorage.setItem('user', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
    if (specialty) localStorage.setItem('userSpecialty', specialty);
    if (offerType) localStorage.setItem('userOfferType', offerType);
    if (role === 'seller') {
      fetch(`http://localhost:5000/api/bids/${encodeURIComponent(name)}`)
        .then(r => r.json()).then(setMyBids).catch(() => {});
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    setUserSpecialty(null);
    setUserOfferType(null);
    setMyBids([]);
    setNotifications([]);
    localStorage.clear();
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/requirements').then(r => r.json()).then(setRequirements).catch(() => {});
    fetch('http://localhost:5000/api/products').then(r => r.json()).then(setDirectProducts).catch(() => {});
    fetch('http://localhost:5000/api/stats').then(r => r.json()).then(setStats).catch(() => {});
    // restore seller bids on refresh
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    if (storedRole === 'seller' && storedName) {
      fetch(`http://localhost:5000/api/bids/${encodeURIComponent(storedName)}`)
        .then(r => r.json())
        .then(setMyBids)
        .catch(() => {});
    }

    socket.on('new_requirement', (req) => {
      setRequirements(prev => [req, ...prev]);
      setStats(prev => ({ ...prev, requirements: prev.requirements + 1 }));
    });

    socket.on('update_requirement', (updated) => {
      setRequirements(prev => prev.map(r => r.id === updated.id ? updated : r));
      setMyBids(prev => prev.map(b => {
        const found = updated.bids?.find(rb => rb.id === b.id);
        return found ? { ...b, status: found.status } : b;
      }));
    });

    socket.on('online_count', setOnlineCount);
    socket.on('stats_update', setStats);

    return () => {
      socket.off('new_requirement');
      socket.off('update_requirement');
      socket.off('online_count');
      socket.off('stats_update');
    };
  }, []);

  // Register presence and listen for personal notifications when logged in
  useEffect(() => {
    if (!isAuthenticated || !userName) return;

    socket.emit('user_online', { userName, userRole });

    // Listen for incoming messages on any room and notify if not currently in that room
    const handleIncomingMsg = (roomId) => (msg) => {
      if (msg.senderName !== userName && activeRoomId !== roomId) {
        addNotification(`💬 New message from ${msg.senderName}: "${msg.text.slice(0, 40)}${msg.text.length > 40 ? '...' : ''}"`, 'info');
      }
    };

    // We track rooms by listening to a global message event from server
    socket.on('incoming_message', ({ roomId, msg }) => {
      if (msg.senderName !== userName && activeRoomId !== roomId) {
        addNotification(`💬 New message from ${msg.senderName}: "${msg.text.slice(0, 40)}${msg.text.length > 40 ? '...' : ''}"`, 'info');
      }
    });

    // Seller: listen for bid status updates
    const bidStatusKey = `bid_status_${userName}`;
    const handleBidStatus = ({ status, reqTitle }) => {
      addNotification(
        status === 'accepted' ? `🎉 Your bid on "${reqTitle}" was accepted!` : `Your bid on "${reqTitle}" was rejected.`,
        status === 'accepted' ? 'success' : 'error'
      );
    };
    socket.on(bidStatusKey, handleBidStatus);

    return () => {
      socket.off(bidStatusKey, handleBidStatus);
      socket.off('incoming_message');
    };
  }, [isAuthenticated, userName, userRole, activeRoomId, addNotification]);

  // Buyer: listen for new bids on their requirements
  useEffect(() => {
    if (!isAuthenticated || userRole !== 'buyer') return;
    const myReqIds = requirements.filter(r => r.postedBy === userName).map(r => r.id);
    const handlers = [];
    myReqIds.forEach(reqId => {
      const key = `bid_received_${reqId}`;
      const handler = ({ bid, reqTitle }) => {
        addNotification(`💼 New bid ₹${bid.amount} from ${bid.sellerName} on "${reqTitle}"`, 'bid');
      };
      socket.on(key, handler);
      handlers.push({ key, handler });
    });
    return () => handlers.forEach(({ key, handler }) => socket.off(key, handler));
  }, [isAuthenticated, userRole, userName, requirements, addNotification]);

  const placeBid = ({ reqId, reqTitle, amount, delivery, proposal }) => {
    const bid = { id: Date.now(), reqId, reqTitle, amount, delivery, proposal, sellerName: userName, buyerName: requirements.find(r => r.id === reqId)?.postedBy, status: 'pending' };
    socket.emit('place_bid', bid);
    setMyBids(prev => [bid, ...prev]);
  };

  const acceptBid = (reqId, bidId) => socket.emit('accept_bid', { reqId, bidId });
  const rejectBid = (reqId, bidId) => socket.emit('reject_bid', { reqId, bidId });

  const addRequirement = async (req) => {
    const newReq = {
      ...req,
      postedBy: userName,
      budgetText: getBudgetText(req.budget),
      timelineText: getTimelineText(req.timeline)
    };
    try {
      await fetch('http://localhost:5000/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
    } catch (err) { console.error(err); }
  };

  const getBudgetText = (b) => ({ small: '< ₹5,000', medium: '₹5,000 - ₹25,000', large: '₹25,000 - ₹1,00,000', xlarge: '₹1,00,000+' }[b] || 'Flexible');
  const getTimelineText = (t) => ({ urgent: 'Within 48h', week: 'Within 1 week', month: 'Within 1 month' }[t] || 'Flexible');

  return (
    <MarketplaceContext.Provider value={{
      requirements, directProducts, addRequirement,
      isAuthenticated, userRole, userName, userSpecialty, userOfferType,
      myBids, placeBid, acceptBid, rejectBid,
      notifications, addNotification,
      onlineCount, stats, activeRoomId, setActiveRoomId,
      login, logout, socket
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
