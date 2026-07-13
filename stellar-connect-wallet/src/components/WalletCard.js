import React, { useState } from 'react';
import CopyButton from './CopyButton';
import { fundWithFriendbot } from './Freighter';

const WalletCard = ({
  connected,
  publicKey,
  balance,
  isActivated,
  loadingBalance,
  isInstalled,
  onConnect,
  onDisconnect,
  onRefreshBalance,
  connecting
}) => {
  const [funding, setFunding] = useState(false);
  const [fundingError, setFundingError] = useState('');
  const [fundingSuccess, setFundingSuccess] = useState(false);

  const handleFund = async () => {
    setFunding(true);
    setFundingError('');
    setFundingSuccess(false);
    try {
      await fundWithFriendbot(publicKey);
      setFundingSuccess(true);
      await onRefreshBalance();
      setTimeout(() => setFundingSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setFundingError(err.message || 'Funding failed. Please try again.');
    } finally {
      setFunding(false);
    }
  };

  if (!isInstalled) {
    return (
      <div className="glass-card wallet-card text-center">
        <div className="wallet-card-icon-container">
          <svg className="wallet-icon-alert" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3 className="card-title">Freighter Wallet Not Found</h3>
        <p className="card-desc">
          To interact with Stellar dApps, you need the Freighter browser extension installed.
        </p>
        <div className="card-actions">
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Install Freighter Extension</span>
          </a>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="glass-card wallet-card text-center">
        <div className="wallet-card-icon-container">
          <svg className="wallet-icon-inactive" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h3 className="card-title">Connect Freighter Wallet</h3>
        <p className="card-desc">
          Connect your non-custodial Freighter wallet to sign payments on Stellar Testnet securely. We never store or access your private keys.
        </p>
        <div className="card-actions">
          <button
            className="btn btn-primary"
            onClick={onConnect}
            disabled={connecting}
            style={{ width: '100%' }}
          >
            {connecting ? (
              <>
                <div className="spinner"></div>
                <span>Connecting Wallet...</span>
              </>
            ) : (
              <>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card wallet-card">
      <div className="wallet-card-header">
        <div className="wallet-connected-status">
          <div className="badge badge-connected">
            <span className="pulse-dot"></span>
            <span>Connected</span>
          </div>
        </div>
        <div className="wallet-header-actions">
          <button
            className="btn-icon"
            onClick={onRefreshBalance}
            disabled={loadingBalance}
            title="Refresh balance"
          >
            <svg className={loadingBalance ? "spin-animate" : ""} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
          </button>
          <button
            className="btn-icon btn-icon-danger"
            onClick={onDisconnect}
            title="Disconnect wallet"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="wallet-address-section">
        <span className="wallet-address-label">Wallet Address</span>
        <div className="wallet-address-row">
          <span className="wallet-address-full" title={publicKey}>
            {publicKey}
          </span>
          <CopyButton text={publicKey} label="Copy address" />
        </div>
      </div>

      <div className="wallet-balance-section">
        <span className="wallet-balance-label">Available Balance</span>
        <div className="wallet-balance-value">
          {loadingBalance ? (
            <div className="skeleton" style={{ width: '150px', height: '36px', verticalAlign: 'middle' }}></div>
          ) : (
            <span className="balance-num">{balance} <span className="balance-symbol">XLM</span></span>
          )}
        </div>
      </div>

      {/* Account Activation / Friendbot funding */}
      {!isActivated && !loadingBalance && (
        <div className="alert-box alert-warning">
          <div className="alert-icon-container">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="alert-content">
            <h4 className="alert-title">Account Inactive</h4>
            <p className="alert-message">
              This account does not exist on the Stellar Testnet yet. You must fund it to activate it on-chain.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleFund}
              disabled={funding}
              style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px' }}
            >
              {funding ? (
                <>
                  <div className="spinner"></div>
                  <span>Funding Account...</span>
                </>
              ) : (
                <span>Fund 10,000 XLM via Friendbot</span>
              )}
            </button>
            {fundingError && <span className="error-text" style={{ display: 'block', marginTop: '6px', fontSize: '11px', color: 'var(--error)' }}>{fundingError}</span>}
            {fundingSuccess && <span className="success-text" style={{ display: 'block', marginTop: '6px', fontSize: '11px', color: 'var(--success)' }}>Account funded successfully! Balance updated.</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCard;
