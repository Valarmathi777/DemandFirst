import React, { useState } from 'react';
import { Clock, MessageSquare, Briefcase, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';

const BuyerDashboard = () => {
  const { requirements, isAuthenticated, userRole, userName, acceptBid, rejectBid } = useMarketplace();
  const navigate = useNavigate();
  const [expandedReq, setExpandedReq] = useState(null);

  if (!isAuthenticated || userRole !== 'buyer') {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You must be logged in as a Buyer.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Log In as Buyer</button>
      </div>
    );
  }

  const myRequirements = requirements.filter(r => r.postedBy === userName);
  const totalBids = myRequirements.reduce((a, r) => a + r.bidsCount, 0);
  const hired = myRequirements.filter(r => r.status === 'hired');

  return (
    <div className="container section animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Welcome, <span className="text-gradient">{userName}</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your requirements and review incoming bids in real-time.</p>
        </div>
        <Link to="/post-need" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> Post New Need
        </Link>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'My Requirements', value: myRequirements.length, color: '#818cf8' },
          { label: 'Total Bids Received', value: totalBids, color: '#ec4899' },
          { label: 'Hired / Completed', value: hired.length, color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} /> My Requirements
            </div>
            <Link to="/chat/general" className="sidebar-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} /> Messages
              {totalBids > 0 && <span className="badge" style={{ marginLeft: 'auto', background: '#ec4899', color: 'white', border: 'none' }}>{totalBids}</span>}
            </Link>
          </div>
        </aside>

        {/* Content */}
        <div className="card-list">
          {myRequirements.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No requirements yet</h3>
              <p style={{ marginBottom: '1.5rem' }}>Post your first need and let sellers come to you.</p>
              <Link to="/post-need" className="btn btn-primary">Post a Need</Link>
            </div>
          ) : (
            myRequirements.map((req, index) => (
              <React.Fragment key={req.id}>
                <div className={`item-card glass-panel stagger-${(index % 4) + 1}`}>
                  <div className="item-main">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge" style={{ background: req.type === 'product' ? 'rgba(99,102,241,0.1)' : 'rgba(236,72,153,0.1)', color: req.type === 'product' ? '#818cf8' : '#ec4899' }}>
                          {req.type === 'product' ? 'Product' : 'Service'}
                        </span>
                        <h3 className="item-title" style={{ margin: 0 }}>{req.title}</h3>
                      </div>
                      <span className={`status-badge ${req.status === 'hired' ? '' : 'status-active'}`} style={req.status === 'hired' ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.8rem' } : {}}>
                        {req.status === 'hired' ? '✅ Hired' : `Active · ${req.bidsCount} Bid${req.bidsCount !== 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0' }}>{req.description}</p>
                    <div className="item-meta">
                      <div className="item-meta-item"><Clock size={16} /> {req.postedAt}</div>
                      <div className="item-meta-item" style={{ marginLeft: '1rem' }}>Budget: <strong>{req.budgetText || req.budget}</strong></div>
                      <div className="item-meta-item" style={{ marginLeft: '1rem' }}>Timeline: <strong>{req.timelineText || req.timeline}</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', minWidth: '140px', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)', marginLeft: '1.5rem', gap: '0.5rem', justifyContent: 'center' }}>
                    {req.bidsCount > 0 ? (
                      <>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                          <span style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '1.2rem' }}>{req.bidsCount}</span> bid{req.bidsCount !== 1 ? 's' : ''}
                        </div>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                          onClick={() => setExpandedReq(expandedReq === req.id ? null : req.id)}
                        >
                          {expandedReq === req.id ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> View Bids</>}
                        </button>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>⏳</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Waiting...</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Bids */}
                {expandedReq === req.id && req.bids && req.bids.length > 0 && (
                  <div style={{ marginTop: '-0.5rem', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '3px solid var(--primary-color)' }}>
                    {req.bids.map(bid => (
                      <div key={bid.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                              {bid.sellerName?.slice(0, 2).toUpperCase() || 'S'}
                            </div>
                            <div>
                              <strong>{bid.sellerName}</strong>
                              <span style={{ marginLeft: '0.75rem', color: '#34d399', fontWeight: 'bold' }}>₹{bid.amount}</span>
                            </div>
                            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🕐 {bid.delivery}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{bid.proposal}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                          {bid.status === 'pending' ? (
                            <>
                              <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => acceptBid(req.id, bid.id)}>✔ Accept</button>
                              <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }} onClick={() => rejectBid(req.id, bid.id)}>✖ Reject</button>
                            </>
                          ) : bid.status === 'accepted' ? (
                            <>
                              <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.85rem', textAlign: 'center' }}>✅ Accepted</span>
                              <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}
                                onClick={() => {
                                  const room = [userName, bid.sellerName].sort().join('_') + '_' + req.id;
                                  navigate(`/chat/${room}`, { state: { sellerName: bid.sellerName, reqTitle: req.title } });
                                }}>
                                <MessageSquare size={13} /> Message
                              </button>
                            </>
                          ) : (
                            <span style={{ fontWeight: 'bold', color: '#f87171', fontSize: '0.85rem', textAlign: 'center' }}>❌ Rejected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
