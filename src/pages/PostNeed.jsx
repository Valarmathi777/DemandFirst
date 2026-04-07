import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';

const PostNeed = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { addRequirement, isAuthenticated } = useMarketplace();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup?role=buyer', { state: { from: '/post-need' } });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    type: 'service', title: '', category: '', description: '', budget: '', timeline: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRequirement(formData);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/buyer-dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="container section" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px' }}>
          <CheckCircle2 size={64} style={{ color: '#34d399', margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Success!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your requirement has been broadcasted to qualified sellers. Sit back and watch the bids roll in.
          </p>
          <div className="badge">Redirecting to Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section animate-fade-in" style={{ maxWidth: '800px', padding: '4rem 2rem' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <span className="badge" style={{ marginBottom: '1rem' }}>Create Listing</span>
        <h1 className="page-title">What do you <span className="text-gradient">need?</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Provide details so professionals can give you accurate bids.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Project Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field" 
              placeholder="e.g. Design a Landing Page for a SaaS Startup" 
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="input-label">What do you need?</label>
              <div style={{ display: 'flex', background: 'var(--surface-color-1)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'service', category: ''})}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: formData.type === 'service' ? 'var(--primary-color)' : 'transparent', color: formData.type === 'service' ? 'white' : 'var(--text-secondary)' }}
                >
                  Service / Project
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'product', category: ''})}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: formData.type === 'product' ? 'var(--primary-color)' : 'transparent', color: formData.type === 'product' ? 'white' : 'var(--text-secondary)' }}
                >
                  Physical Product
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="input-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field" required style={{ appearance: 'none' }}>
                <option value="">Select a category</option>
                {formData.type === 'service' ? (
                  <>
                    <option value="dev">Web & Software Dev</option>
                    <option value="design">Design & Creative</option>
                    <option value="writing">Writing & Translation</option>
                    <option value="marketing">Sales & Marketing</option>
                    <option value="admin">Admin Support</option>
                  </>
                ) : (
                  <>
                    <option value="electronics">Electronics & Hardware</option>
                    <option value="merchandise">Custom Merchandise</option>
                    <option value="bulk">Bulk Goods & Materials</option>
                    <option value="vehicles">Vehicles & Parts</option>
                    <option value="equipment">Industrial Equipment</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Detailed Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field" 
              placeholder="Describe your exact requirements, features needed, and any examples you like..."
              required
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="input-label">Budget Range (INR)</label>
              <select name="budget" value={formData.budget} onChange={handleChange} className="input-field" required style={{ appearance: 'none' }}>
                <option value="">Select Budget</option>
                <option value="small">Less than ₹5,000</option>
                <option value="medium">₹5,000 - ₹25,000</option>
                <option value="large">₹25,000 - ₹100,000</option>
                <option value="xlarge">₹100,000+</option>
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="input-label">Timeline</label>
              <select name="timeline" value={formData.timeline} onChange={handleChange} className="input-field" required style={{ appearance: 'none' }}>
                <option value="">Select Timeline</option>
                <option value="urgent">Urgent (Within 48h)</option>
                <option value="week">Within 1 week</option>
                <option value="month">Within 1 month</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1.1rem' }}>
              <Sparkles size={20} />
              Post Requirement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostNeed;
