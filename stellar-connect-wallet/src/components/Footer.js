import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content layout-width">
        <div className="footer-left">
          <div className="footer-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              <path d="M2 12h20"></path>
            </svg>
            <span>StellarFlow</span>
          </div>
          <p className="footer-tagline">
            Sleek testnet payment portals for the Stellar ecosystem.
          </p>
        </div>

        <div className="footer-center">
          <div className="footer-disclaimer">
            <span className="disclaimer-title">Testnet Disclaimer</span>
            <p className="disclaimer-text">
              This application is connected to the Stellar Test network. All transacted assets (XLM) are simulated test tokens and have zero monetary value.
            </p>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-links">
            <a href="https://github.com/Kritika23083/stellar-frontend-challenge" target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub Repository
            </a>
            <span className="footer-credit">Powered by <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer">Freighter Wallet</a></span>
            <span className="footer-copy">&copy; {currentYear} StellarFlow. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
