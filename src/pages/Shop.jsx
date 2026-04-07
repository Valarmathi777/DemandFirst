import React, { useState } from 'react';
import { ShoppingCart, Star, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useMarketplace } from '../context/MarketplaceContext';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [purchasedItems, setPurchasedItems] = useState({});
  const { directProducts } = useMarketplace();

  const filteredProducts = directProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleBuy = (id) => {
    setPurchasedItems(prev => ({...prev, [id]: true}));
  };

  return (
    <div className="container section animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge" style={{ marginBottom: '1rem' }}>Instant Purchase</span>
        <h1 className="page-title">Direct <span className="text-gradient">Marketplace</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Don't want to wait for bids? Buy ready-made products, hardware, and assets directly from our top-rated sellers instantly.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search products..." 
            style={{ paddingLeft: '3rem' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={20} /> Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {filteredProducts.map((product, index) => (
          <div key={product.id} className={`glass-panel stagger-${(index % 4) + 1}`} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            {/* Image */}
            <div style={{ position: 'relative', height: '220px', background: `url(${product.image}) center/cover no-repeat` }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {product.category}
              </div>
            </div>
            
            {/* Content */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{product.name}</h3>
                <Link to={`/profile/${product.id}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                   Sold by <span style={{ color: 'var(--primary-color)' }}>{product.seller}</span>
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span style={{ fontWeight: 'bold' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>({product.reviews})</span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {product.price}
                </div>
                {purchasedItems[product.id] ? (
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: '#10b981', borderColor: '#10b981', pointerEvents: 'none' }}>
                    <ShoppingCart size={16} /> Purchased!
                  </button>
                ) : (
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => handleBuy(product.id)}>
                    <ShoppingCart size={16} /> Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
