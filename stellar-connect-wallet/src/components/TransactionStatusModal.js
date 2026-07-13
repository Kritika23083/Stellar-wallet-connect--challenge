import React from 'react';
import CopyButton from './CopyButton';

const TransactionStatusModal = ({
  status, // 'idle', 'signing', 'submitting', 'success', 'error'
  error,
  txHash,
  recipient,
  amount,
  onClose,
  onRetry
}) => {
  if (status === 'idle') return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="glass-card modal-content">
        
        {/* Loading / Signing state */}
        {status === 'signing' && (
          <div className="modal-state-content">
            <div className="modal-icon-container">
              <svg className="modal-icon-glow spin-animate" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3 className="modal-title">Confirm in Wallet</h3>
            <p className="modal-text">
              Please open and sign the transaction in your Freighter extension popup.
            </p>
            <div className="modal-details-box">
              <div>Sending <strong>{amount} XLM</strong></div>
              <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                to {recipient.slice(0, 10)}...{recipient.slice(-10)}
              </div>
            </div>
          </div>
        )}

        {/* Submitting state */}
        {status === 'submitting' && (
          <div className="modal-state-content">
            <div className="modal-icon-container">
              <svg className="modal-icon-glow spin-animate" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
              </svg>
            </div>
            <h3 className="modal-title">Sending Transaction</h3>
            <p className="modal-text">
              Submitting your payment to the Stellar Testnet ledger. This should only take a few seconds...
            </p>
          </div>
        )}

        {/* Success state */}
        {status === 'success' && (
          <div className="modal-state-content animate-fade-in">
            <div className="modal-icon-container success-container">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="modal-title">Payment Completed</h3>
            <p className="modal-text">
              Your transaction has been successfully validated and written to the ledger.
            </p>

            <div className="modal-details-box success-box">
              <div className="success-amount">
                <span className="success-amount-num">{amount}</span>
                <span className="success-amount-symbol">XLM</span>
              </div>
              <div className="success-recipient text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                to {recipient.slice(0, 12)}...{recipient.slice(-12)}
              </div>
            </div>

            {txHash && (
              <div className="hash-box">
                <span className="hash-label">Transaction Hash</span>
                <div className="hash-value-row">
                  <span className="hash-text">{txHash.slice(0, 8)}...{txHash.slice(-8)}</span>
                  <CopyButton text={txHash} label="Copy transaction hash" />
                </div>
              </div>
            )}

            <div className="modal-actions-grid">
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>View Explorer</span>
              </a>
              <button
                className="btn btn-primary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Error / Failure state */}
        {status === 'error' && (
          <div className="modal-state-content animate-fade-in">
            <div className="modal-icon-container error-container">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h3 className="modal-title">Transaction Failed</h3>
            <p className="modal-text" style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              We encountered an issue during submission. See the details below:
            </p>
            <div className="modal-details-box error-box">
              <p className="error-description">{error || 'Unknown error occurred.'}</p>
            </div>
            <div className="modal-actions-grid">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Close
              </button>
              {onRetry && (
                <button
                  className="btn btn-primary"
                  onClick={onRetry}
                  style={{ flex: 1 }}
                >
                  Retry Payment
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TransactionStatusModal;
