import React from 'react';

const Navbar = ({
  connected,
  publicKey,
  onConnect,
  onDisconnect,
  network,
  connecting
}) => {
  const shortenedAddress = publicKey
    ? `${publicKey.slice(0, 5)}...${publicKey.slice(-5)}`
    : '';

  const isNetworkWrong = network && network !== 'TESTNET';

  return (
    <header className="navbar-header">
      <div className="navbar-container layout-width">
        <div className="navbar-left">
          <div className="logo-group">
            <svg className="logo-svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              <path d="M2 12h20"></path>
            </svg>
            <span className="logo-text">StellarFlow</span>
          </div>
          <span className="logo-badge">Testnet Payments</span>
        </div>

        <div className="navbar-right">
          {/* Network Badge */}
          {connected && (
            <div className={`badge ${isNetworkWrong ? 'badge-warning' : 'badge-testnet'}`}>
              <span className="pulse-dot"></span>
              {isNetworkWrong ? `Wrong Network: ${network}` : 'Stellar Testnet'}
            </div>
          )}

          {/* Connected Address & Action */}
          {connected ? (
            <div className="navbar-user-card">
              <span className="navbar-address" title={publicKey}>
                {shortenedAddress}
              </span>
              <button className="btn btn-secondary btn-disconnect" onClick={onDisconnect} aria-label="Disconnect wallet">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="disconnect-text">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onConnect}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <div className="spinner"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                  </svg>
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
