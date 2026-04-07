import React, { useState, useEffect } from 'react';
import { Filter, Star, Clock, Zap, X, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';

const SellerDashboard = () => {
  const { requirements, isAuthenticated, userRole, userName, userSpecialty, userOfferType, myBids, placeBid } = useMarketplace();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matches');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDelivery, setBidDelivery] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [newReqIds, setNewReqIds] = useState(new Set());
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (requirements.length === 0) return;
    const latest = requirements[0];
    setNewReqIds(prev => new Set([...prev, latest.id]));
    const t = setTimeout(() => setNewReqIds(prev => { const s = new Set(prev); s.delete(latest.id); return s; }), 8000);
    return () => clearTimeout(t);
  }, [requirements.length]);

  if (!isAuthenticated || userRole !== 'seller') {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You must be logged in as a Seller.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Log In as Seller</button>
      </div>
    );
  }

  const openBidModal = (req) => { setSelectedReq(req); setShowBidModal(true); };
  const closeBidModal = () => { setShowBidModal(false); setSelectedReq(null); setBidAmount(''); setBidDelivery(''); setBidProposal(''); };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    placeBid({ reqId: selectedReq.id, reqTitle: selectedReq.title, amount: bidAmount, delivery: bidDelivery, proposal: bidProposal });
    closeBidModal();
    setActiveTab('active');
  };

  const alreadyBid = (reqId) => myBids.some(b => b.reqId === reqId);
  const filteredReqs = filter === 'all' ? requirements : requirements.filter(r => r.type === filter);
  const acceptedBids = myBids.filter(b => b.status === 'accepted');
  const statusColor = { pending: '#fbbf24', accepted: '#34d399', rejected: '#f87171' };

  return (
    <div className="container section animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Seller <span className="text-gradient">Hub</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live requirements feed — submit bids and win projects.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Bids</div>
            <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '1.2rem' }}>{myBids.filter(b => b.status === 'pending').length}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Won</div>
            <div style={{ fontWeight: 'bold', color: '#34d399', fontSize: '1.2rem' }}>{acceptedBids.length}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <aside className="sidebar">
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {userName?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{userName}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                  {userSpecialty ? userSpecialty.charAt(0).toUpperCase() + userSpecialty.slice(1) : 'Seller'}
                  {userOfferType && <span style={{ marginLeft: '0.4rem', color: 'var(--text-secondary)' }}>· {userOfferType === 'both' ? 'Services & Products' : userOfferType === 'service' ? 'Services' : 'Products'}</span>}
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Bids</span>
                <strong>{myBids.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Pending</span>
                <strong style={{ color: '#fbbf24' }}>{myBids.filter(b => b.status === 'pending').length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Won</span>
                <strong style={{ color: '#34d399' }}>{acceptedBids.length}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[['matches', '🔥 Live Feed'], ['active', '📋 My Bids'], ['won', '🏆 Won Projects']].map(([tab, label]) => (
              <button key={tab} className={`sidebar-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: activeTab === tab ? 'rgba(255,255,255,0.05)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {label}
                {tab === 'active' && myBids.filter(b => b.status === 'pending').length > 0 && (
                  <span className="badge" style={{ background: '#fbbf24', color: '#000', border: 'none', fontSize: '0.7rem' }}>{myBids.filter(b => b.status === 'pending').length}</span>
                )}
                {tab === 'won' && acceptedBids.length > 0 && (
                  <span className="badge" style={{ background: '#34d399', color: '#000', border: 'none', fontSize: '0.7rem' }}>{acceptedBids.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Filter */}
          {activeTab === 'matches' && (
            <div className="glass-panel" style={{ padding: '1rem', marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Filter by type</div>
              {['all', 'service', 'product'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0.5rem', borderRadius: 'var(--radius-sm)', background: filter === f ? 'rgba(255,255,255,0.05)' : 'transparent', color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                  {f === 'all' ? '📦 All' : f === 'service' ? '🛠 Services' : '🏷 Products'}
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="card-list">
          {activeTab === 'matches' && (
            filteredReqs.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                No requirements posted yet. Check back soon!
              </div>
            ) : filteredReqs.map((req, index) => (
              <div key={req.id} className={`item-card glass-panel stagger-${(index % 4) + 1}`}
                style={{ border: newReqIds.has(req.id) ? '1px solid var(--primary-color)' : undefined, transition: 'border 0.3s' }}>
                {newReqIds.has(req.id) && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--primary-color)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>NEW</div>
                )}
                <div className="item-main">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge" style={{ background: req.type === 'product' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)', color: req.type === 'product' ? '#818cf8' : '#34d399' }}>
                          {req.type === 'product' ? 'Product' : 'Service'}
                        </span>
                        {alreadyBid(req.id) && <span className="badge" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>Bid Submitted</span>}
                      </div>
                      <h3 className="item-title" style={{ marginTop: '0.25rem' }}>{req.title}</h3>
                    </div>
                    <div className="item-price">{req.budgetText || req.budget}</div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{req.description}</p>
                  <div className="item-meta">
                    <div className="item-meta-item"><Clock size={14} /> {req.postedAt}</div>
                    <div className="item-meta-item" style={{ marginLeft: '1rem' }}><Zap size={14} color={req.bidsCount > 0 ? '#fbbf24' : undefined} /> {req.bidsCount} bids</div>
                    {req.timelineText && <div className="item-meta-item" style={{ marginLeft: '1rem' }}>⏱ {req.timelineText}</div>}
                  </div>
                </div>
                <div style={{ marginLeft: '1.5rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', minWidth: '130px' }}>
                  {alreadyBid(req.id) ? (
                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#fbbf24' }}>⏳ Awaiting response</div>
                  ) : (
                    <button className="btn btn-primary" onClick={() => openBidModal(req)}>Submit Bid</button>
                  )}
                  {req.postedBy && (
                    <button className="btn btn-secondary" style={{ padding: '0.6rem', display: 'flex', justifyContent: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer', width: '100%' }}
                      onClick={() => {
                        const room = [userName, req.postedBy].sort().join('_') + '_' + req.id;
                        navigate(`/chat/${room}`, { state: { sellerName: req.postedBy, reqTitle: req.title } });
                      }}>
                      <MessageSquare size={15} /> Message {req.postedBy}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {activeTab === 'active' && (
            myBids.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                You haven't submitted any bids yet.
              </div>
            ) : myBids.map(bid => (
              <div key={bid.id} className="item-card glass-panel">
                <div className="item-main">
                  <h3 className="item-title">{bid.reqTitle}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.4rem 0' }}>{bid.proposal}</p>
                  <div className="item-meta">
                    <div className="item-meta-item"><Clock size={14} /> Delivery: {bid.delivery}</div>
                    <div className="item-meta-item" style={{ marginLeft: '1rem' }}>Amount: <strong style={{ color: '#34d399' }}>₹{bid.amount}</strong></div>
                  </div>
                </div>
                <div style={{ marginLeft: '1.5rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minWidth: '120px' }}>
                  <span style={{ fontWeight: 'bold', color: statusColor[bid.status], fontSize: '0.9rem' }}>
                    {bid.status === 'pending' ? '⏳ Pending' : bid.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                  </span>
                  {bid.status === 'accepted' && bid.buyerName && (
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.3rem', alignItems: 'center', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        const room = [userName, bid.buyerName].sort().join('_') + '_' + bid.reqId;
                        navigate(`/chat/${room}`, { state: { sellerName: bid.buyerName, reqTitle: bid.reqTitle } });
                      }}>
                      <MessageSquare size={13} /> Chat with {bid.buyerName}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {activeTab === 'won' && (
            acceptedBids.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                No won projects yet. Keep bidding!
              </div>
            ) : acceptedBids.map(bid => (
              <div key={bid.id} className="item-card glass-panel">
                <div className="item-main">
                  <h3 className="item-title">{bid.reqTitle}</h3>
                  <div className="item-meta">
                    <div className="item-meta-item">Amount: <strong style={{ color: '#34d399' }}>₹{bid.amount}</strong></div>
                    <div className="item-meta-item" style={{ marginLeft: '1rem' }}>Delivery: {bid.delivery}</div>
                  </div>
                </div>
                <div style={{ marginLeft: '1.5rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                  <span className="badge" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>✅ Won</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showBidModal && selectedReq && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Submit Proposal</h3>
              <button className="btn-icon" style={{ width: '30px', height: '30px' }} onClick={closeBidModal}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <div style={{ background: 'var(--surface-color-2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>{selectedReq.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Budget: {selectedReq.budgetText || selectedReq.budget} · {selectedReq.timelineText || selectedReq.timeline}</div>
              </div>
              <form onSubmit={handleBidSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Your Bid Amount (₹)</label>
                    <input type="number" className="input-field" placeholder="e.g. 15000" value={bidAmount} onChange={e => setBidAmount(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Estimated Delivery</label>
                    <input type="text" className="input-field" placeholder="e.g. 2 Weeks" value={bidDelivery} onChange={e => setBidDelivery(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Your Proposal</label>
                  <textarea className="input-field" placeholder="Describe your approach and why you're the best fit..." style={{ minHeight: '120px' }} value={bidProposal} onChange={e => setBidProposal(e.target.value)} required />
                </div>
                <div className="flex-space" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bidding as <strong>{userName}</strong></span>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Send Proposal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
