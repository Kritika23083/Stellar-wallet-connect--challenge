import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WalletCard from './components/WalletCard';
import SendPaymentForm from './components/SendPaymentForm';
import TransactionStatusModal from './components/TransactionStatusModal';
import Footer from './components/Footer';

import {
  isWalletInstalled,
  checkConnection,
  retrievePublicKey,
  getWalletNetwork,
  getBalance,
  sendPayment
} from './components/Freighter';

function App() {
  // Wallet states
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState('0.0000');
  const [isActivated, setIsActivated] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [network, setNetwork] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Transaction states
  const [txStatus, setTxStatus] = useState('idle'); // 'idle' | 'signing' | 'submitting' | 'success' | 'error'
  const [txError, setTxError] = useState('');
  const [txHash, setTxHash] = useState('');
  
  // Cache form values for retries
  const [lastTx, setLastTx] = useState({ recipient: '', amount: '', recipientExists: true });

  // Initialize and check Freighter availability
  useEffect(() => {
    const init = async () => {
      const installed = await isWalletInstalled();
      setIsInstalled(installed);
      
      if (installed) {
        // Fetch current network details
        const net = await getWalletNetwork();
        setNetwork(net);

        // Try silently connecting if the user has already approved permissions
        try {
          const address = await retrievePublicKey();
          if (address) {
            setPublicKey(address);
            setConnected(true);
            await fetchBalance(address);
          }
        } catch (e) {
          // Permissions not set or user not connected yet. Silent ignore.
        }
      }
    };
    init();
  }, []);

  // Poll for changes in wallet (address or network change in the extension)
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(async () => {
      try {
        const address = await retrievePublicKey();
        const net = await getWalletNetwork();

        if (address !== publicKey) {
          setPublicKey(address);
          await fetchBalance(address);
        }

        if (net !== network) {
          setNetwork(net);
        }
      } catch (err) {
        // Account locked or disconnected via extension
        handleDisconnect();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [connected, publicKey, network]);

  // Fetch balance helper
  const fetchBalance = async (address) => {
    setLoadingBalance(true);
    try {
      const res = await getBalance(address);
      setBalance(res.balance);
      setIsActivated(res.isActivated);
    } catch (err) {
      console.error("Error loading account balance:", err);
      // Fallback values
      setBalance('0.0000');
      setIsActivated(false);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Connect wallet handler
  const handleConnect = async () => {
    setConnecting(true);
    try {
      const allowed = await checkConnection();
      if (!allowed) {
        alert("Wallet authorization denied. Please allow access in Freighter.");
        return;
      }
      const address = await retrievePublicKey();
      setPublicKey(address);
      setConnected(true);
      
      // Load network and balance details
      const net = await getWalletNetwork();
      setNetwork(net);
      await fetchBalance(address);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      alert("Failed to connect. Check that Freighter is unlocked and try again.");
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet handler
  const handleDisconnect = () => {
    setConnected(false);
    setPublicKey('');
    setBalance('0.0000');
    setIsActivated(false);
    setNetwork(null);
  };

  // Main payment execution handler
  const handleSendPayment = async ({ recipient, amount, recipientExists }) => {
    // Save last transaction parameters in case of errors / retries
    setLastTx({ recipient, amount, recipientExists });
    
    setTxStatus('signing');
    setTxError('');
    setTxHash('');

    try {
      const result = await sendPayment({
        sender: publicKey,
        recipient,
        amount,
        recipientExists
      });

      setTxStatus('submitting');
      setTxHash(result.hash);
      setTxStatus('success');

      // Refresh sender balance
      await fetchBalance(publicKey);
    } catch (err) {
      console.error("Payment execution failed:", err);
      setTxError(err.message || "An unexpected error occurred during submission.");
      setTxStatus('error');
    }
  };

  // Retry handler
  const handleRetry = () => {
    if (lastTx.recipient && lastTx.amount) {
      handleSendPayment(lastTx);
    }
  };

  const handleCloseModal = () => {
    setTxStatus('idle');
  };

  return (
    <div className="app-container">
      {/* Background visual graphics */}
      <div className="ambient-bg">
        <div className="stars"></div>
      </div>

      {/* Top Navbar */}
      <Navbar
        connected={connected}
        publicKey={publicKey}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        network={network}
        connecting={connecting}
      />

      {/* Main Content Dashboard */}
      <main style={{ flex: '1', zIndex: 1, padding: '40px 0' }}>
        {/* Intro / Hero */}
        <HeroSection />

        {/* Action Panel */}
        <div className="main-layout-grid layout-width">
          <WalletCard
            connected={connected}
            publicKey={publicKey}
            balance={balance}
            isActivated={isActivated}
            loadingBalance={loadingBalance}
            isInstalled={isInstalled}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onRefreshBalance={() => fetchBalance(publicKey)}
            connecting={connecting}
          />
          <SendPaymentForm
            connected={connected}
            balance={balance}
            isActivated={isActivated}
            onSend={handleSendPayment}
            onConnect={handleConnect}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Transaction status Modal Overlay */}
      <TransactionStatusModal
        status={txStatus}
        error={txError}
        txHash={txHash}
        recipient={lastTx.recipient}
        amount={lastTx.amount}
        onClose={handleCloseModal}
        onRetry={handleRetry}
      />
    </div>
  );
}

export default App;
