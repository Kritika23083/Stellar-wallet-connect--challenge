import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section layout-width">
      <div className="hero-content">
        <h1 className="hero-title">
          Send XLM at <span className="text-gradient">Stellar Speed</span>
        </h1>
        <p className="hero-subtitle">
          A simple and secure payment experience powered by Stellar Testnet and Freighter Wallet. Send instantly, activate new accounts, and monitor transactions in real-time.
        </p>

        <div className="hero-badges">
          <div className="hero-badge-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span>Stellar Testnet</span>
          </div>
          <div className="hero-badge-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Freighter Wallet</span>
          </div>
          <div className="hero-badge-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>Live Balance</span>
          </div>
          <div className="hero-badge-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Non-custodial</span>
          </div>
        </div>
      </div>

      <div className="hero-graphics">
        <div className="orbit-container">
          <div className="orbit-circle-3">
            <div className="orbit-node orbit-node-3"></div>
          </div>
          <div className="orbit-circle-2">
            <div className="orbit-node orbit-node-2"></div>
          </div>
          <div className="orbit-circle-1">
            <div className="orbit-node orbit-node-1"></div>
          </div>
          <div className="orbit-center-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
