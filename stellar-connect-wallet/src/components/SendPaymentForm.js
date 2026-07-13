import React, { useState, useEffect } from 'react';
import { isValidAddress, checkRecipientAccount } from './Freighter';

const SendPaymentForm = ({
  connected,
  balance,
  isActivated,
  onSend,
  onConnect
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  
  // Validation states
  const [recipientError, setRecipientError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [checkingRecipient, setCheckingRecipient] = useState(false);
  const [recipientExists, setRecipientExists] = useState(null); // null, true, false

  // Validate address on change
  useEffect(() => {
    if (!recipient) {
      setRecipientError('');
      setRecipientExists(null);
      return;
    }

    if (!isValidAddress(recipient)) {
      setRecipientError('Invalid Stellar public key. Must start with "G" and be 56 characters.');
      setRecipientExists(null);
      return;
    }

    setRecipientError('');
    
    // Check if recipient exists on-chain
    const verifyRecipient = async () => {
      setCheckingRecipient(true);
      try {
        const { exists } = await checkRecipientAccount(recipient);
        setRecipientExists(exists);
      } catch (err) {
        console.error("Error verifying recipient account:", err);
        // Fallback to true if Horizon request fails, to avoid blocking
        setRecipientExists(true);
      } finally {
        setCheckingRecipient(false);
      }
    };

    verifyRecipient();
  }, [recipient]);

  // Validate amount
  useEffect(() => {
    if (!amount) {
      setAmountError('');
      return;
    }

    const val = Number(amount);
    if (isNaN(val) || val <= 0) {
      setAmountError('Amount must be a positive number.');
      return;
    }

    const fee = 0.00001; // BASE_FEE
    const maxSendable = Number(balance) - fee;

    if (val > maxSendable) {
      setAmountError(`Insufficient balance. Maximum sendable is ${(maxSendable < 0 ? 0 : maxSendable).toFixed(4)} XLM.`);
      return;
    }

    if (recipientExists === false && val < 1.0) {
      setAmountError('Recipient account is not activated. A minimum of 1.0 XLM is required to activate a new account.');
      return;
    }

    setAmountError('');
  }, [amount, balance, recipientExists]);

  const handleMax = () => {
    const fee = 0.00001;
    const maxSendable = Number(balance) - fee;
    if (maxSendable > 0) {
      setAmount(maxSendable.toFixed(4));
    } else {
      setAmount('0');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!connected) {
      onConnect();
      return;
    }
    
    if (!recipient || recipientError || !amount || amountError || checkingRecipient) {
      return;
    }

    onSend({
      recipient,
      amount,
      recipientExists: recipientExists !== false, // Default to true if not verified
    });
  };

  const isFormValid =
    connected &&
    isActivated &&
    recipient &&
    !recipientError &&
    amount &&
    !amountError &&
    !checkingRecipient;

  return (
    <div className="glass-card send-payment-card">
      <h3 className="card-title" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span>Send Testnet XLM</span>
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Recipient Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="recipient">Recipient Stellar Address</label>
          <div className="input-container">
            <input
              id="recipient"
              type="text"
              className={`input-field ${recipientError ? 'input-field-error' : ''}`}
              placeholder="e.g. GB23... (56 character public key)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              disabled={!connected || !isActivated}
              autoComplete="off"
            />
          </div>
          {recipientError && (
            <div className="form-error">
              <span>{recipientError}</span>
            </div>
          )}
          {checkingRecipient && (
            <div className="form-help-text text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '4px' }}>
              <div className="spinner spinner-xs"></div>
              <span>Checking recipient account status...</span>
            </div>
          )}
          {recipientExists === true && !recipientError && !checkingRecipient && (
            <div className="form-success-text" style={{ color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Recipient Account Active (Standard Payment)</span>
            </div>
          )}
          {recipientExists === false && !recipientError && !checkingRecipient && (
            <div className="form-warning-text" style={{ color: 'var(--warning)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Recipient Account Inactive (Requires Create Account, min 1.0 XLM)</span>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Amount</label>
          <div className="input-container">
            <input
              id="amount"
              type="text"
              className={`input-field ${amountError ? 'input-field-error' : ''}`}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!connected || !isActivated}
              autoComplete="off"
            />
            {connected && isActivated && (
              <button
                type="button"
                className="input-max-btn"
                onClick={handleMax}
              >
                MAX
              </button>
            )}
            <span className="input-suffix">XLM</span>
          </div>
          {amountError && (
            <div className="form-error">
              <span>{amountError}</span>
            </div>
          )}
        </div>

        {/* Transaction Summary Panel */}
        {connected && isFormValid && (
          <div className="tx-summary-panel">
            <h4 className="summary-title">Transaction Preview</h4>
            <div className="summary-row">
              <span className="summary-label">Recipient</span>
              <span className="summary-value" title={recipient}>
                {recipient.slice(0, 8)}...{recipient.slice(-8)}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Operation Type</span>
              <span className="summary-value">
                {recipientExists ? 'Payment' : 'Create Account (Activation)'}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Estimated Network Fee</span>
              <span className="summary-value">0.00001 XLM</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Network Passphrase</span>
              <span className="summary-value text-gradient">Stellar Testnet</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!connected ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            onClick={onConnect}
          >
            Connect Wallet to Continue
          </button>
        ) : !isActivated ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled
          >
            Activate Wallet to Send
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={!isFormValid}
          >
            Send XLM
          </button>
        )}
      </form>
    </div>
  );
};

export default SendPaymentForm;
