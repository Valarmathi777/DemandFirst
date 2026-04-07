import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, Mail, Lock, User, Briefcase, Sparkles, Code, Palette, Megaphone, PenTool, Package, Wrench } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

const SPECIALTIES = [
  { value: 'software', label: 'Software Developer', icon: '💻' },
  { value: 'design', label: 'UI/UX Designer', icon: '🎨' },
  { value: 'marketing', label: 'Digital Marketer', icon: '📣' },
  { value: 'content', label: 'Content Writer', icon: '✍️' },
  { value: 'video', label: 'Video Editor', icon: '🎬' },
  { value: 'data', label: 'Data Analyst', icon: '📊' },
  { value: 'product', label: 'Product Supplier', icon: '📦' },
  { value: 'other', label: 'Other', icon: '🔧' },
];

const Auth = () => {
  const { login } = useMarketplace();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname.includes('login'));
  const [role, setRole] = useState('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [offerType, setOfferType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && role === 'seller' && !specialty) { setError('Please select your specialty'); return; }
    if (!isLogin && role === 'seller' && !offerType) { setError('Please select what you offer'); return; }
    setIsLoading(true);
    setError('');
    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const body = isLogin
        ? { email, password, role }
        : { name, email, password, role, specialty: role === 'seller' ? specialty : null, offerType: role === 'seller' ? offerType : null };
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); setIsLoading(false); return; }
      login(data.role, data.name, data.specialty, data.offerType);
      if (location.state?.from) navigate(location.state.from);
      else if (data.role === 'buyer') navigate('/buyer-dashboard');
      else navigate('/seller-dashboard');
    } catch {
      setError('Cannot connect to server. Make sure the server is running.');
    }
    setIsLoading(false);
  };

  return (
    <div className="container section animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: role === 'seller' && !isLogin ? '560px' : '480px', position: 'relative', overflow: 'hidden', transition: 'max-width 0.3s ease' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-color)', filter: 'blur(60px)', borderRadius: '50%', opacity: 0.5, zIndex: 0 }}></div>

        <div style={{ padding: '3rem 2.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Layers size={40} style={{ color: 'var(--primary-color)' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome back' : <>Join <span className="text-gradient">DemandFirst</span></>}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? 'Enter your details to access your dashboard.' : 'Create an account to get started.'}
            </p>
          </div>

          {/* Role Selector */}
          <div style={{ display: 'flex', background: 'var(--surface-color-1)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
            {[['buyer', <><Sparkles size={16} /> I want to Buy</>], ['seller', <><Briefcase size={16} /> I want to Sell</>]].map(([r, label]) => (
              <button key={r} type="button" onClick={() => { setRole(r); setSpecialty(''); setOfferType(''); setError(''); }}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'calc(var(--radius-md) - 2px)', background: role === r ? 'var(--surface-color-3)' : 'transparent', color: role === r ? 'white' : 'var(--text-secondary)', fontWeight: role === r ? '600' : '400', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: role === r ? '1px solid var(--border-color)' : '1px solid transparent', transition: 'all 0.3s ease' }}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-tertiary)' }} />
                <input type="text" className="input-field" placeholder="John Doe" style={{ paddingLeft: '2.5rem' }} value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-tertiary)' }} />
                <input type="email" className="input-field" placeholder="you@example.com" style={{ paddingLeft: '2.5rem' }} value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-tertiary)' }} />
                <input type="password" className="input-field" placeholder="••••••••" style={{ paddingLeft: '2.5rem' }} value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            {/* Seller-only fields on signup */}
            {role === 'seller' && !isLogin && (
              <>
                <div className="form-group">
                  <label className="input-label">Your Specialty</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {SPECIALTIES.map(s => (
                      <button key={s.value} type="button" onClick={() => setSpecialty(s.value)}
                        style={{ padding: '0.6rem 0.4rem', borderRadius: 'var(--radius-md)', border: specialty === s.value ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', background: specialty === s.value ? 'rgba(99,102,241,0.15)' : 'var(--surface-color-1)', color: specialty === s.value ? 'white' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', transition: 'all 0.2s' }}>
                        <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">What do you offer?</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[['service', '🛠 Services / Projects'], ['product', '📦 Physical Products'], ['both', '✨ Both']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setOfferType(val)}
                        style={{ flex: 1, padding: '0.65rem', borderRadius: 'var(--radius-md)', border: offerType === val ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', background: offerType === val ? 'rgba(99,102,241,0.15)' : 'var(--surface-color-1)', color: offerType === val ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }} disabled={isLoading}>
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg className="animate-spin" viewBox="0 0 24 24" width="20" height="20">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" style={{ opacity: 0.25 }}></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isLogin ? `Log in as ${role === 'buyer' ? 'Buyer' : 'Seller'}` : `Create ${role === 'buyer' ? 'Buyer' : 'Seller'} Account`
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setSpecialty(''); setOfferType(''); }}
              style={{ color: 'var(--primary-color)', fontWeight: '600', padding: 0 }}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
