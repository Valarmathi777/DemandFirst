import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Star, ExternalLink, Flag, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const BidComparison = () => {
  const [acceptedId, setAcceptedId] = useState(null);

  const handleAccept = (id) => {
    setAcceptedId(id);
  };

  return (
    <div className="container section animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header flex-space" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="badge" style={{ marginBottom: '0.5rem' }}>Comparing 3 Bids</span>
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Fullstack E-commerce MVP Development</h1>
        </div>
        <Link to="/buyer-dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem' }}>
        
        {/* Bid 1 */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <div className="badge" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)' }}>Best Value</div>
            </div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>SP</div>
            <h3 style={{ margin: 0 }}>Sarah Pro</h3>
            <Link to="/profile/1" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>View Full Profile</Link>
          </div>
          
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Bid Amount</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>₹35,000</div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Estimated Timeline</div>
              <div className="flex-gap" style={{ fontWeight: '500' }}><Clock size={16} /> 3 Weeks</div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Seller Rating</div>
              <div className="flex-gap" style={{ fontWeight: '500' }}><Star size={16} fill="#fbbf24" color="#fbbf24" /> 4.9 (42 jobs)</div>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Proposal Highlights</div>
              <ul style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><CheckCircle size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} /> Includes custom UI toolkit</li>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><CheckCircle size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} /> Next.js + Stripe integration</li>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><CheckCircle size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} /> 1 Month free bug support</li>
              </ul>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            {acceptedId === 1 ? (
              <button className="btn btn-primary" style={{ flex: 1, background: '#10b981', borderColor: '#10b981', pointerEvents: 'none' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} /> Accepted!
              </button>
            ) : acceptedId !== null ? (
              <button className="btn btn-secondary" style={{ flex: 1, opacity: 0.5, pointerEvents: 'none' }}>Declined</button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAccept(1)}>Accept Bid</button>
            )}
            <Link to="/chat/1" className="btn btn-secondary" style={{ padding: '0.75rem' }}><MessageSquare size={18} /></Link>
          </div>
        </div>

        {/* Bid 2 */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderColor: 'var(--primary-color)', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <div className="badge" style={{ background: 'var(--primary-color)', color: 'white' }}>Highest Rated</div>
            </div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-color-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>AT</div>
            <h3 style={{ margin: 0 }}>Apex Tech</h3>
            <Link to="/profile/2" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>View Full Profile</Link>
          </div>
          
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Bid Amount</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>₹48,000</div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Estimated Timeline</div>
              <div className="flex-gap" style={{ fontWeight: '500' }}><Clock size={16} /> 2 Weeks (Fast Track)</div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Seller Rating</div>
              <div className="flex-gap" style={{ fontWeight: '500' }}><Star size={16} fill="#fbbf24" color="#fbbf24" /> 5.0 (124 jobs)</div>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Proposal Highlights</div>
              <ul style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><CheckCircle size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} /> Agency team (Designer + Dev)</li>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><CheckCircle size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} /> Full test coverage included</li>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><XCircle size={16} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} /> Standard UI components only</li>
              </ul>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            {acceptedId === 2 ? (
              <button className="btn btn-primary" style={{ flex: 1, background: '#10b981', borderColor: '#10b981', pointerEvents: 'none' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} /> Accepted!
              </button>
            ) : acceptedId !== null ? (
              <button className="btn btn-secondary" style={{ flex: 1, opacity: 0.5, pointerEvents: 'none' }}>Declined</button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAccept(2)}>Accept Bid</button>
            )}
            <Link to="/chat/2" className="btn btn-secondary" style={{ padding: '0.75rem' }}><MessageSquare size={18} /></Link>
          </div>
        </div>

        {/* Bid 3 */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', opacity: 0.8 }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-color-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>MD</div>
            <h3 style={{ margin: 0 }}>Mike Dev</h3>
            <Link to="/profile/3" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>View Full Profile</Link>
          </div>
          
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Bid Amount</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>₹22,000</div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Estimated Timeline</div>
              <div className="flex-gap" style={{ fontWeight: '500' }}><Clock size={16} /> 6 Weeks</div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Seller Rating</div>
              <div className="flex-gap" style={{ fontWeight: '500' }}><Star size={16} fill="#fbbf24" color="#fbbf24" /> 4.2 (8 jobs)</div>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Proposal Highlights</div>
              <ul style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><CheckCircle size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} /> Cost effective</li>
                <li className="flex-gap" style={{ alignItems: 'flex-start' }}><Flag size={16} color="#fbbf24" style={{ marginTop: '2px', flexShrink: 0 }} /> Part-time capacity only</li>
              </ul>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            {acceptedId === 3 ? (
              <button className="btn btn-primary" style={{ flex: 1, background: '#10b981', borderColor: '#10b981', pointerEvents: 'none' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} /> Accepted!
              </button>
            ) : acceptedId !== null ? (
              <button className="btn btn-secondary" style={{ flex: 1, opacity: 0.5, pointerEvents: 'none' }}>Declined</button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAccept(3)}>Accept Bid</button>
            )}
            <Link to="/chat/3" className="btn btn-secondary" style={{ padding: '0.75rem' }}><MessageSquare size={18} /></Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};
export default BidComparison;
