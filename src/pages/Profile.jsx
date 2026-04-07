import React from 'react';
import { Star, MapPin, Award, Clock, Briefcase, ExternalLink, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="container section animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Header Profile Info */}
      <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'var(--gradient-main)', opacity: 0.8 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem', alignItems: 'flex-end', marginTop: '40px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)', border: '4px solid var(--bg-color)', boxShadow: 'var(--shadow-lg)' }}>
            SP
          </div>
          
          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
            <div className="flex-space">
              <div>
                <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Sarah Pro <Award size={24} color="#34d399" />
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', margin: '0.25rem 0' }}>Senior UI/UX Designer & Frontend Developer</p>
                <div className="flex-gap" style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  <span className="flex-gap"><MapPin size={14} /> Austin, TX (Remote)</span>
                  <span className="flex-gap" style={{ marginLeft: '1rem' }}><Clock size={14} /> Response Time: &lt; 2 hrs</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/chat/1" className="btn btn-primary"><MessageSquare size={18} /> Message</Link>
                <button className="btn btn-secondary">Invite to Job</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Col - Stats & Skills */}
        <aside className="sidebar">
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Statistics</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Job Success</span>
              <strong style={{ color: '#10b981' }}>98%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Jobs</span>
              <strong>42</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rating</span>
              <strong className="flex-gap"><Star size={14} fill="#fbbf24" color="#fbbf24" /> 4.9</strong>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="badge">UI/UX</span>
              <span className="badge">Figma</span>
              <span className="badge">React</span>
              <span className="badge">Tailwind</span>
              <span className="badge">Wireframing</span>
              <span className="badge">Prototyping</span>
            </div>
          </div>
        </aside>

        {/* Right Col - Portfolio & Reviews */}
        <div className="card-list">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>About Me</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              I specialize in creating beautiful, highly functional interfaces for SaaS and Fintech companies. With over 6 years of experience blending design systems with modern frontend technologies, I ensure that the user experience is flawless from the design comp all the way to production.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Portfolio Highlights</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ height: '150px', background: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80) center/cover', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '0.5rem', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)', color: 'white', fontSize: '0.8rem' }}>Fintech Dashboard</div>
              </div>
              <div style={{ height: '150px', background: 'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80) center/cover', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '0.5rem', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)', color: 'white', fontSize: '0.8rem' }}>E-commerce Mobile App</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Recent Reviews</h2>
            
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="flex-space" style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>SaaS Platform Redesign</strong>
                <div className="flex-gap" style={{ color: '#fbbf24' }}>
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>"Sarah was incredible to work with. She completely transformed our user flow and the resulting analytics show a 40% increase in conversions. Highly recommended!"</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>- Michael R., 2 weeks ago</div>
            </div>

            <div>
              <div className="flex-space" style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>Landing Page Conversion Optimization</strong>
                <div className="flex-gap" style={{ color: '#fbbf24' }}>
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>"Fast, professional, and delivered exactly what we needed. She understood the brief perfectly."</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>- TechVentures LLC, 1 month ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
