import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Zap, Shield, Star, Briefcase } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="bg-glow" style={{ width: '400px', height: '400px', top: '10%', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="hero-content animate-fade-in">
          <span className="badge" style={{ marginBottom: '1.5rem' }}>The Reverse Marketplace</span>
          <h1 className="hero-title">
            Don't Search. <br />
            <span className="text-gradient">Let Them Come To You.</span>
          </h1>
          <p className="hero-subtitle">
            Post your project requirements or product needs once, and receive competitive bids from top-rated professionals and vendors. The smart, demand-driven way to buy.
          </p>
          <div className="hero-actions">
            <Link to="/post-need" className="btn btn-primary">
              Post Your Need <ArrowRight size={18} />
            </Link>
            <Link to="/seller-dashboard" className="btn btn-secondary">
              Browse Matches
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section container">
        <div className="text-center" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Why DemandFirst?</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Flipping the traditional marketplace model to give you the leverage.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass-panel animate-fade-in stagger-1">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3 className="feature-title">Instant Matches</h3>
            <p className="feature-desc">Our AI-driven algorithm instantly notifies relevant sellers the moment you post a need.</p>
          </div>
          
          <div className="feature-card glass-panel animate-fade-in stagger-2">
            <div className="feature-icon-wrapper">
              <Search size={24} />
            </div>
            <h3 className="feature-title">Zero Search Fatigue</h3>
            <p className="feature-desc">Stop endless scrolling. Buyers state what they want, and sellers compete to fulfill it.</p>
          </div>
          
          <div className="feature-card glass-panel animate-fade-in stagger-3">
            <div className="feature-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3 className="feature-title">Better Pricing</h3>
            <p className="feature-desc">Sellers see exactly what you need and offer their best price to win your business upfront.</p>
          </div>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="section container" style={{ marginTop: '4rem', marginBottom: '6rem' }}>
        <div className="glass-panel" style={{ padding: '4rem', background: 'var(--surface-color-1)' }}>
          <div className="text-center" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>How It Works</h2>
          </div>
          <div className="features-grid" style={{ marginTop: '0' }}>
            <div className="text-center" style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'var(--gradient-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
              <h4>Post Requirement</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Detail your exact needs and budget.</p>
            </div>
            <div className="text-center" style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'var(--gradient-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
              <h4>Receive Bids</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Qualified sellers and vendors submit their best offers.</p>
            </div>
            <div className="text-center" style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'var(--gradient-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
              <h4>Select & Pay</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Choose the winner and get work done securely.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
